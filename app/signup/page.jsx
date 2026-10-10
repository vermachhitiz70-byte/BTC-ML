import SignupForm from './form';
import { PageShell, SiteJsonLd } from '../site/chrome';

export const metadata = {
  title: 'Create Account | BTCMLTAI',
  description: 'Create a free BTCMLTAI customer account to track orders, licences, downloads and installation guidance.',
  alternates: { canonical: 'https://btcmltai.com/signup' },
};

export default function Page() {
  return (
    <PageShell active="/login" cart>
      <section className="bs-section">
        <SignupForm />
      </section>
      <SiteJsonLd />
    </PageShell>
  );
}