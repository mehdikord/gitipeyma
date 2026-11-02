'use server';

import { db } from '../../lib/db';
import { adminAction, idSchema } from '../../lib/actions';
import { MetricInput, metricSchema } from './schema';

export async function saveMetric(id: number | null, input: MetricInput) {
  return adminAction(metricSchema, input, async (data) => {
    if (id) await db.metric.update({ where: { id }, data });
    else await db.metric.create({ data });
  });
}

export async function deleteMetric(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.metric.delete({ where: { id: data.id } });
  });
}
