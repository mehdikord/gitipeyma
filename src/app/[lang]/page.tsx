import { HomePage } from '../../components/home/HomePage';
import { pageMetadata } from '../../i18n/metadata';

export const generateMetadata = () => pageMetadata('/');

export default function Page() {
  return <HomePage />;
}
