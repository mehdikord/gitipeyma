'use client';

import React from 'react';
import type { SocialLinkRow } from '../../../../modules/socialLinks/queries';
import { deleteSocialLink, saveSocialLink } from '../../../../modules/socialLinks/actions';
import { SOCIAL_ICONS, socialIcon } from '../../../../modules/socialLinks/icons';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { ActiveBadge } from '../../../../components/admin/ui/Badge';
import { FormGrid, NumberInput, Select, Switch, TextInput } from '../../../../components/admin/ui/fields';

type Values = { platform: string; label: string; url: string; icon: string; isActive: boolean; sortOrder: string };

const ICON_OPTIONS = Object.entries(SOCIAL_ICONS).map(([value, { label }]) => ({ value, label }));

export const SocialLinksManager: React.FC<{ rows: SocialLinkRow[] }> = ({ rows }) => (
  <CrudManager<SocialLinkRow, Values>
    title="شبکه‌های اجتماعی"
    description="آیکن‌های فوتر سایت. اگر نام شبکه «Telegram» باشد، دکمه کانال تلگرام صفحه تماس هم به آن وصل می‌شود."
    noun="لینک"
    rows={rows}
    columns={[
      {
        key: 'platform',
        header: 'شبکه',
        cell: (row) => {
          const Icon = socialIcon(row.icon);
          return (
            <span className="flex items-center gap-2.5 font-bold">
              <Icon className="h-4 w-4 text-[#0B7A75]" />
              {row.platform}
            </span>
          );
        },
      },
      { key: 'label', header: 'توضیح', hideOnMobile: true, cell: (row) => <span className="font-normal">{row.label}</span> },
      { key: 'url', header: 'آدرس', cell: (row) => <span dir="ltr" className="block max-w-56 truncate text-[13px] text-[#5F7177]">{row.url}</span> },
      { key: 'state', header: 'وضعیت', cell: (row) => <ActiveBadge active={row.isActive} /> },
    ]}
    emptyValues={() => ({ platform: '', label: '', url: 'https://', icon: 'Globe', isActive: true, sortOrder: String(rows.length + 1) })}
    toValues={(row) => ({ platform: row.platform, label: row.label, url: row.url, icon: row.icon, isActive: row.isActive, sortOrder: String(row.sortOrder) })}
    save={saveSocialLink}
    remove={deleteSocialLink}
    renderForm={({ values, set, errors }) => (
      <div className="space-y-4">
        <FormGrid>
          <TextInput label="نام شبکه" required ltr hint="مثل Instagram" value={values.platform} onChange={(v) => set('platform', v)} error={errors.platform} />
          <Select label="آیکن" value={values.icon} onChange={(v) => set('icon', v)} options={ICON_OPTIONS} error={errors.icon} />
        </FormGrid>
        <TextInput label="توضیح" required hint="برای صفحه‌خوان‌ها و راهنمای نشانگر." value={values.label} onChange={(v) => set('label', v)} error={errors.label} />
        <TextInput label="آدرس" required ltr value={values.url} onChange={(v) => set('url', v)} error={errors.url} />
        <NumberInput label="ترتیب نمایش" min={0} value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
        <Switch label="نمایش در سایت" checked={values.isActive} onChange={(v) => set('isActive', v)} />
      </div>
    )}
  />
);
