import { config } from "@/lib/config";
import type { ApiError, ApiResponse, RequestOptions } from "./types";

export class ApiClientError extends Error implements ApiError {
  code: string;
  details?: Record<string, unknown>;
  status: number;

  constructor(err: ApiError) {
    super(err.message);
    this.name = "ApiClientError";
    this.code = err.code;
    this.status = err.status;
    this.details = err.details;
  }
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const base = config.api.baseUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${cleanPath}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function parseError(res: Response): Promise<ApiError> {
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON error */
  }
  const b = body as Record<string, unknown> | null;
  return {
    code: (b?.code as string) ?? `http_${res.status}`,
    message:
      (b?.message as string) ??
      (b?.error as string) ??
      `Request failed with status ${res.status}`,
    details: (b?.details as Record<string, unknown>) ?? undefined,
    status: res.status,
  };
}

export async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    query,
    headers = {},
    signal,
    timeoutMs = config.api.timeoutMs,
  } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) signal.addEventListener("abort", () => controller.abort());

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";

  try {
    const res = await fetch(buildUrl(path, query), {
      method,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "include",
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) throw new ApiClientError(await parseError(res));

    if (res.status === 204) return { data: undefined as T };

    const json = (await res.json()) as ApiResponse<T>;
    return json;
  } catch (err) {
    if (err instanceof ApiClientError) throw err;
    if ((err as Error).name === "AbortError") {
      throw new ApiClientError({
        code: "timeout",
        message: "Request timed out",
        status: 0,
      });
    }
    throw new ApiClientError({
      code: "network_error",
      message: "Network request failed",
      status: 0,
    });
  } finally {
    clearTimeout(timeout);
  }
}