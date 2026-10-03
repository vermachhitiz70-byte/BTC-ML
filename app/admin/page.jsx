import AdminApp from './AdminApp';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Panel | BTCMLTAI',
  description: 'BTCMLTAI administration.',
};

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/fb-admin.css?v=5" />
      <script src="/assets/js/fb-admin-particles.js" defer />
      <div className="fb-admin-page">
        <AdminApp />
      </div>
    </>
  );
}