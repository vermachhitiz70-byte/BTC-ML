import Checkout from './checkout';

export const metadata = {
  title: 'Checkout | BTC ML AI',
  description: 'Complete your BTC ML AI order securely with crypto payment.',
  alternates: { canonical: 'https://btcmlai.com/checkout' },
};

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/fb-account.css?v=3" />
      <div className="fb-auth-page">
        <Checkout />
      </div>
    </>
  );
}


