import { PageShell, SiteJsonLd } from './site/chrome';
import { Btn, Card, EmptyState } from './site/ui';
import { Compass } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found (404) | BTCMLTAI',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <PageShell>
      <section className="bs-section">
        <div className="bs-container">
          <Card pad={false} style={{ maxWidth: 620, margin: '0 auto' }}>
            <EmptyState
              icon={Compass}
              title="404 — page not found"
              text="The page you are looking for has moved or no longer exists. Use the links below to get back on track."
            >
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Btn variant="gold" href="/">Back to Home</Btn>
                <Btn variant="ghost" href="/shop">Browse Software</Btn>
                <Btn variant="ghost" href="/contact">Contact Support</Btn>
              </div>
            </EmptyState>
          </Card>
        </div>
      </section>
      <SiteJsonLd />
    </PageShell>
  );
}