import PostPage, { POST_META } from '../post-page';
import { POSTS } from '@/lib/site-content';

const M = POST_META['btc-x-ea-mt5-complete-overview'];
const IMG = POSTS.find((p) => p.slug === 'btc-x-ea-mt5-complete-overview')?.image || '/assets/images/blogs/blog-6a77140e7a9af.jpg';

export const metadata = {
  title: M.title,
  description: M.description,
  alternates: { canonical: 'https://btcmltai.com/blogs/btc-x-ea-mt5-complete-overview' },
  openGraph: {
    title: M.title,
    description: M.description,
    url: 'https://btcmltai.com/blogs/btc-x-ea-mt5-complete-overview',
    siteName: 'BTCMLTAI',
    type: 'article',
    images: [{ url: 'https://btcmltai.com' + IMG, width: 1200, height: 750, alt: M.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: M.title,
    description: M.description,
    images: ['https://btcmltai.com' + IMG],
  },
};

export default function Page() {
  return <PostPage slug="btc-x-ea-mt5-complete-overview" />;
}