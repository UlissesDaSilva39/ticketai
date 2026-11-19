import { http, HttpResponse } from "msw";
import { config } from "@/lib/config";
import {
  mockArtist,
  mockDiscovery,
  mockAnalytics,
  mockUser,
  mockNotification,
} from "./fixtures";

const base = config.api.baseUrl;

export const handlers = [
  http.post(`${base}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string };
    return HttpResponse.json({ data: { user: { ...mockUser, email: body.email } } });
  }),
  http.post(`${base}/auth/logout`, () => HttpResponse.json({ data: undefined })),
  http.get(`${base}/auth/me`, () => HttpResponse.json({ data: { user: mockUser } })),

  http.get(`${base}/artists`, () =>
    HttpResponse.json({ data: [mockArtist], meta: { page: 1, pageSize: 20, total: 1 } })
  ),
  http.get(`${base}/artists/:id`, ({ params }) =>
    HttpResponse.json({ data: { ...mockArtist, id: params.id as string } })
  ),
  http.get(`${base}/artists/:id/merch`, () => HttpResponse.json({ data: [] })),

  http.get(`${base}/discoveries`, () => HttpResponse.json({ data: [mockDiscovery] })),
  http.get(`${base}/discoveries/:slug`, ({ params }) =>
    HttpResponse.json({ data: { ...mockDiscovery, slug: params.slug as string } })
  ),

  http.get(`${base}/analytics`, () => HttpResponse.json({ data: mockAnalytics })),

  http.get(`${base}/notifications`, () => HttpResponse.json({ data: [mockNotification] })),
  http.post(`${base}/notifications/:id/read`, () => HttpResponse.json({ data: undefined })),

  http.get(`${base}/premium/status`, () =>
    HttpResponse.json({ data: { plan: "free", active: false } })
  ),
];