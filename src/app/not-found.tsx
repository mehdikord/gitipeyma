import { HomePage } from '../components/home/HomePage';

// Unknown paths keep showing the home page, now with a proper 404 status.
export default function NotFound() {
  return <HomePage />;
}
