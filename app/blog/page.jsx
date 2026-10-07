import Link from 'next/link';
import { PageShell, PageHero, SiteJsonLd, JsonLd } from '../site/chrome';
import { Btn, Card, SectionHead } from '../site/ui';
import { POSTS } from '@/lib/site-content';

export const metadata = {
  title: 'Blog & Guides | BTCMLTAI',
  description:
    'Software guides, MetaTrader installation tutorials, platform walkthroughs and general market education content from BTCMLTAI.',
  alternates: { canonical: 'https://btcmltai.com/blog' },
};

export default function BlogPage() {
  return (
    <PageShell active="/blog">
      <PageHero
        eyebrow="Educational resources"
        title="Blog & Guides"
        text="Software guides, platform tutorials, and general market education content written by the BTCMLTAI team."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
      />

      <section className="bs-section">
        <div className="bs-container">
          <SectionHead
            eyebrow={`${POSTS.length} article${POSTS.length === 1 ? '' : 's'}`}
            title="Latest Articles and Guides"
            sub="All content here is general educational information, not personalised investment advice."
          />

          <div className="bs-products">
            {POSTS.map((post) => (
              <Card key={post.slug} hover className="bs-postcard bs-reveal" pad={false}>
                <div className="bs-postcard-media">
                  <img src={post.image} alt="" loading="lazy" />
                  <span className="bs-badge bs-badge--live">{post.category}</span>
                </div>
                <div className="bs-postcard-body">
                  <div className="bs-postmeta">
                    <span>By BTCMLTAI</span><span>/</span><span>{post.date}</span>
                  </div>
                  <h3><Link href={`/blogs/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.excerpt}</p>
                  <Btn size="sm" variant="ghost" href={`/blogs/${post.slug}`}>Read More</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bs-section bs-section--tight bs-section--tint">
        <div className="bs-container">
          <Card gold style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="bs-title bs-title--sm">Looking for a specific product?</h2>
            <p className="bs-note" style={{ marginTop: 10 }}>
              Every product page lists supported platform, timeframes, instruments, licence terms and delivery details.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
              <Btn variant="gold" href="/shop">Browse Software</Btn>
              <Btn variant="ghost" href="/contact">Ask Support</Btn>
            </div>
          </Card>
        </div>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'BTCMLTAI Blog & Guides',
        url: 'https://btcmltai.com/blog',
        blogPost: POSTS.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          description: p.excerpt,
          image: `https://btcmltai.com${p.image}`,
          datePublished: p.date,
          author: { '@type': 'Organization', name: 'BTCMLTAI' },
        })),
      }} />
      <SiteJsonLd />
    </PageShell>
  );
}