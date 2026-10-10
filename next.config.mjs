export default {
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      { source: '/premium', destination: '/shop', permanent: true },
      { source: '/premium/:path*', destination: '/shop', permanent: true },
      { source: '/register', destination: '/signup', permanent: true },
      { source: '/products/btc-x-ea-mt5', destination: '/products/btc-mlt-ai', permanent: true },
      { source: '/products/galaxy-prop-firm-ea-mt5', destination: '/products/currency', permanent: true },
    ];
  },
};
