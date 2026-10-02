import Script from 'next/script';
import BodyClass from '../../body-class';
import { BODY } from './body';

export const metadata = {
  title: "BTC MLT | Automated BTCUSD Trading Software | BTCMLTAI",
  description: "BTC MLT is an automated Expert Advisor for BTCUSD on MT5 with trend filters and structured risk controls. Price 1,500 dollars, instant digital delivery.",
  alternates: { canonical: "https://btcmltai.com/products/btc-x-ea-mt5" },
  openGraph: {
    title: "BTC MLT | Automated BTCUSD Trading Software | BTCMLTAI",
    description: "BTC MLT is an automated Expert Advisor for BTCUSD on MT5 with trend filters and structured risk controls. Price 1,500 dollars, instant digital delivery.",
    url: "https://btcmltai.com/products/btc-x-ea-mt5",
    siteName: "BTCMLTAI",
    type: "website",
    images: [{ url: "https://btcmltai.com/assets/images/products/btcml.png", width: 1254, height: 1254, alt: "BTC MLT | Automated BTCUSD Trading Software | BTCMLTAI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTC MLT | Automated BTCUSD Trading Software | BTCMLTAI",
    description: "BTC MLT is an automated Expert Advisor for BTCUSD on MT5 with trend filters and structured risk controls. Price 1,500 dollars, instant digital delivery.",
    images: ["https://btcmltai.com/assets/images/products/btcml.png"],
  },
};

export default function Page() {
  return (
    <>
      
      
      
      <link rel="icon" href="/assets/images/btcmlai-logo.png" type="image/png" />
      <link rel="shortcut icon" href="/assets/images/btcmlai-logo.png" />
      <link rel="apple-touch-icon" href="/assets/images/btcmlai-logo.png" />
      <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/assets/css/font-awesome.css" />
      <link rel="stylesheet" href="/assets/css/fontawesome-stars.css" />
      <link rel="stylesheet" href="/assets/css/ion-fonts.css" />
      <link rel="stylesheet" href="/assets/css/slick.css" />
      <link rel="stylesheet" href="/assets/css/animate.css" />
      <link rel="stylesheet" href="/assets/css/jquery-ui.min.css" />
      <link rel="stylesheet" href="/assets/css/venobox.css" />
      <link rel="stylesheet" href="/assets/css/nice-select.css" />
      <link rel="stylesheet" href="/assets/css/timecircles.css" />
      <link rel="stylesheet" href="/assets/css/style.css" />
      <link rel="stylesheet" href="/assets/css/styletwo.css" />
      <style dangerouslySetInnerHTML={{ __html: "\n        html,\n        body {\n            background: #f6eddc !important;\n            background-color: #f6eddc !important;\n            color: #0a2c46;\n        }\n\n        .wrapper,\n        .main-wrapper,\n        .page-content,\n        .site-content,\n        .main-content,\n        main,\n        #main,\n        .content {\n            background-color: transparent;\n        }\n\n        #preloader,\n        .preloader,\n        .page-loader,\n        .loader,\n        .loading-overlay {\n            background:\n                linear-gradient(135deg, #0e3a5c 0%, #0a2c46 52%, #071f38 100%) !important;\n            background-color: #0a2c46 !important;\n        }\n    " }} />
      <link rel="stylesheet" href="/assets/css/theme-teal.css?v=2" />
      <BodyClass cls="template-color-1" />
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: BODY }} />
      <link rel="stylesheet" href="/assets/css/fb-product-detail.css?v=2" />
      <link rel="stylesheet" href="/assets/css/fb-strip-float-v24.css" />
      <link rel="stylesheet" href="/assets/css/fb-chatbot.css?v=1" />
      <script src="/assets/js/fb-chatbot.js?v=3" defer></script>
      <div id="fb-chat-root" suppressHydrationWarning />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@type\":\"Organization\",\"@id\":\"https://btcmltai.com#organization\",\"name\":\"BTCMLTAI\",\"url\":\"https://btcmltai.com\",\"logo\":{\"@type\":\"ImageObject\",\"url\":\"assets/images/btcmlai-logo.png\"},\"description\":\"BTCMLTAI provides rule-based MT4 trading software, market-analysis tools, general educational video guides, digital delivery, installation guidance, and customer support. Review compatibility, licence terms, product information, and risk disclosures before purchase.\",\"contactPoint\":{\"@type\":\"ContactPoint\",\"contactType\":\"customer support\",\"availableLanguage\":[\"English\",\"Hindi\"]}}" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"@id\":\"https://btcmltai.com#website\",\"name\":\"BTCMLTAI\",\"url\":\"https://btcmltai.com\",\"description\":\"BTCMLTAI provides rule-based MT4 trading software, market-analysis tools, general educational video guides, digital delivery, installation guidance, and customer support. Review compatibility, licence terms, product information, and risk disclosures before purchase.\",\"publisher\":{\"@id\":\"https://btcmltai.com#organization\"},\"inLanguage\":\"en\"}" }} />
      <script type="module" src="https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js" />
      <Script src="/assets/js/legacy-shop.js" strategy="afterInteractive" />
    </>
  );
}

























