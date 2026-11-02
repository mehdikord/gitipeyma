import {
  Boxes,
  Briefcase,
  Building2,
  Bus,
  CircleDollarSign,
  FileSignature,
  GraduationCap,
  HeartHandshake,
  Languages,
  Package,
  PartyPopper,
  Plane,
  Scale,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import type React from 'react';

// The icons a service can use on the home page service map; services.icon stores the key.
export const SERVICE_ICONS: Record<string, { label: string; icon: React.ElementType }> = {
  Bus: { label: 'اتوبوس', icon: Bus },
  Package: { label: 'بسته پستی', icon: Package },
  Boxes: { label: 'بار و کانتینر', icon: Boxes },
  Truck: { label: 'کامیون', icon: Truck },
  Building2: { label: 'شرکت', icon: Building2 },
  Briefcase: { label: 'کسب‌وکار', icon: Briefcase },
  CircleDollarSign: { label: 'ارز و پول', icon: CircleDollarSign },
  FileSignature: { label: 'سند و وکالت', icon: FileSignature },
  Scale: { label: 'حقوقی', icon: Scale },
  Languages: { label: 'ترجمه', icon: Languages },
  Plane: { label: 'سفر و ویزا', icon: Plane },
  GraduationCap: { label: 'تحصیل', icon: GraduationCap },
  HeartHandshake: { label: 'ازدواج', icon: HeartHandshake },
  PartyPopper: { label: 'مراسم و جشن', icon: PartyPopper },
  ShieldCheck: { label: 'بیمه و ضمانت', icon: ShieldCheck },
};

export const serviceIcon = (key: string | null | undefined) => (key && SERVICE_ICONS[key]?.icon) || Briefcase;
