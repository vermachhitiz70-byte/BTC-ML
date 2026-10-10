import ProductDetailRoute from '../product-detail';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'BTC MLT AI | Automated BTCUSD Trading Software | BTCMLTAI',
  description: 'BTC MLT AI is an automated Expert Advisor for BTCUSD on MT5 with trend and volatility filters and structured risk controls. $1,999, instant digital delivery.',
  alternates: { canonical: 'https://btcmltai.com/products/btc-mlt-ai' },
  openGraph: {
    title: 'BTC MLT AI | Automated BTCUSD Trading Software | BTCMLTAI',
    description: 'BTC MLT AI is an automated Expert Advisor for BTCUSD on MT5 with trend and volatility filters and structured risk controls.',
    url: 'https://btcmltai.com/products/btc-mlt-ai',
    siteName: 'BTCMLTAI',
    type: 'website',
    images: [{ url: 'https://btcmltai.com/assets/images/products/btcmlt-ai-2.png', width: 1254, height: 1254, alt: 'BTC MLT AI | Automated BTCUSD Trading Software | BTCMLTAI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BTC MLT AI | Automated BTCUSD Trading Software | BTCMLTAI',
    description: 'Automated Expert Advisor for BTCUSD on MT5 with structured risk controls.',
    images: ['https://btcmltai.com/assets/images/products/btcmlt-ai-2.png'],
  },
};

export default function Page() {
  return <ProductDetailRoute slug="btc-mlt-ai" />;
}
