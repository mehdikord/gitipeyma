import { AboutPage } from '../../../components/about/AboutPage';
import { getI18n, pageMetadata } from '../../../i18n/metadata';

export async function generateMetadata() {
  const { t } = await getI18n();
  return pageMetadata('/about', t.common.meta.about);
}

export default function Page() {
  return <AboutPage />;
}
