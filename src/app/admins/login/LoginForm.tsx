'use client';

import React, { useState, useTransition } from 'react';
import { LogIn } from 'lucide-react';
import { login } from '../../../modules/auth/actions';
import { Button } from '../../../components/admin/ui/Button';
import { FormAlert, TextInput } from '../../../components/admin/ui/fields';

export const LoginForm: React.FC<{ next: string }> = ({ next }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      // A successful login redirects, so only a failure comes back here
      const result = await login({ phone, password }, next);
      if (!result.ok) {
        setErrors(result.errors ?? {});
        setMessage(result.errors ? null : result.message ?? null);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormAlert message={message} />
      <TextInput
        label="شماره موبایل"
        value={phone}
        onChange={setPhone}
        type="tel"
        inputMode="tel"
        autoComplete="username"
        placeholder="09120000000"
        ltr
        error={errors.phone}
      />
      <TextInput label="رمز عبور" value={password} onChange={setPassword} type="password" autoComplete="current-password" ltr error={errors.password} />
      <Button type="submit" loading={pending} icon={LogIn} className="w-full">
        ورود
      </Button>
    </form>
  );
};
