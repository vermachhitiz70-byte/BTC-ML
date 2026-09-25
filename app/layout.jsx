export const metadata = {
  title: 'BTC ML AI | MT4 Trading Software & Analysis Tools',
  description:
    'BTC ML AI provides rule-based MT4 trading software, market-analysis tools and educational video guides.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="template-color-1">{children}</body>
    </html>
  );
}
