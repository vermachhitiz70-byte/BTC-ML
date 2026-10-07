import { LegalPage } from '../site/legal';

export const metadata = {
  title: 'Privacy Policy | BTCMLTAI',
  description: 'How BTCMLTAI collects, uses and protects the information you provide when using this website.',
  alternates: { canonical: 'https://btcmltai.com/privacy-policy' },
};

export default function Page() {
  return <LegalPage slug="privacy-policy" />;
}