import Account from './account';

export const metadata = {
  title: 'My Account | BTCMLTAI',
  description: 'View your BTCMLTAI orders and account details.',
  alternates: { canonical: 'https://btcmltai.com/account' },
};

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/fb-account.css?v=3" />
      <div className="fb-auth-page">
        <Account />
      </div>
    </>
  );
}


