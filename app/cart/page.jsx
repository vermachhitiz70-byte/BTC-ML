import Cart from './cart';

export const metadata = {
  title: 'Shopping Cart | BTCMLTAI',
  description: 'Review your BTCMLTAI cart and proceed to secure checkout.',
  alternates: { canonical: 'https://btcmltai.com/cart' },
};

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/fb-account.css?v=3" />
      <script src="/assets/js/fb-auth-particles.js" defer />
      <div className="fb-auth-bg" />
      <div className="fb-auth-page">
        <Cart />
      </div>
    </>
  );
}


