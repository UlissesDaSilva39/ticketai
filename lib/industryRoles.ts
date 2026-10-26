// GRID - Complete music industry role taxonomy (38 roles across 8 categories)

export type AccessTier = 'fan' | 'artist' | 'label' | 'promoter' | 'venue' | 'admin';

export type IndustryCategory =
  | 'artists'
  | 'live_production'
  | 'booking'
  | 'venues'
  | 'labels'
  | 'media'
  | 'creative'
  | 'services';

export type IndustryRole = {
  id: string;
  label: string;
  description: string;
  category: IndustryCategory;
  accessTier: AccessTier;
  hasRider?: boolean;
};

export const INDUSTRY_CATEGORIES: Record<IndustryCategory, { label: string; description: string }> = {
  artists:         { label: 'Artists',              description: 'Performers, creators, songwriters' },
  live_production: { label: 'Live Production',      description: 'Crew running the show' },
  booking:         { label: 'Booking & Management', description: 'Career, tours, contracts' },
  venues:          { label: 'Venues',               description: 'Spaces, clubs, festivals' },
  labels:          { label: 'Labels & Rights',      description: 'Record, publish, distribute' },
  media:           { label: 'Media & Content',      description: 'Photos, video, press' },
  creative:        { label: 'Creative',             description: 'Design, art, brand' },
  services:        { label: 'Support Services',     description: 'Security, hospitality, merch' },
};

