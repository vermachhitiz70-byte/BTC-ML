import ProductDetailRoute from '../product-detail';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Currency Bot Coins | Multi-Currency Funded Account EA | BTCMLTAI',
  description: 'Currency Bot Coins is a multi-currency prop-firm Expert Advisor with drawdown protection across 8 Forex pairs on H1. 1,500 dollars, instant digital delivery.',
  alternates: { canonical: 'https://btcmltai.com/products/galaxy-prop-firm-ea-mt5' },
  openGraph: {
    title: 'Currency Bot Coins | Multi-Currency Funded Account EA | BTCMLTAI',
    description: 'A multi-currency prop-firm Expert Advisor with drawdown protection across 8 Forex pairs on H1.',
    url: 'https://btcmltai.com/products/galaxy-prop-firm-ea-mt5',
    siteName: 'BTCMLTAI',
    type: 'website',
    images: [{ url: 'https://btcmltai.com/assets/images/products/currency-bot-coins.png', width: 1254, height: 1254, alt: 'Currency Bot Coins | Multi-Currency Funded Account EA | BTCMLTAI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Currency Bot Coins | Multi-Currency Funded Account EA | BTCMLTAI',
    description: 'A multi-currency prop-firm Expert Advisor with drawdown protection across 8 Forex pairs on H1.',
    images: ['https://btcmltai.com/assets/images/products/currency-bot-coins.png'],
  },
};

export default function Page() {
  return <ProductDetailRoute slug="galaxy-prop-firm-ea-mt5" />;
}