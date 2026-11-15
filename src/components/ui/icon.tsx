import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Database,
  Globe2,
  Layers3,
  LayoutDashboard,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Network,
  Package,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

const icons = {
  arrow: ArrowRight,
  down: ArrowDown,
  check: Check,
  chevron: ChevronDown,
  help: CircleHelp,
  clock: Clock3,
  database: Database,
  globe: Globe2,
  layers: Layers3,
  link: Link2,
  mail: Mail,
  map: MapPin,
  message: MessageCircle,
  network: Network,
  package: Package,
  phone: Phone,
  search: Search,
  shield: ShieldCheck,
  sparkles: Sparkles,
  users: Users,
  workflow: Workflow,
  zap: Zap,
  dashboard: LayoutDashboard,
};
export type IconName = keyof typeof icons;

export function Icon({ name, ...props }: LucideProps & { name: IconName }) {
  const Component = icons[name];
  return (
    <Component size={20} strokeWidth={1.7} aria-hidden="true" {...props} />
  );
}
