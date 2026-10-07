import { LegalPage } from '../site/legal';

export const metadata = {
  title: 'Terms &amp; Conditions | BTCMLTAI',
  description: 'Terms governing use of the BTCMLTAI website, digital software products, educational materials and support services.',
  alternates: { canonical: 'https://btcmltai.com/terms-condition' },
};

export default function Page() {
  return <LegalPage slug="terms-condition" />;
}