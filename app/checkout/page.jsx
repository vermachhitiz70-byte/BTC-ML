import Checkout from './checkout';
import { PageShell, PageHero, SiteJsonLd } from '../site/chrome';

export const metadata = {
  title: 'Secure Checkout | BTCMLTAI',
  description: 'Complete your BTCMLTAI order with USDT (BEP20) crypto payment. Instant digital delivery with installation guidance.',
  alternates: { canonical: 'https://btcmltai.com/checkout' },
};

export default function Page() {
  return (
    <PageShell active="/checkout">
      <PageHero
        eyebrow="Step-by-step"
        title="Secure checkout"
        text="Enter your details, send the exact amount, and submit your payment proof. Delivery follows within 2 to 3 hours."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]}
      />
      <section className="bs-section">
        <Checkout />
      </section>
      <SiteJsonLd />
    </PageShell>
  );
}