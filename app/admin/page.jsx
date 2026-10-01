import Panel from './panel';

export const metadata = {
  title: 'Admin Panel | BTC ML AI',
  description: 'BTC ML AI administration.',
};

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/fb-admin.css?v=1" />
      <div className="fb-admin-page">
        <Panel />
      </div>
    </>
  );
}
