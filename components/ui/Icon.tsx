import {
  Home,
  Mic,
  Search,
  Ticket,
  Users,
  MessageCircle,
  Bookmark,
  LayoutGrid,
  Globe,
  Sparkles,
  BarChart3,
  Compass,
  Bell,
  ChevronDown,
  Briefcase,
} from 'lucide-react';

const ICONS = {
  home: Home,
  mic: Mic,
  search: Search,
  ticket: Ticket,
  users: Users,
  message: MessageCircle,
  bookmark: Bookmark,
  grid: LayoutGrid,
  globe: Globe,
  sparkle: Sparkles,
  chart: BarChart3,
  compass: Compass,
  bell: Bell,
  chevronDown: ChevronDown,
  briefcase: Briefcase,
} as const;

export function Icon({
  name,
  className = 'h-5 w-5',
}: {
  name: keyof typeof ICONS;
  className?: string;
}) {
  const Cmp = ICONS[name];
  return <Cmp className={className} />;
}
