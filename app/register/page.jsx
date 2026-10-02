import SignupForm from './form';

export const metadata = {
  title: 'Register | BTCMLTAI',
  description: 'Register a BTCMLTAI account to track orders and check out faster.',
  alternates: { canonical: 'https://btcmltai.com/register' },
};

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/fb-account.css?v=3" />
      <div className="fb-auth-page">
        <SignupForm />
      </div>
    </>
  );
}

