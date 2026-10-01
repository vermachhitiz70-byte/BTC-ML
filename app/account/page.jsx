import Account from './account';

export const metadata = {
  title: 'My Account | BTC ML AI',
  description: 'View your BTC ML AI orders and account details.',
  alternates: { canonical: 'https://btcmlai.com/account' },
};

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/fb-account.css?v=1" />
      <div className="fb-auth-page">
        <Account />
      </div>
    </>
  );
}
