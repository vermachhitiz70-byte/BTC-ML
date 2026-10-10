import Account from './account';
import { PageShell, SiteJsonLd } from '../site/chrome';

export const metadata = {
  title: 'My Account | BTCMLTAI',
  description: 'View your BTCMLTAI orders, payment status, licences and digital delivery details.',
  alternates: { canonical: 'https://btcmltai.com/account' },
};

export default function Page() {
  return (
    <PageShell active="/account" cart>
      <section className="bs-section">
        <Account />
      </section>
      <SiteJsonLd />
    </PageShell>
  );
}