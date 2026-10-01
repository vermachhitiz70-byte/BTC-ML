import Cart from './cart';

export const metadata = {
  title: 'Shopping Cart | BTC ML AI',
  description: 'Review your BTC ML AI cart and proceed to secure checkout.',
  alternates: { canonical: 'https://btcmlai.com/cart' },
};

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/fb-account.css?v=3" />
      <div className="fb-auth-page">
        <Cart />
      </div>
    </>
  );
}


