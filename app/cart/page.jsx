import Cart from './cart';
import { PageShell, PageHero, SiteJsonLd } from '../site/chrome';

export const metadata = {
  title: 'Shopping Cart | BTCMLTAI',
  description: 'Review your BTCMLTAI cart and proceed to secure crypto checkout with instant digital delivery.',
  alternates: { canonical: 'https://btcmltai.com/cart' },
};

export default function Page() {
  return (
    <PageShell active="/cart">
      <PageHero
        eyebrow="Secure checkout"
        title="Your shopping cart"
        text="Review quantities and totals before continuing to payment. Delivery is instant and digital."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Cart' }]}
      />
      <section className="bs-section">
        <Cart />
      </section>
      <SiteJsonLd />
    </PageShell>
  );
}