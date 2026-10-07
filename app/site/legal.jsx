import { PageShell, PageHero, SiteJsonLd } from '../site/chrome';
import { Card, RiskNote, Btn } from '../site/ui';
import { POLICIES } from '@/lib/site-content';

export function LegalPage({ slug }) {
  const doc = POLICIES[slug];
  if (!doc) return null;

  return (
    <PageShell>
      <PageHero
        eyebrow="Legal & policies"
        title={doc.title}
        text={doc.intro}
        crumbs={[{ label: 'Home', href: '/' }, { label: doc.title }]}
      />

      <section className="bs-section">
        <div className="bs-container">
          <div className="bs-legal">
            <Card className="bs-legal-nav">
              <h4>On this page</h4>
              {doc.sections.map((s, i) => (
                <a key={s.h} href={`#s${i}`}>{s.h.replace(/^\d+\.\s*/, '')}</a>
              ))}
            </Card>

            <div className="bs-card bs-card--pad">
              <div className="bs-legal-body">
                <p className="bs-note" style={{ marginBottom: 22 }}>{doc.intro}</p>
                {doc.sections.map((s, i) => (
                  <div key={s.h} id={`s${i}`} style={{ scrollMarginTop: 110 }}>
                    <h2>{s.h}</h2>
                    {s.p.map((para, j) => <p key={j}>{para}</p>)}
                    {s.ul ? <ul>{s.ul.map((li) => <li key={li}>{li}</li>)}</ul> : null}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 26 }}>
                <RiskNote>
                  <b>Trading involves substantial risk.</b> Past performance never guarantees future
                  results. Always test on a demo account first and never trade with funds you cannot
                  afford to lose. BTCMLTAI provides digital software and general educational
                  materials only — we are not a broker, we do not accept client funds, and we never
                  guarantee returns.
                </RiskNote>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                <Btn variant="ghost" href="/contact">Contact Support</Btn>
                <Btn variant="ghost" href="/faqs">Read the FAQs</Btn>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteJsonLd />
    </PageShell>
  );
}