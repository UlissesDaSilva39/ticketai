export type UserRole = "attendee" | "promoter" | "venue" | "artist" | "admin";

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
  venue?: { id: string; slug: string; name: string; city: string | null; membership_url?: string | null } | null;
  promoter?: { id: string; slug: string; name: string } | null;
  artists?: { slug: string; name: string; verified?: boolean }[];
  membership_url?: string | null;
  age_restriction?: string | null;
  doors_open_at?: string | null;
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
  venue?: { id: string; slug: string; name: string; city: string | null; membership_url?: string | null } | null;
  promoter?: { id: string; slug: string; name: string } | null;
  artists?: { slug: string; name: string; verified?: boolean }[];
  membership_url?: string | null;
  age_restriction?: string | null;
  doors_open_at?: string | null;
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
  venue?: { id: string; slug: string; name: string; city: string | null; membership_url?: string | null } | null;
  promoter?: { id: string; slug: string; name: string } | null;
  artists?: { slug: string; name: string; verified?: boolean }[];
  membership_url?: string | null;
  age_restriction?: string | null;
  doors_open_at?: string | null;
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
  venue?: { id: string; slug: string; name: string; city: string | null; membership_url?: string | null } | null;
  promoter?: { id: string; slug: string; name: string } | null;
  artists?: { slug: string; name: string; verified?: boolean }[];
  membership_url?: string | null;
  age_restriction?: string | null;
  doors_open_at?: string | null;
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
  venue?: { id: string; slug: string; name: string; city: string | null; membership_url?: string | null } | null;
  promoter?: { id: string; slug: string; name: string } | null;
  artists?: { slug: string; name: string; verified?: boolean }[];
  membership_url?: string | null;
  age_restriction?: string | null;
  doors_open_at?: string | null;
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
  venue?: { id: string; slug: string; name: string; city: string | null; membership_url?: string | null } | null;
  promoter?: { id: string; slug: string; name: string } | null;
  artists?: { slug: string; name: string; verified?: boolean }[];
  membership_url?: string | null;
  age_restriction?: string | null;
  doors_open_at?: string | null;
}

export type Artist = {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  city: string | null;
  avatar_url: string | null;
  verified: boolean;
  membership_url: string | null;
  // Optional joined fields - see app/u, CityPage, GenrePage, venue page
  organizer?: { slug: string; name: string } | null;
  venue?: { id: string; slug: string; name: string; city: string | null } | null;
  artists?: Array<{ id: string; slug: string; name: string; role?: string }>;
  hasRealPrice?: boolean;
  priceMin?: number;
  priceMax?: number;
  ticketUrl?: string;
  image?: string;
  // Optional joined / legacy fields
  username?: string;
  artist_type?: string;
  social?: { instagram?: string; twitter?: string; spotify?: string; website?: string } | null;
  // Optional joined fields (added by fix3.ps1)
  organizer?: { slug: string; name: string } | null;
  venue?: { id: string; slug: string; name: string; city: string | null } | null;
  artists?: Array<{ id: string; slug: string; name: string; role?: string }>;
  hasRealPrice?: boolean;
  priceMin?: number;
  priceMax?: number;
  ticketUrl?: string;
};
export type SavedSearch = {
  id: string;
  user_id: string;
  query: string | null;
  city: string | null;
  genre: string | null;
  price_max: number | null;
  notify: boolean;
  created_at: string;
};





// ============================================================
// Rider templates (technical + hospitality + backstage)
// ============================================================
export type TechnicalRider = {
  pa_system?: string;
  monitor_setup?: string;
  console_requirements?: string;
  backline?: string;
  stage_plot_url?: string;
  input_list_url?: string;
  power_requirements?: string;
  load_in_time?: string;
  soundcheck_time?: string;
  notes?: string;
};

export type HospitalityRider = {
  catering?: string;
  dietary_requirements?: string;
  dressing_room?: string;
  transport?: string;
  accommodation?: string;
  guest_list_count?: number;
  merch_commission_pct?: number;
  settlement_terms?: string;
  notes?: string;
};

export type BackstageInfo = {
  venue_map_url?: string;
  door_access_levels?: string;
  loading_bay?: string;
  storage_available?: string;
  parking?: string;
  curfew_time?: string;
  notes?: string;
};

export type Rider = {
  id: string;
  owner_id: string;
  owner_type: 'artist' | 'promoter' | 'venue';
  technical?: TechnicalRider;
  hospitality?: HospitalityRider;
  backstage?: BackstageInfo;
  created_at: string;
  updated_at: string;
};
