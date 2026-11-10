import {
  BarChart3,
  Building2,
  ClipboardList,
  Coins,
  FolderTree,
  Inbox,
  LayoutDashboard,
  Layers,
  Mail,
  MessageSquareQuote,
  PhoneCall,
  Quote,
  Settings,
  Share2,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type React from 'react';

// The counters shown beside menu items, filled in by the panel layout.
export type NavBadges = { serviceRequests: number; consultations: number; messages: number; testimonials: number };

// staff: internal admins see this item too; everything else is for root admins only.
export type NavItem = { href: string; label: string; icon: React.ElementType; badge?: keyof NavBadges; staff?: boolean };

// The panel's menu. A new section of the panel is one entry here plus its page under app/admins/(panel).
export const NAVIGATION: { title?: string; items: NavItem[] }[] = [
  { items: [{ href: '/admins', label: 'داشبورد', icon: LayoutDashboard }] },
  {
    title: 'درخواست‌ها و پیام‌ها',
    items: [
      { href: '/admins/service-requests', label: 'درخواست خدمات', icon: ClipboardList, badge: 'serviceRequests', staff: true },
      { href: '/admins/consultation-requests', label: 'درخواست مشاوره', icon: PhoneCall, badge: 'consultations' },
      { href: '/admins/contact-messages', label: 'پیام‌های تماس', icon: Mail, badge: 'messages' },
    ],
  },
  {
    title: 'خدمات',
    items: [
      { href: '/admins/services', label: 'خدمات', icon: Inbox },
      { href: '/admins/service-categories', label: 'دسته‌بندی خدمات', icon: FolderTree },
      { href: '/admins/service-groups', label: 'گروه‌های صفحه اصلی', icon: Layers },
    ],
  },
  {
    title: 'محتوای سایت',
    items: [
      { href: '/admins/testimonials', label: 'نظرات مشتریان', icon: MessageSquareQuote, badge: 'testimonials' },
      { href: '/admins/metrics', label: 'آمار و ارقام', icon: BarChart3 },
      { href: '/admins/trust-quotes', label: 'جملات کوتاه اعتماد', icon: Quote },
      { href: '/admins/team-members', label: 'اعضای تیم', icon: Users },
    ],
  },
  {
    title: 'شرکت',
    items: [
      { href: '/admins/offices', label: 'دفاتر', icon: Building2 },
      { href: '/admins/social-links', label: 'شبکه‌های اجتماعی', icon: Share2 },
      { href: '/admins/currencies', label: 'نرخ ارز', icon: Coins },
      { href: '/admins/settings', label: 'تنظیمات سایت', icon: Settings },
    ],
  },
  { title: 'دسترسی', items: [{ href: '/admins/admins', label: 'مدیران', icon: ShieldCheck }] },
];

/** The menu an admin sees: all of it for a root admin, only the staff items for an internal one. */
export const navigationFor = (isRoot: boolean) =>
  isRoot ? NAVIGATION : NAVIGATION.map((section) => ({ ...section, items: section.items.filter((item) => item.staff) })).filter((section) => section.items.length > 0);
