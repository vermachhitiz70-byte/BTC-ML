import { LegalPage } from '../site/legal';

export const metadata = {
  title: 'Digital Delivery Policy | BTCMLTAI',
  description: 'How BTCMLTAI delivers digital software, what you receive, and how to access your files and licence.',
  alternates: { canonical: 'https://btcmltai.com/shipping-policy' },
};

export default function Page() {
  return <LegalPage slug="shipping-policy" />;
}