export type UserRole = 'attendee' | 'organizer' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  stripe_customer_id: string | null;
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
  city: string | null;
  postcode: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  capacity: number | null;
  hero_image: string | null;
  status: 'draft' | 'published';
  verified: boolean;
  created_at: string;
}

export interface TicketType {
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface Event {
  id: string;
  organizer_id: string;
  venue_id: string | null;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  timezone: string;
  event_type: 'in-person' | 'live-stream' | 'hybrid';
  status: 'draft' | 'published' | 'cancelled';
  hero_image: string | null;
  stream_url: string | null;
  ticket_types: TicketType[];
  fee_handling: 'absorb' | 'pass';
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
  status: 'pending' | 'paid' | 'refunded' | 'cancelled';
  tickets: TicketType[];
  created_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  order_id: string;
  user_id: string;
  ticket_type: string;
  price: number;
  qr_code: string;
  status: 'valid' | 'used' | 'cancelled';
  checked_in_at: string | null;
  created_at: string;
}
