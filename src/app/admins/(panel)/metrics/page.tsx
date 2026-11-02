import type { Metadata } from 'next';
import { listMetrics } from '../../../../modules/metrics/queries';
import { MetricsManager } from './MetricsManager';

export const metadata: Metadata = { title: 'آمار و ارقام' };

export default async function MetricsPage() {
  return <MetricsManager rows={await listMetrics()} />;
}
