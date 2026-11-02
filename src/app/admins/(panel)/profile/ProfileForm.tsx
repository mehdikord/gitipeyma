'use client';

import React from 'react';
import { Save } from 'lucide-react';
import { updateProfile } from '../../../../modules/admins/actions';
import { Button } from '../../../../components/admin/ui/Button';
import { FormAlert, FormGrid, TextInput } from '../../../../components/admin/ui/fields';
import { PageHeader } from '../../../../components/admin/ui/PageHeader';
import { CARD } from '../../../../components/admin/ui/styles';
import { useForm } from '../../../../components/admin/ui/useForm';

export const ProfileForm: React.FC<{ admin: { name: string; phone: string } }> = ({ admin }) => {
  const form = useForm({ ...admin, currentPassword: '', password: '', passwordConfirmation: '' });
  const { values, set, errors } = form;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    form.submit(() => updateProfile(values), {
      onSuccess: () => form.setValues((current) => ({ ...current, currentPassword: '', password: '', passwordConfirmation: '' })),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl">
      <PageHeader title="حساب کاربری" description="نام، شماره موبایل ورود و رمز عبور شما." />
      <FormAlert message={form.formError} />
      <section className={`${CARD} space-y-4 p-5`}>
        <FormGrid>
          <TextInput label="نام" required value={values.name} onChange={(v) => set('name', v)} error={errors.name} />
          <TextInput label="شماره موبایل" required ltr type="tel" value={values.phone} onChange={(v) => set('phone', v)} error={errors.phone} />
        </FormGrid>
      </section>
      <section className={`${CARD} mt-4 space-y-4 p-5`}>
        <h2 className="text-sm font-black text-[#0B5F5B]">تغییر رمز عبور</h2>
        <p className="text-[13px] text-[#5F7177]">اگر نمی‌خواهید رمز را عوض کنید، این بخش را خالی بگذارید.</p>
        <TextInput label="رمز عبور فعلی" type="password" autoComplete="current-password" ltr value={values.currentPassword} onChange={(v) => set('currentPassword', v)} error={errors.currentPassword} />
        <FormGrid>
          <TextInput label="رمز عبور جدید" type="password" autoComplete="new-password" ltr value={values.password} onChange={(v) => set('password', v)} error={errors.password} />
          <TextInput label="تکرار رمز جدید" type="password" autoComplete="new-password" ltr value={values.passwordConfirmation} onChange={(v) => set('passwordConfirmation', v)} error={errors.passwordConfirmation} />
        </FormGrid>
      </section>
      <div className="mt-4 flex justify-end">
        <Button type="submit" icon={Save} loading={form.pending}>
          ذخیره
        </Button>
      </div>
    </form>
  );
};
