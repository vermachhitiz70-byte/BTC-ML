export default {
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      { source: '/premium', destination: '/shop', permanent: true },
      { source: '/premium/:path*', destination: '/shop', permanent: true },
    ];
  },
};
