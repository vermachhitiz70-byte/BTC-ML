import { LegalPage } from '../site/legal';

export const metadata = {
  title: 'Refund Policy | BTCMLTAI',
  description: 'How refunds work for BTCMLTAI digital software products, which are licensed and delivered instantly.',
  alternates: { canonical: 'https://btcmltai.com/refund-policy' },
};

export default function Page() {
  return <LegalPage slug="refund-policy" />;
}