export const INDUSTRY_ROLES: IndustryRole[] = [
  // Artists
  { id: 'artist',     label: 'Artist',     description: 'General musician, performer',        category: 'artists', accessTier: 'artist', hasRider: true },
  { id: 'dj',         label: 'DJ',         description: 'House, techno, hip-hop, DnB, garage', category: 'artists', accessTier: 'artist', hasRider: true },
  { id: 'producer',   label: 'Producer',   description: 'Beatmaker, engineer, mixer',          category: 'artists', accessTier: 'artist', hasRider: true },
  { id: 'vocalist',   label: 'Vocalist',   description: 'Singer, MC, rapper',                  category: 'artists', accessTier: 'artist', hasRider: true },
  { id: 'band',       label: 'Band',       description: 'Group of 2+ musicians',               category: 'artists', accessTier: 'artist', hasRider: true },
  { id: 'songwriter', label: 'Songwriter', description: 'Lyricist, topliner',                  category: 'artists', accessTier: 'artist', hasRider: false },

  // Live Production
  { id: 'sound_engineer',     label: 'Sound Engineer',     description: 'FOH, monitors, mix engineer', category: 'live_production', accessTier: 'artist', hasRider: false },
  { id: 'lighting_designer',  label: 'Lighting Designer',  description: 'LD, VJ, projections',         category: 'live_production', accessTier: 'artist', hasRider: false },
  { id: 'backline_tech',      label: 'Backline Tech',      description: 'Instrument tech, drum tech',  category: 'live_production', accessTier: 'artist', hasRider: false },
  { id: 'stage_manager',      label: 'Stage Manager',      description: 'Run the show',                category: 'live_production', accessTier: 'artist', hasRider: false },
  { id: 'tour_manager',       label: 'Tour Manager',       description: 'On-the-road logistics',       category: 'live_production', accessTier: 'artist', hasRider: false },
  { id: 'production_manager', label: 'Production Manager', description: 'Technical planning',          category: 'live_production', accessTier: 'artist', hasRider: false },

  // Booking & Management
  { id: 'promoter',        label: 'Promoter',        description: 'Run events, book artists',     category: 'booking', accessTier: 'promoter', hasRider: true },
  { id: 'booking_agent',   label: 'Booking Agent',   description: 'Negotiate shows',              category: 'booking', accessTier: 'promoter', hasRider: false },
  { id: 'artist_manager',  label: 'Artist Manager',  description: 'Career management',            category: 'booking', accessTier: 'label',    hasRider: false },
  { id: 'event_organizer', label: 'Event Organizer', description: 'Multi-day, festivals',         category: 'booking', accessTier: 'promoter', hasRider: false },
  { id: 'talent_buyer',    label: 'Talent Buyer',    description: 'Venue-side booking',           category: 'booking', accessTier: 'promoter', hasRider: false },

  // Venues
  { id: 'venue',         label: 'Venue',         description: 'Own/manage a space',           category: 'venues', accessTier: 'venue', hasRider: true },
  { id: 'venue_manager', label: 'Venue Manager', description: 'Day-to-day operations',        category: 'venues', accessTier: 'venue', hasRider: false },
  { id: 'venue_booker',  label: 'Venue Booker',  description: 'In-house booking',             category: 'venues', accessTier: 'venue', hasRider: false },
  { id: 'club_owner',    label: 'Club Owner',    description: 'Nightclub, bar',               category: 'venues', accessTier: 'venue', hasRider: false },

  // Labels & Rights
  { id: 'record_company', label: 'Record Company', description: 'Label, imprint, publisher',    category: 'labels', accessTier: 'label', hasRider: false },
  { id: 'a_and_r',        label: 'A&R',            description: 'Talent scout',                 category: 'labels', accessTier: 'label', hasRider: false },
  { id: 'label_manager',  label: 'Label Manager',  description: 'Day-to-day label operations',  category: 'labels', accessTier: 'label', hasRider: false },
  { id: 'publisher',      label: 'Publisher',      description: 'Sync, licensing',              category: 'labels', accessTier: 'label', hasRider: false },
  { id: 'distributor',    label: 'Distributor',    description: 'Digital/physical distribution',category: 'labels', accessTier: 'label', hasRider: false },

  // Media & Content
  { id: 'photographer',    label: 'Photographer',    description: 'Live music photographer',  category: 'media', accessTier: 'artist', hasRider: false },
  { id: 'videographer',    label: 'Videographer',    description: 'Music videos, live shoots',category: 'media', accessTier: 'artist', hasRider: false },
  { id: 'journalist',      label: 'Journalist',      description: 'Music press',              category: 'media', accessTier: 'artist', hasRider: false },
  { id: 'content_creator', label: 'Content Creator', description: 'Social media, reels',      category: 'media', accessTier: 'artist', hasRider: false },
  { id: 'radio_host',      label: 'Radio Host',      description: 'Radio/podcast',            category: 'media', accessTier: 'artist', hasRider: false },

  // Creative
  { id: 'graphic_designer', label: 'Graphic Designer', description: 'Posters, brand, merch',  category: 'creative', accessTier: 'artist', hasRider: false },
  { id: 'visual_artist',    label: 'Visual Artist',    description: 'Cover art, projections', category: 'creative', accessTier: 'artist', hasRider: false },
  { id: 'merch_designer',   label: 'Merch Designer',   description: 'Clothing, apparel',      category: 'creative', accessTier: 'artist', hasRider: false },
  { id: 'web_designer',     label: 'Web Designer',     description: 'Artist websites',        category: 'creative', accessTier: 'artist', hasRider: false },

  // Support Services
  { id: 'security',     label: 'Security',       description: 'Event security',             category: 'services', accessTier: 'artist', hasRider: false },
  { id: 'hospitality',  label: 'Hospitality',    description: 'Catering, rider fulfilment', category: 'services', accessTier: 'artist', hasRider: false },
  { id: 'driver',       label: 'Driver',         description: 'Tour bus, equipment',        category: 'services', accessTier: 'artist', hasRider: false },
  { id: 'merch_seller', label: 'Merch Seller',   description: 'Merch booth',                category: 'services', accessTier: 'artist', hasRider: false },
  { id: 'fan',          label: 'Fan / Attendee', description: 'Follow artists, buy tickets',category: 'services', accessTier: 'fan',    hasRider: false },
];

export function getIndustryRole(id: string): IndustryRole | null {
  return INDUSTRY_ROLES.find((r) => r.id === id) || null;
}
