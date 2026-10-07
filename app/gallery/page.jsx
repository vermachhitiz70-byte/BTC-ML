import { PageShell, PageHero, SiteJsonLd } from '../site/chrome';
import { Card, SectionHead } from '../site/ui';
import { GALLERY_IMAGES } from '@/lib/site-content';
import GalleryGrid from './grid';

export const metadata = {
  title: 'Gallery | BTCMLTAI',
  description:
    'Screenshots and previews of BTCMLTAI trading software, analysis tools and platform setup on MetaTrader.',
  alternates: { canonical: 'https://btcmltai.com/gallery' },
};

export default function GalleryPage() {
  return (
    <PageShell active="/gallery">
      <PageHero
        eyebrow="Previews"
        title="Gallery"
        text="Screenshots and previews of our trading software, analysis tools and platform setup."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
      />
      <section className="bs-section">
        <div className="bs-container">
          <SectionHead
            eyebrow="Screen &amp; platform previews"
            title="See the software in place"
            sub="Select any image to view it larger."
          />
          <GalleryGrid images={GALLERY_IMAGES} />
        </div>
      </section>
      <SiteJsonLd />
    </PageShell>
  );
}