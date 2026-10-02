import LoginForm from './form';

export const metadata = {
  title: 'Login | BTCMLTAI',
  description: 'Log in to your BTCMLTAI account to view orders and manage your details.',
  alternates: { canonical: 'https://btcmltai.com/login' },
};

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/fb-account.css?v=3" />
      <div className="fb-auth-page">
        <LoginForm />
      </div>
    </>
  );
}


