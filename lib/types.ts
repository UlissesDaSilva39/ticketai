export type UserRole = "attendee" | "promoter" | "venue" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  stripe_customer_id: string | null;
  stripe_account_id: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  created_at: string;
}

export interface Organizer {
  id: string;
  user_id: string;
  company_name: string | null;
  stripe_account_id: string | null;
  platform_fee_percent: number;
  verified: boolean;
  payout_enabled: boolean;
  created_at: string;
}

export interface Venue {
  id: string;
  organizer_id: string;
  name: string;
  slug: string | null;
  description: string | null;
  venue_type: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  county: string | null;
  postcode: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  capacity: number | null;
  standing_capacity: number | null;
  seated_capacity: number | null;
  accessibility_features: string[];
  timezone: string;
  currency: string;
  hero_image: string | null;
  status: "draft" | "published";
  verified: boolean;
  revenue_share_percent: number;
  total_revenue: number;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  created_at: string;
}

export interface TicketType {
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface Event {
  seatmap_config?: { rows: { label: string; price: number; seats: string[] }[] } | null;
  id: string;
  organizer_id: string;
  venue_id: string | null;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  timezone: string;
  event_type: "in-person" | "live-stream" | "hybrid";
  status: "draft" | "published" | "cancelled";
  hero_image: string | null;
  stream_url: string | null;
  ticket_types: TicketType[];
  fee_handling: "absorb" | "pass";
  views: number;
  preview_audio_url: string | null;
  featured_until: string | null;
  featured_tier: string | null;
  featured_paid: number | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  event_id: string;
  total_amount: number;
  platform_fee: number;
  processing_fee: number;
  currency: string;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  status: "pending" | "paid" | "refunded" | "cancelled";
  tickets: TicketType[];
  referral_code: string | null;
  promoter_event_id: string | null;
  venue_id: string | null;
  venue_revenue: number;
  created_at: string;
}

export interface Ticket {
  seat_label?: string | null;
  id: string;
  event_id: string;
  order_id: string;
  user_id: string;
  ticket_type: string;
  price: number;
  qr_code: string;
  status: "valid" | "used" | "cancelled" | "returned" | "resold";
  checked_in_at: string | null;
  returned_at: string | null;
  resale_claim_token: string | null;
  resale_claim_expires_at: string | null;
  resale_completed_at: string | null;
  resale_new_owner_id: string | null;
  created_at: string;
}