import { Facebook, Globe, Instagram, Linkedin, Mail, MessageCircle, Send, Twitter, Youtube } from 'lucide-react';
import type React from 'react';

// The icons a social link can use; social_links.icon stores the key.
export const SOCIAL_ICONS: Record<string, { label: string; icon: React.ElementType }> = {
  MessageCircle: { label: 'واتس‌اپ / پیام', icon: MessageCircle },
  Send: { label: 'تلگرام', icon: Send },
  Instagram: { label: 'اینستاگرام', icon: Instagram },
  Linkedin: { label: 'لینکدین', icon: Linkedin },
  Twitter: { label: 'ایکس (توییتر)', icon: Twitter },
  Youtube: { label: 'یوتیوب', icon: Youtube },
  Facebook: { label: 'فیسبوک', icon: Facebook },
  Mail: { label: 'ایمیل', icon: Mail },
  Globe: { label: 'وب‌سایت', icon: Globe },
};

export const socialIcon = (key: string) => SOCIAL_ICONS[key]?.icon ?? MessageCircle;
