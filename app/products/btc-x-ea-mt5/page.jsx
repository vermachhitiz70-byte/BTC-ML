import ProductDetailRoute from '../product-detail';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'BTC MLT | Automated BTCUSD Trading Software | BTCMLTAI',
  description: 'BTC MLT is an automated Expert Advisor for BTCUSD on MT5 with trend and volatility filters and structured risk controls. 1,500 dollars, instant digital delivery.',
  alternates: { canonical: 'https://btcmltai.com/products/btc-x-ea-mt5' },
  openGraph: {
    title: 'BTC MLT | Automated BTCUSD Trading Software | BTCMLTAI',
    description: 'BTC MLT is an automated Expert Advisor for BTCUSD on MT5 with trend and volatility filters and structured risk controls.',
    url: 'https://btcmltai.com/products/btc-x-ea-mt5',
    siteName: 'BTCMLTAI',
    type: 'website',
    images: [{ url: 'https://btcmltai.com/assets/images/products/btcml.png', width: 1254, height: 1254, alt: 'BTC MLT | Automated BTCUSD Trading Software | BTCMLTAI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BTC MLT | Automated BTCUSD Trading Software | BTCMLTAI',
    description: 'Automated Expert Advisor for BTCUSD on MT5 with structured risk controls.',
    images: ['https://btcmltai.com/assets/images/products/btcml.png'],
  },
};

export default function Page() {
  return <ProductDetailRoute slug="btc-x-ea-mt5" />;
}