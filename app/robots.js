export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/account', '/checkout', '/cart'],
      },
    ],
    sitemap: 'https://btcmltai.com/sitemap.xml',
    host: 'https://btcmltai.com',
  };
}