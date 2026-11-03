'use client';

import React from 'react';
import { Save } from 'lucide-react';
import { saveSettings } from '../../../../modules/settings/actions';
import { SETTING_GROUPS } from '../../../../modules/settings/definitions';
import type { SettingValues } from '../../../../modules/settings/queries';
import { Button } from '../../../../components/admin/ui/Button';
import { FormAlert, FormGrid, TextInput } from '../../../../components/admin/ui/fields';
import { PageHeader } from '../../../../components/admin/ui/PageHeader';
import { CARD } from '../../../../components/admin/ui/styles';
import { useForm } from '../../../../components/admin/ui/useForm';
import { LanguageTabs, TranslatedInput, TranslationProvider, TransTextInput } from '../../../../components/admin/ui/translations';

// One form, built from the list in modules/settings/definitions.ts. The language switcher above it
// applies to the translatable settings; phones and numbers are the same in every language.
export const SettingsForm: React.FC<{ settings: SettingValues }> = ({ settings }) => {
  const form = useForm<SettingValues>(settings);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    form.submit(() => saveSettings(form.values));
  };

  return (
    <TranslationProvider>
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
        <div className={`${CARD} mb-4 overflow-hidden`}>
          <LanguageTabs values={form.values} errors={form.errors} />
        </div>
        <div className="space-y-4">
          {SETTING_GROUPS.map((group) => (
            <section key={group.title} className={`${CARD} p-5`}>
              <h2 className="mb-4 text-sm font-black text-[#0B5F5B]">{group.title}</h2>
              <FormGrid>
                {group.fields.map((field) =>
                  'translatable' in field && field.translatable ? (
                    <TransTextInput
                      key={field.key}
                      label={field.label}
                      name={field.key}
                      hint={'hint' in field ? field.hint : undefined}
                      value={form.values[field.key] as TranslatedInput}
                      onChange={(value) => form.set(field.key, value)}
                      errors={form.errors}
                    />
                  ) : (
                    <TextInput
                      key={field.key}
                      label={field.label}
                      hint={'hint' in field ? field.hint : undefined}
                      ltr={'ltr' in field ? field.ltr : undefined}
                      inputMode={field.type === 'number' ? 'decimal' : undefined}
                      value={form.values[field.key] as string}
                      onChange={(value) => form.set(field.key, value)}
                      error={form.errors[field.key]}
                    />
                  ),
                )}
              </FormGrid>
            </section>
          ))}
        </div>
      </form>
    </TranslationProvider>
  );
};
