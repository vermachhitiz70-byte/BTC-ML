import SignupForm from './form';

export const metadata = {
  title: 'Create Account | BTC ML AI',
  description: 'Register a BTC ML AI account to track orders and check out faster.',
  alternates: { canonical: 'https://btcmlai.com/signup' },
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


