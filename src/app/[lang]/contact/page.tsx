import { ContactPage } from '../../../components/contact/ContactPage';
import { getI18n, pageMetadata } from '../../../i18n/metadata';

export async function generateMetadata() {
  const { t } = await getI18n();
  return pageMetadata('/contact', t.common.meta.contact);
}

export default function Page() {
  return <ContactPage />;
}
