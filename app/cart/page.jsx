import Script from 'next/script';
import { StoreHeader, StoreFooter } from '../store-chrome';
import Cart from './cart';

export const metadata = {
  title: 'Shopping Cart | BTCMLTAI',
  description: 'Review your BTCMLTAI cart and proceed to secure checkout.',
  alternates: { canonical: 'https://btcmltai.com/cart' },
};

export default function Page() {
  return (
    <div className="st-page">
      <link rel="icon" href="/assets/images/btcmlai-logo.png" type="image/png" />
      <link rel="stylesheet" href="/assets/css/fb-store.css?v=1" />
      <link rel="stylesheet" href="/assets/css/fb-cart.css?v=1" />
      <StoreHeader active="/cart" />
      <Cart />
      <StoreFooter />
      <Script src="/assets/js/fb-cart.js?v=2" strategy="afterInteractive" />
    </div>
  );
}
