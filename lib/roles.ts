// GRID - central role definitions and helpers

export type Role = 'fan' | 'artist' | 'promoter' | 'venue' | 'admin';

export type ClubTier = 'free' | 'pro' | 'premium';

export type UserWithRole = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  role?: Role;
  clubTier?: ClubTier;
} | null;

export const ROLE_LABELS: Record<Role, string> = {
  fan: 'Fan',
  artist: 'Artist',
  promoter: 'Promoter',
  venue: 'Venue',
  admin: 'Admin',
};

export const ROLE_DASHBOARDS: Record<Role, string | null> = {
  fan: null,
  artist: '/artist/dashboard',
  promoter: '/promoter/dashboard',
  venue: '/venue/dashboard',
  admin: '/admin',
};

export const CLUB_TIER_LABELS: Record<ClubTier, string> = {
  free: 'Free',
  pro: 'Pro',
  premium: 'Premium',
};

/** Returns true if the user has a paid club tier */
export function isClubMember(user: UserWithRole): boolean {
  return user?.clubTier === 'pro' || user?.clubTier === 'premium';
}

/** Returns the user's role (default: fan) */
export function getUserRole(user: UserWithRole): Role {
  return user?.role || 'fan';
}

/** Returns true if the user is a fan (unregistered role) */
export function isFan(user: UserWithRole): boolean {
  return getUserRole(user) === 'fan';
}

/** Returns the dashboard URL for the user, or null for fans */
export function getDashboardHref(user: UserWithRole): string | null {
  return ROLE_DASHBOARDS[getUserRole(user)];
}
