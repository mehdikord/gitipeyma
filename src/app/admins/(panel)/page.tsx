import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ClipboardList, Inbox, Mail, MessageSquareQuote, PhoneCall, TrendingUp } from 'lucide-react';
import { getDashboard } from '../../../modules/dashboard/queries';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { Badge } from '../../../components/admin/ui/Badge';
import { CARD } from '../../../components/admin/ui/styles';
import { requestStatus } from '../../../modules/serviceRequests/statuses';
import { faNumber, formatDateTime } from '../../../lib/format';

export const metadata: Metadata = { title: 'داشبورد' };

const Stat = ({ href, label, value, icon: Icon, accent }: { href: string; label: string; value: number; icon: React.ElementType; accent?: boolean }) => (
  <Link href={href} className={`${CARD} group flex items-center gap-4 p-4 transition-colors hover:border-[#0B7A75]/40`}>
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent && value > 0 ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#E6F4F3] text-[#0B5F5B]'}`}>
      <Icon className="h-5 w-5" />
    </span>
    <span className="min-w-0">
      <span className="block text-2xl font-black text-[#14282D]">{faNumber(value)}</span>
      <span className="block text-[13px] text-[#5F7177]">{label}</span>
    </span>
  </Link>
);

const Panel = ({ title, href, children }: { title: string; href: string; children: React.ReactNode }) => (
  <section className={`${CARD} overflow-hidden`}>
    <div className="flex items-center justify-between border-b border-[#E3E8EA] px-4 py-3">
      <h2 className="text-sm font-black">{title}</h2>
      <Link href={href} className="inline-flex items-center gap-1 text-[13px] font-bold text-[#0B7A75] hover:underline">
        همه
        <ArrowLeft className="h-3.5 w-3.5" />
      </Link>
    </div>
    {children}
  </section>
);

const Empty = ({ text }: { text: string }) => <p className="px-4 py-8 text-center text-sm text-[#5F7177]">{text}</p>;

export default async function DashboardPage() {
  const { badges, stats, latestRequests, latestConsultations, latestMessages, topServices } = await getDashboard();

  return (
    <>
      <PageHeader title="داشبورد" description="خلاصه آنچه منتظر رسیدگی است." />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat href="/admins/service-requests?status=pending" label="درخواست خدمت جدید" value={badges.serviceRequests} icon={ClipboardList} accent />
        <Stat href="/admins/consultation-requests?status=pending" label="درخواست مشاوره جدید" value={badges.consultations} icon={PhoneCall} accent />
        <Stat href="/admins/contact-messages?state=unread" label="پیام خوانده‌نشده" value={badges.messages} icon={Mail} accent />
        <Stat href="/admins/testimonials?state=pending" label="نظر در انتظار تأیید" value={badges.testimonials} icon={MessageSquareQuote} accent />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat href="/admins/service-requests" label="درخواست خدمت در ۷ روز اخیر" value={stats.requestsThisWeek} icon={TrendingUp} />
        <Stat href="/admins/service-requests" label="کل درخواست‌های خدمات" value={stats.totalRequests} icon={ClipboardList} />
        <Stat href="/admins/services" label="خدمت فعال در سایت" value={stats.activeServices} icon={Inbox} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel title="آخرین درخواست‌های خدمات" href="/admins/service-requests">
            {latestRequests.length === 0 ? (
              <Empty text="هنوز درخواستی ثبت نشده است." />
            ) : (
              <ul className="divide-y divide-[#EEF2F3]">
                {latestRequests.map((request) => {
                  const status = requestStatus(request.status);
                  return (
                    <li key={request.id}>
                      <Link href={`/admins/service-requests?open=${request.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-[#F7FAFA]">
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold">{request.name}</span>
                          <span className="block text-xs text-[#5F7177]">{request.service}</span>
                        </span>
                        <span dir="ltr" className="text-[13px] text-[#3F5257]">
                          {request.phone}
                        </span>
                        <Badge tone={status.tone}>{status.label}</Badge>
                        <span className="w-32 text-left text-xs text-[#5F7177]">{formatDateTime(request.createdAt)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="پرطرفدارترین خدمات" href="/admins/services">
          {topServices.length === 0 ? (
            <Empty text="هنوز درخواستی ثبت نشده است." />
          ) : (
            <ul className="space-y-3 p-4">
              {topServices.map((service) => (
                <li key={service.id}>
                  <Link href={`/admins/service-requests?service=${service.id}`} className="block hover:text-[#0B7A75]">
                    <span className="flex items-center justify-between text-[13px] font-bold">
                      <span>{service.title}</span>
                      <span>{faNumber(service.count)}</span>
                    </span>
                    <span className="mt-1.5 block h-1.5 rounded-full bg-[#EEF2F3]">
                      <span className="block h-full rounded-full bg-[#0B7A75]" style={{ width: `${(service.count / topServices[0].count) * 100}%` }} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="آخرین درخواست‌های مشاوره" href="/admins/consultation-requests">
          {latestConsultations.length === 0 ? (
            <Empty text="هنوز درخواست مشاوره‌ای ثبت نشده است." />
          ) : (
            <ul className="divide-y divide-[#EEF2F3]">
              {latestConsultations.map((request) => {
                const status = requestStatus(request.status);
                return (
                  <li key={request.id}>
                    <Link href={`/admins/consultation-requests?open=${request.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7FAFA]">
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">{request.name}</span>
                        <span className="block truncate text-xs text-[#5F7177]">{request.service}</span>
                      </span>
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <div className="xl:col-span-2">
          <Panel title="آخرین پیام‌های تماس" href="/admins/contact-messages">
            {latestMessages.length === 0 ? (
              <Empty text="هنوز پیامی نرسیده است." />
            ) : (
              <ul className="divide-y divide-[#EEF2F3]">
                {latestMessages.map((message) => (
                  <li key={message.id}>
                    <Link href={`/admins/contact-messages?open=${message.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-[#F7FAFA]">
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm ${message.read ? '' : 'font-black'}`}>{message.name}</span>
                        <span className="block text-xs text-[#5F7177]">{message.topic ?? 'بدون موضوع'}</span>
                      </span>
                      {!message.read && <Badge tone="amber">خوانده‌نشده</Badge>}
                      <span className="w-32 text-left text-xs text-[#5F7177]">{formatDateTime(message.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
