import { PageShell, PageHero, SiteJsonLd, JsonLd } from '../site/chrome';
import { Btn, Card, RiskNote } from '../site/ui';
import { POSTS, POST_TAGS, getPost } from '@/lib/site-content';

function ArticleBody({ blocks }) {
  return (
    <div className="bs-article">
      {blocks.map((b, i) => {
        if (b.t === 'h2') return <h2 key={i}>{b.text}</h2>;
        if (b.t === 'h3') return <h3 key={i}>{b.text}</h3>;
        if (b.t === 'ul') {
          return (
            <ul key={i}>
              {b.items.map((it) => <li key={it}>{it}</li>)}
            </ul>
          );
        }
        if (b.t === 'quote') return <blockquote key={i}>{b.text}</blockquote>;
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}

function PostView({ post }) {
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <PageShell active="/blog">
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
      />

      <article className="bs-section">
        <div className="bs-container">
          <div className="bs-article-head">
            <div className="bs-postmeta">
              <span className="bs-tag">{post.category}</span>
              <span>By BTCMLTAI</span><span>/</span><span>{post.date}</span>
            </div>
            <h1 className="bs-article-title">{post.title}</h1>
            <p className="bs-note" style={{ fontSize: 15.5 }}>{post.excerpt}</p>
          </div>

          <div className="bs-article-hero">
            <img src={post.image} alt="" />
          </div>

          <ArticleBody blocks={post.body} />

          {post.links?.length ? (
            <Card style={{ marginTop: 30 }}>
              <h3 style={{ margin: '0 0 10px', fontSize: 16.5, fontWeight: 800, color: 'var(--bs-heading)' }}>
                Keep reading
              </h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {post.links.map((l) => (
                  <Btn key={l.href} size="sm" variant="outline" href={l.href}>{l.label}</Btn>
                ))}
              </div>
            </Card>
          ) : null}

          <div style={{ marginTop: 22 }}>
            <RiskNote>
              <b>General information only.</b> This article is educational content from BTCMLTAI. It
              is not investment advice, and no software can guarantee any trading result. Always
              test on a demo account first and never trade with funds you cannot afford to lose.
            </RiskNote>
          </div>

          <div style={{ marginTop: 22 }}>
            <p className="bs-note" style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
              Tags
            </p>
            <p style={{ fontSize: 13, color: 'var(--bs-muted)', margin: '6px 0 0' }}>{POST_TAGS}</p>
          </div>
        </div>
      </article>

      <section className="bs-section bs-section--tint">
        <div className="bs-container">
          <h2 className="bs-title bs-title--sm" style={{ textAlign: 'center', marginBottom: 26 }}>
            More from the blog
          </h2>
          <div className="bs-products bs-products--2">
            {related.map((p) => (
              <Card key={p.slug} hover className="bs-postcard" pad={false}>
                <div className="bs-postcard-media">
                  <img src={p.image} alt="" loading="lazy" />
                </div>
                <div className="bs-postcard-body">
                  <div className="bs-postmeta"><span>{p.date}</span></div>
                  <h3><a href={`/blogs/${p.slug}`}>{p.title}</a></h3>
                  <p>{p.excerpt}</p>
                  <Btn size="sm" variant="ghost" href={`/blogs/${p.slug}`}>Read More</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: [`https://btcmltai.com${post.image}`],
        datePublished: post.date,
        author: { '@type': 'Organization', name: 'BTCMLTAI' },
        publisher: { '@type': 'Organization', name: 'BTCMLTAI' },
        mainEntityOfPage: `https://btcmltai.com/blogs/${post.slug}`,
      }} />
      <SiteJsonLd />
    </PageShell>
  );
}

const TITLES = {
  'btc-x-ea-mt5-complete-overview': {
    title: 'What Is BTC MLT AI? Complete Overview, Features & Risk Guide | BTCMLTAI',
    description: 'BTC MLT AI is an automated Expert Advisor for BTCUSD on MT5, built around trend and volatility filters with structured risk controls.',
  },
  'btc-x-ea-mt5-installation-setup-guide': {
    title: 'How to Install BTCMLTAI Software on MT5 (Demo First) | BTCMLTAI',
    description: 'Step-by-step: how to install BTCMLTAI software on MetaTrader 5, attach it to a chart, choose starting settings, and validate on demo first.',
  },
  'btc-x-ea-mt5-risk-management-guide': {
    title: 'Currency Bot Coins: Multi-Currency Prop-Firm Trading Guide | BTCMLTAI',
    description: 'Currency Bot Coins trades 8 Forex pairs on MT5 H1 with drawdown protection and automatic money management.',
  },
  'btc-x-ea-mt5-backtest-settings-guide': {
    title: 'Silver by BTCMLTAI: Launch Preview & What to Expect | BTCMLTAI',
    description: 'Silver is the upcoming BTCMLTAI release, currently in final testing. This preview covers what is planned, launch updates, and how to get notified.',
  },
};

export { TITLES as POST_META };

export default function PostPage({ slug }) {
  const post = getPost(slug);
  if (!post) return null;
  return <PostView post={post} />;
}