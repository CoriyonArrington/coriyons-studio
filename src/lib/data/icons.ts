import {
  HelpCircle,
  Shapes,
  CheckSquare,
  TrendingDown,
  Home,
  Settings,
  User,
  Mail,
  ExternalLink,
  Search,
  Palette,
  ClipboardList,
  IterationCcw,
  Send,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export type IconComponent = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

export const ICONS: Record<string, IconComponent> = {
  HelpCircle,
  Shapes,
  CheckSquare,
  TrendingDown,
  Home,
  Settings,
  User,
  Mail,
  ExternalLink,
  Search,
  Palette,
  ClipboardList,
  IterationCcw,
  Send,
};

export const getIcon = (name?: string | null): IconComponent => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (name && ICONS[name]) {
        return ICONS[name];
    }
    return HelpCircle;
};