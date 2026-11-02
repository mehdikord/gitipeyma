import type { Metadata } from 'next';
import { listCurrencies } from '../../../../modules/currencies/queries';
import { getSettingsForAdmin } from '../../../../modules/settings/queries';
import { CurrenciesManager } from './CurrenciesManager';

export const metadata: Metadata = { title: 'نرخ ارز' };

export default async function CurrenciesPage() {
  const [rows, settings] = await Promise.all([listCurrencies(), getSettingsForAdmin()]);
  return <CurrenciesManager rows={rows} feePercent={settings.currency_fee_percent} />;
}
