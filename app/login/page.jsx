import LoginForm from './form';

export const metadata = {
  title: 'Login | BTC ML AI',
  description: 'Log in to your BTC ML AI account to view orders and manage your details.',
  alternates: { canonical: 'https://btcmlai.com/login' },
};

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/fb-account.css?v=1" />
      <div className="fb-auth-page">
        <LoginForm />
      </div>
    </>
  );
}
