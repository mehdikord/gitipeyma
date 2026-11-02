'use client';

import React from 'react';
import { Save } from 'lucide-react';
import { saveSettings } from '../../../../modules/settings/actions';
import { SETTING_GROUPS, Settings } from '../../../../modules/settings/definitions';
import { Button } from '../../../../components/admin/ui/Button';
import { FormAlert, FormGrid, TextInput } from '../../../../components/admin/ui/fields';
import { PageHeader } from '../../../../components/admin/ui/PageHeader';
import { CARD } from '../../../../components/admin/ui/styles';
import { useForm } from '../../../../components/admin/ui/useForm';

// One form, built from the list in modules/settings/definitions.ts.
export const SettingsForm: React.FC<{ settings: Settings }> = ({ settings }) => {
  const form = useForm<Settings>(settings);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    form.submit(() => saveSettings(form.values));
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <PageHeader
        title="تنظیمات سایت"
        description="اطلاعاتی که در سربرگ، فوتر و دکمه‌های تماس سراسر سایت استفاده می‌شود."
        actions={
          <Button type="submit" icon={Save} loading={form.pending}>
            ذخیره تنظیمات
          </Button>
        }
      />
      <FormAlert message={form.formError} />
      <div className="space-y-4">
        {SETTING_GROUPS.map((group) => (
          <section key={group.title} className={`${CARD} p-5`}>
            <h2 className="mb-4 text-sm font-black text-[#0B5F5B]">{group.title}</h2>
            <FormGrid>
              {group.fields.map((field) => (
                <TextInput
                  key={field.key}
                  label={field.label}
                  hint={'hint' in field ? field.hint : undefined}
                  ltr={'ltr' in field ? field.ltr : undefined}
                  inputMode={field.type === 'number' ? 'decimal' : undefined}
                  value={form.values[field.key]}
                  onChange={(value) => form.set(field.key, value)}
                  error={form.errors[field.key]}
                />
              ))}
            </FormGrid>
          </section>
        ))}
      </div>
    </form>
  );
};
