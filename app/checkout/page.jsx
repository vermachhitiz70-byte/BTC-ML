import Script from 'next/script';
import { StoreHeader, StoreFooter } from '../store-chrome';
import Checkout from './checkout';

export const metadata = {
  title: 'Checkout | BTCMLTAI',
  description: 'Complete your BTCMLTAI order securely with crypto payment.',
  alternates: { canonical: 'https://btcmltai.com/checkout' },
};

export default function Page() {
  return (
    <div className="st-page">
      <link rel="icon" href="/assets/images/btcmlai-logo.png" type="image/png" />
      <link rel="stylesheet" href="/assets/css/fb-store.css?v=1" />
      <link rel="stylesheet" href="/assets/css/fb-cart.css?v=1" />
      <StoreHeader active="/checkout" />
      <Checkout />
      <StoreFooter />
      <Script src="/assets/js/fb-cart.js?v=2" strategy="afterInteractive" />
    </div>
  );
}
