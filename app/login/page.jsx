import LoginForm from './form';
import { PageShell, SiteJsonLd } from '../site/chrome';

export const metadata = {
  title: 'Login | BTCMLTAI',
  description: 'Log in to your BTCMLTAI account to view orders, licences and digital delivery details.',
  alternates: { canonical: 'https://btcmltai.com/login' },
};

export default function Page() {
  return (
    <PageShell active="/login" cart>
      <section className="bs-section">
        <LoginForm />
      </section>
      <SiteJsonLd />
    </PageShell>
  );
}