export type CampaignObjective =
  | "sell_tickets"
  | "increase_traffic"
  | "retarget_visitors"
  | "promote_event";

export type CampaignStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type CampaignChannel =
  | "instagram"
  | "facebook"
  | "google"
  | "tiktok"
  | "email"
  | "manual";

export interface CampaignAudience {
  location?: string;
  ageMin?: number;
  ageMax?: number;
  interests?: string[];
}

export interface Campaign {
  id: string;
  organizer_id: string;
  event_id: string;

  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;

  budget: number;

  audience: CampaignAudience;
  channels: CampaignChannel[];

  start_date: string | null;
  end_date: string | null;

  tracking_code: string;

  impressions: number;
  clicks: number;
  ticket_page_visits: number;
  tickets_sold: number;

  revenue: number;
  spend: number;

  created_at: string;
  updated_at: string;
}