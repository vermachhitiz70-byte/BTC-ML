export const metadata = {
  title: 'BTCMLTAI | MT5 Trading Software & Analysis Tools',
  description:
    'BTCMLTAI provides rule-based MT5 trading software, market-analysis tools and educational video guides.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
