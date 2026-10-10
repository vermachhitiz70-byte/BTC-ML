import { POSTS } from '@/lib/site-content';

const BASE = 'https://btcmltai.com';

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', freq: 'weekly' },
  { path: '/shop', priority: '0.9', freq: 'weekly' },
  { path: '/about', priority: '0.7', freq: 'monthly' },
  { path: '/blog', priority: '0.8', freq: 'weekly' },
  { path: '/gallery', priority: '0.6', freq: 'monthly' },
  { path: '/faqs', priority: '0.7', freq: 'monthly' },
  { path: '/contact', priority: '0.7', freq: 'monthly' },
  { path: '/products/btc-mlt-ai', priority: '0.9', freq: 'weekly' },
  { path: '/products/currency', priority: '0.9', freq: 'weekly' },
  { path: '/products/ict-silver-bullet-ea-MT5', priority: '0.7', freq: 'weekly' },
  { path: '/terms-condition', priority: '0.4', freq: 'yearly' },
  { path: '/privacy-policy', priority: '0.4', freq: 'yearly' },
  { path: '/refund-policy', priority: '0.4', freq: 'yearly' },
  { path: '/shipping-policy', priority: '0.4', freq: 'yearly' },
];

export default function sitemap() {
  const lastModified = new Date();

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${BASE}${r.path}`,
      lastModified,
      changeFrequency: r.freq,
      priority: Number(r.priority),
    })),
    ...POSTS.map((p) => ({
      url: `${BASE}/blogs/${p.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];
}
