import { Page } from "@playwright/test";

export interface ConsoleCapture {
  errors: string[];
  warnings: string[];
  pageErrors: string[];
}

export function captureConsole(page: Page): ConsoleCapture {
  const capture: ConsoleCapture = { errors: [], warnings: [], pageErrors: [] };
  const IGNORE = [
    /\[Fast Refresh\]/i,
    /Download the React DevTools/i,
    /React DevTools/i,
    /favicon\.ico/i,
    /Failed to load resource: the server responded with a status of 404.*favicon/i,
  ];

  page.on("console", (msg) => {
    const text = msg.text();
    if (IGNORE.some((re) => re.test(text))) return;
    if (msg.type() === "error") capture.errors.push(text);
    if (msg.type() === "warning") capture.warnings.push(text);
  });

  page.on("pageerror", (err) => {
    capture.pageErrors.push(err.message);
  });

  return capture;
}