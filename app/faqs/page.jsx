import { PageShell, PageHero, SiteJsonLd, JsonLd } from '../site/chrome';
import { Btn, Card, Accordion, SectionHead, Tile } from '../site/ui';
import { Sparkles, ShieldCheck, Wallet, Cpu, FileText, Headset, CircleQuestionMark } from 'lucide-react';
import { FAQ_GROUPS } from '@/lib/site-content';

export const metadata = {
  title: 'Frequently Asked Questions | BTCMLTAI',
  description:
    'Answers about BTCMLTAI accounts, orders, digital software delivery, product licences, installation, support, refunds, platform compatibility and responsible software use.',
  alternates: { canonical: 'https://btcmltai.com/faqs' },
};

const ICONS = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  wallet: Wallet,
  cpu: Cpu,
  fileText: FileText,
};

export default function FaqsPage() {
  const total = FAQ_GROUPS.reduce((s, g) => s + g.items.length, 0);

  return (
    <PageShell active="/faqs">
      <PageHero
        eyebrow="Help centre"
        title="Frequently Asked Questions"
        text="Find answers about accounts, orders, digital delivery, licences, installation, support, refunds and responsible software use."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'FAQs' }]}
      />

      <section className="bs-section">
        <div className="bs-container">
          <SectionHead
            eyebrow={`${total} answers`}
            tone="emerald"
            title="Everything you usually ask us"
            sub="Grouped by topic. If your question is not here, our support team replies within 2–3 hours."
          />

          <div style={{ display: 'grid', gap: 30 }}>
            {FAQ_GROUPS.map((g) => {
              const Icon = ICONS[g.icon] || CircleQuestionMark;
              return (
                <div key={g.title}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 16 }}>
                    <Tile icon={Icon} tone="blue" />
                    <h2 className="bs-title bs-title--sm" style={{ margin: 0 }}>{g.title}</h2>
                  </div>
                  <Accordion items={g.items} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bs-section bs-section--tint">
        <div className="bs-container">
          <Card gold style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <Tile icon={Headset} tone="gold" size="lg" />
            <h2 className="bs-title bs-title--sm" style={{ marginTop: 16 }}>Still need help?</h2>
            <p className="bs-note" style={{ marginTop: 10 }}>
              Send us your question and our support team will get back to you within 2 to 3 hours.
              You can also use the chat widget on any page for a quicker reply.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
              <Btn variant="gold" href="/contact">Contact Support</Btn>
              <Btn variant="ghost" href="/shop">Browse Software</Btn>
            </div>
          </Card>
        </div>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_GROUPS.flatMap((g) =>
          g.items.map((it) => ({
            '@type': 'Question',
            name: it.q,
            acceptedAnswer: { '@type': 'Answer', text: it.a },
          }))
        ),
      }} />
      <SiteJsonLd />
    </PageShell>
  );
}