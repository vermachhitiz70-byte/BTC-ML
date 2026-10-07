import { PageShell, PageHero, SiteJsonLd } from '../site/chrome';
import { Btn, Card, SectionHead, Tile } from '../site/ui';
import {
  Headset, Clock, Wallet, CircleAlert, MessageCircle, PackageCheck, Mail,
} from 'lucide-react';
import ContactForm from './form';

export const metadata = {
  title: 'Contact Us | BTCMLTAI Support',
  description:
    'Contact the BTCMLTAI support team for product compatibility, order and payment verification, licence and delivery, installation help or refund requests. Replies within 2 to 3 hours.',
  alternates: { canonical: 'https://btcmltai.com/contact' },
};

const CHANNELS = [
  {
    icon: MessageCircle,
    tone: 'blue',
    title: 'Live chat',
    text: 'The fastest option. Open the chat bubble on any page and share your question — you will get a reply within 2 to 3 hours.',
  },
  {
    icon: Mail,
    tone: 'emerald',
    title: 'Contact form',
    text: 'Send full details below. Every submission reaches our support inbox directly, and we reply within 2 to 3 hours.',
  },
  {
    icon: PackageCheck,
    tone: 'gold',
    title: 'Order & delivery help',
    text: 'Include your order code and the email used at checkout so we can verify and re-deliver your files quickly.',
  },
  {
    icon: Wallet,
    tone: 'purple',
    title: 'Payment questions',
    text: 'For payment verification, include your transaction hash and a screenshot of the transfer.',
  },
];

export default function ContactPage() {
  return (
    <PageShell active="/contact">
      <PageHero
        eyebrow="We reply within 2–3 hours"
        title="Contact our support team"
        text="Questions about compatibility, orders, delivery, installation or refunds — tell us what you need and we will help."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <section className="bs-section">
        <div className="bs-container">
          <div className="bs-co">
            <Card>
              <div className="bs-cart-head">
                <h2>Send your message</h2>
              </div>
              <p className="bs-note" style={{ marginTop: -6, marginBottom: 20 }}>
                Complete the form below and the support team will review your request.
              </p>
              <ContactForm />
            </Card>

            <div style={{ display: 'grid', gap: 18 }}>
              <Card gold>
                <Tile icon={Headset} tone="gold" size="lg" />
                <h3 style={{ margin: '16px 0 8px', fontSize: 18, fontWeight: 800, color: 'var(--bs-heading)' }}>
                  Prefer live chat?
                </h3>
                <p className="bs-note" style={{ margin: '0 0 16px' }}>
                  Use the chat bubble in the bottom corner of any page. It is the quickest way to
                  reach us, and it keeps the whole conversation in one place.
                </p>
                <Btn variant="gold" href="javascript:void(0)" data-fb-chat="1">
                  <MessageCircle size={16} aria-hidden="true" /> Open live chat
                </Btn>
              </Card>

              <Card>
                <Tile icon={Clock} tone="blue" />
                <h3 style={{ margin: '14px 0 6px', fontSize: 16.5, fontWeight: 800, color: 'var(--bs-heading)' }}>
                  Support hours
                </h3>
                <p className="bs-note" style={{ margin: 0 }}>
                  Messages are reviewed continuously. Typical response time is 2 to 3 hours, and
                  order verification follows the same window.
                </p>
              </Card>

              <Card>
                <Tile icon={CircleAlert} tone="red" />
                <h3 style={{ margin: '14px 0 6px', fontSize: 16.5, fontWeight: 800, color: 'var(--bs-heading)' }}>
                  Before you write
                </h3>
                <p className="bs-note" style={{ margin: '0 0 12px' }}>
                  Many questions are answered instantly on these pages:
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Btn size="sm" variant="outline" href="/faqs">Read FAQs</Btn>
                  <Btn size="sm" variant="outline" href="/shipping-policy">Delivery policy</Btn>
                  <Btn size="sm" variant="outline" href="/refund-policy">Refund policy</Btn>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bs-section bs-section--tint">
        <div className="bs-container">
          <SectionHead
            eyebrow="Ways to reach us"
            tone="emerald"
            title="Choose whatever suits you"
            sub="All channels reach the same support team."
          />
          <div className="bs-features bs-features--2">
            {CHANNELS.map((c) => (
              <Card key={c.title} hover className="bs-feature">
                <Tile icon={c.icon} tone={c.tone} size="lg" />
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SiteJsonLd />
    </PageShell>
  );
}