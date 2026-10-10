import { PageShell, PageHero, SiteJsonLd } from '../site/chrome';
import {
  Btn, Card, Chip, SectionHead, CheckList, RiskNote, Tile, Stats,
} from '../site/ui';
import { Wallet, ShieldCheck, CircleAlert, Target, PackageCheck, Headset, ChartBar, BookOpen } from 'lucide-react';
import { ABOUT } from '@/lib/site-content';

const WHY_ICONS = [PackageCheck, ChartBar, BookOpen, Wallet, Headset];

export const metadata = {
  title: 'About BTCMLTAI | Trading Software & Educational Tools',
  description:
    'BTCMLTAI is a digital software brand providing rule-based trading software, market-analysis tools, general educational video guides, installation guidance and customer support. We do not accept client funds or guarantee returns.',
  alternates: { canonical: 'https://btcmltai.com/about' },
  openGraph: {
    title: 'About BTCMLTAI | Trading Software & Educational Tools',
    description:
      'Digital trading software, market-analysis tools and general educational video guides with clear product information and installation support.',
    url: 'https://btcmltai.com/about',
    siteName: 'BTCMLTAI',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <PageShell active="/about">
      <PageHero
        eyebrow="About us"
        title={ABOUT.hero.title}
        text={ABOUT.hero.text}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <section className="bs-section">
        <div className="bs-container">
          <div className="bs-co">
            <div>
              <span className="bs-eyebrow">Who we are</span>
              <h2 className="bs-title" style={{ marginTop: 14 }}>{ABOUT.intro.title}</h2>
              {ABOUT.intro.body.map((p) => (
                <p key={p.slice(0, 32)} style={{ marginTop: 16, fontSize: 15.5, lineHeight: 1.85, color: 'var(--bs-muted)' }}>
                  {p}
                </p>
              ))}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 22 }}>
                {ABOUT.hero.chips.map((c) => (
                  <Chip key={c} tone="gold">{c}</Chip>
                ))}
              </div>
            </div>

            <Card gold>
              <Tile icon={CircleAlert} tone="red" size="lg" />
              <h3 style={{ margin: '16px 0 8px', fontSize: 18, fontWeight: 800, color: 'var(--bs-heading)' }}>
                Not an investment service
              </h3>
              <p className="bs-note" style={{ margin: 0 }}>
                We provide digital software products, technical setup assistance, and general
                educational information only. We do not provide brokerage, personalised investment
                advisory, portfolio management, fund management, or client-account management
                services, and we never accept client trading funds.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="bs-section bs-section--tint">
        <div className="bs-container">
          <SectionHead
            eyebrow="Our catalogue"
            tone="emerald"
            title={ABOUT.provide.title}
            sub="Everything we supply is delivered digitally with clear terms before you order."
          />
          <Card style={{ maxWidth: 760, margin: '0 auto' }}>
            <CheckList items={ABOUT.provide.items} />
          </Card>
        </div>
      </section>

      <section className="bs-section">
        <div className="bs-container bs-container--mid">
          <SectionHead eyebrow="How we work" title={ABOUT.approach.title} />
          {ABOUT.approach.body.map((p) => (
            <p key={p.slice(0, 32)} style={{ marginBottom: 16, fontSize: 15.5, lineHeight: 1.85, color: 'var(--bs-muted)' }}>
              {p}
            </p>
          ))}
          <div style={{ marginTop: 26 }}>
            <Card>
              <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 800, color: 'var(--bs-heading)' }}>
                {ABOUT.commitment.title}
              </h3>
              {ABOUT.commitment.body.map((p) => (
                <p key={p.slice(0, 32)} style={{ margin: 0, fontSize: 15, lineHeight: 1.8, color: 'var(--bs-muted)' }}>
                  {p}
                </p>
              ))}
            </Card>
          </div>
        </div>
      </section>

      <section className="bs-section bs-section--tint">
        <div className="bs-container">
          <SectionHead eyebrow="What you get" title={ABOUT.why.title} />
          <div className="bs-why5">
            {ABOUT.why.items.map((w, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length];
              return (
                <div key={w.t} className={`bs-why5-item bs-why5-item--${i + 1} bs-reveal`}>
                  <div className="bs-why5-col">
                    <span className="bs-why5-num">{String(i + 1).padStart(2, '0')}</span>
                    <b className="bs-why5-title">{w.t}</b>
                    <span className="bs-why5-icon"><Icon size={34} strokeWidth={1.5} /></span>
                  </div>
                  <span className="bs-why5-line" aria-hidden="true" />
                  <p className="bs-why5-text">{w.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bs-section">
        <div className="bs-container">
          <SectionHead eyebrow="Our position" title="Clear about what we are — and are not" />
          <Stats
            cols={3}
            items={[
              { icon: Wallet, tone: 'gold', title: 'Digital software provider', text: 'We supply software and information. Payments go to our wallet; we never hold client money.' },
              { icon: ShieldCheck, tone: 'emerald', title: 'No guaranteed returns', text: 'We do not promise profit, income, accuracy, loss recovery or any specific result.' },
              { icon: Target, tone: 'purple', title: 'You stay in control', text: 'You choose the broker, account, leverage, lot size and risk controls independently.' },
            ]}
          />

          <div style={{ marginTop: 26 }}>
            <RiskNote>
              <b>Risk disclosure.</b> Forex, CFD, leveraged, algorithmic and automated trading
              involve a high risk of financial loss. Past performance and backtested results never
              guarantee live results. Always test on a demo account first and never trade with funds
              you cannot afford to lose.
            </RiskNote>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 30, flexWrap: 'wrap' }}>
            <Btn variant="gold" href="/shop">Explore Our Software</Btn>
            <Btn variant="ghost" href="/contact">
              <Headset size={16} aria-hidden="true" /> Talk to Support
            </Btn>
          </div>
        </div>
      </section>

      <SiteJsonLd />
    </PageShell>
  );
}