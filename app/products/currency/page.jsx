import ProductDetailRoute from '../product-detail';

export const revalidate = 600;

export const metadata = {
  title: 'Currency | Multi-Currency Funded Account EA | BTCMLTAI',
  description: 'Currency is a multi-currency prop-firm Expert Advisor with drawdown protection across 8 Forex pairs on H1. $1,500, instant digital delivery.',
  alternates: { canonical: 'https://btcmltai.com/products/currency' },
  openGraph: {
    title: 'Currency | Multi-Currency Funded Account EA | BTCMLTAI',
    description: 'A multi-currency prop-firm Expert Advisor with drawdown protection across 8 Forex pairs on H1.',
    url: 'https://btcmltai.com/products/currency',
    siteName: 'BTCMLTAI',
    type: 'website',
    images: [{ url: 'https://btcmltai.com/assets/images/products/btcmlt-currency.png', width: 1254, height: 1254, alt: 'Currency | Multi-Currency Funded Account EA | BTCMLTAI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Currency | Multi-Currency Funded Account EA | BTCMLTAI',
    description: 'A multi-currency prop-firm Expert Advisor with drawdown protection across 8 Forex pairs on H1.',
    images: ['https://btcmltai.com/assets/images/products/btcmlt-currency.png'],
  },
};

export default function Page() {
  return <ProductDetailRoute slug="currency" />;
}