import ProductDetailRoute from '../product-detail';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Silver | Coming Soon | BTCMLTAI',
  description: 'Silver is coming soon from BTCMLTAI — a disciplined, low-frequency Expert Advisor in final testing. Join the early list for launch updates.',
  alternates: { canonical: 'https://btcmltai.com/products/ict-silver-bullet-ea-MT5' },
  openGraph: {
    title: 'Silver | Coming Soon | BTCMLTAI',
    description: 'Silver is coming soon from BTCMLTAI — a disciplined, low-frequency Expert Advisor in final testing.',
    url: 'https://btcmltai.com/products/ict-silver-bullet-ea-MT5',
    siteName: 'BTCMLTAI',
    type: 'website',
    images: [{ url: 'https://btcmltai.com/assets/images/products/silver-package.png', width: 1254, height: 1254, alt: 'Silver | Coming Soon | BTCMLTAI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silver | Coming Soon | BTCMLTAI',
    description: 'A disciplined, low-frequency Expert Advisor in final testing. Join the early list.',
    images: ['https://btcmltai.com/assets/images/products/silver-package.png'],
  },
};

export default function Page() {
  return <ProductDetailRoute slug="ict-silver-bullet-ea-MT5" />;
}
