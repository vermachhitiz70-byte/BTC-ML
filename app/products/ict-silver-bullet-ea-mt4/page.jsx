import ProductDetail from '../product-detail';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Silver | Coming Soon | BTCMLTAI",
  description: "Silver is coming soon. Join the early list for launch updates from BTCMLTAI.",
  alternates: { canonical: "https://btcmltai.com/products/ict-silver-bullet-ea-mt4" },
  openGraph: {
    title: "Silver | Coming Soon | BTCMLTAI",
    description: "Silver is coming soon. Join the early list for launch updates from BTCMLTAI.",
    url: "https://btcmltai.com/products/ict-silver-bullet-ea-mt4",
    siteName: "BTCMLTAI",
    type: "website",
    images: [{ url: "https://btcmltai.com/assets/images/products/silver-package.png", width: 1254, height: 1254, alt: "Silver | Coming Soon | BTCMLTAI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silver | Coming Soon | BTCMLTAI",
    description: "Silver is coming soon. Join the early list for launch updates from BTCMLTAI.",
    images: ["https://btcmltai.com/assets/images/products/silver-package.png"],
  },
};

export default function Page() {
  return <ProductDetail slug="ict-silver-bullet-ea-mt4" />;
}
