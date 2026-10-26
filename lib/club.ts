// GRID - Club membership tiers (Stripe wiring to follow)

import type { ClubTier } from './roles';

export type ClubPlan = {
  tier: ClubTier;
  name: string;
  monthlyPriceGbp: number;
  features: string[];
};

export const CLUB_PLANS: ClubPlan[] = [
  {
    tier: 'free',
    name: 'Free',
    monthlyPriceGbp: 0,
    features: [
      'Public profile',
      'Browse discover',
      'Send basic messages',
      'Buy tickets',
    ],
  },
  {
    tier: 'pro',
    name: 'Club Pro',
    monthlyPriceGbp: 10,
    features: [
      'Everything in Free',
      'Analytics dashboard',
      'Priority in search',
      'Verified badge',
      'Unlimited messaging',
      'Export data',
    ],
  },
  {
    tier: 'premium',
    name: 'Club Premium',
    monthlyPriceGbp: 25,
    features: [
      'Everything in Pro',
      'Featured placement on Discover',
      'Custom booking terms',
      'Dedicated account manager',
      'Early access to new features',
    ],
  },
];

export const CLUB_UPGRADE_URL = '/club/upgrade';
export const CLUB_MANAGE_URL = '/club/manage';
