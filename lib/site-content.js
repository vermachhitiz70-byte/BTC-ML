/* ============================================================
   Static site content — the client's existing marketing copy,
   preserved verbatim from the legacy pages so nothing is lost.
   ============================================================ */

export const POSTS = [
  {
    slug: 'btc-x-ea-mt5-complete-overview',
    title: 'What Is BTC MLT AI? Complete Overview, Features & Risk Guide',
    excerpt:
      'BTC MLT AI is an automated Expert Advisor for BTCUSD on MT5, built around trend and volatility filters with structured risk controls. This guide explains what it does, how it works, and what to check before use.',
    image: '/assets/images/blogs/blog-6a77140e7a9af.jpg',
    date: 'Sep 26, 2026',
    category: 'Educational Article',
    body: [
      { t: 'p', text: 'BTC MLT AI is an Expert Advisor (EA) for automated trading on BTCUSD, built for the MetaTrader 5 (MT5) platform. It follows a rule-based approach: it reads market conditions through technical filters, opens positions when its conditions are met, and manages those positions with predefined risk controls.' },
      { t: 'p', text: 'This article is general product information from BTCMLTAI. It is not investment advice, and no software can guarantee any trading result. Crypto markets are highly volatile, and automated trading involves substantial risk.' },
      { t: 'h2', text: 'How BTC MLT AI Reads the Market' },
      { t: 'p', text: 'BTC MLT AI uses two well-known technical concepts to filter trade entries. The trend filter checks the direction of the market so the EA prefers trading with momentum rather than against it. The volatility filter measures how fast price is moving so entries are avoided during erratic spikes and thin conditions.' },
      { t: 'h2', text: 'Key Features' },
      { t: 'ul', items: [
        'Trend and volatility filters for structured entries on BTCUSD.',
        'Dynamic lot scaling that adjusts position size to the account balance.',
        'Multi-position handling across trending phases with defined limits.',
        'Trailing-stop protection that secures gains as trades move in favour.',
        'Around-the-clock compatibility for the always-open crypto market.',
      ]},
      { t: 'h2', text: 'Risk Controls and Sensible Use' },
      { t: 'p', text: 'Every feature in BTC MLT AI exists to keep risk structured: limited concurrent exposure, spread awareness, and stops on every position. Still, no filter can remove market risk. Slippage, spreads, and weekend gaps can all change outcomes versus expectations.' },
      { t: 'h2', text: 'Important Risk Notes' },
      { t: 'p', text: 'Backtests, demonstrations and descriptions never guarantee live results. Always test any EA on a demo account first, start with conservative settings, and never trade with funds you cannot afford to lose.' },
      { t: 'h2', text: 'Next Steps' },
      { t: 'p', text: 'If you want to try BTC MLT AI, read our installation and setup guide next, then review the Currency Bot Coins guide to understand multi-pair risk before going live.' },
    ],
    links: [
      { label: 'Installation & setup guide', href: '/blogs/btc-x-ea-mt5-installation-setup-guide' },
      { label: 'Currency Bot Coins guide', href: '/blogs/btc-x-ea-mt5-risk-management-guide' },
    ],
  },
  {
    slug: 'btc-x-ea-mt5-installation-setup-guide',
    title: 'How to Install BTCMLTAI Software on MT4 & MT5 (Demo First)',
    excerpt:
      'Step-by-step: how to install BTCMLTAI software on MetaTrader 4 and 5, attach it to a chart, choose starting settings, and validate on demo first.',
    image: '/assets/images/blogs/blog-6a771b80a5ce0.jpg',
    date: 'Sep 24, 2026',
    category: 'Educational Article',
    body: [
      { t: 'p', text: 'This guide walks you through installing BTCMLTAI software on MetaTrader 4 or MetaTrader 5, attaching it to a chart, and choosing safe starting settings. Take it slow: a correct installation is the foundation of everything that follows.' },
      { t: 'h2', text: 'What You Receive After Ordering' },
      { t: 'ul', items: [
        'The EA file for your platform (MT4 or MT5) by digital delivery.',
        'Basic setup notes with recommended starting settings.',
        'Installation guidance from the BTCMLTAI support team.',
      ]},
      { t: 'h2', text: 'Installation on MT5' },
      { t: 'ul', items: [
        'Open MetaTrader 5 and go to File, then Open Data Folder.',
        'Copy the EA file into the MQL5, Experts folder.',
        'Restart MT5 or refresh the Navigator panel.',
        'Drag the EA onto a BTCUSD chart and allow automated trading.',
      ]},
      { t: 'h2', text: 'Installation on MT4' },
      { t: 'ul', items: [
        'Open MetaTrader 4 and go to File, then Open Data Folder.',
        'Copy the EA file into the MQL4, Experts folder.',
        'Restart MT4 or refresh the Navigator panel.',
        'Drag the EA onto your chosen chart and allow automated trading.',
      ]},
      { t: 'h2', text: 'Validate on Demo First' },
      { t: 'p', text: 'Run the software on a demo account for at least two weeks. Watch how it behaves around news events, weekends, and high-spread periods. Only consider a live account after you understand its behaviour and risks.' },
      { t: 'h2', text: 'Important Risk Notes' },
      { t: 'p', text: 'Installation does not guarantee results. Incorrect settings, underfunded accounts, and volatile conditions can all cause losses. When in doubt, ask support before going live.' },
      { t: 'h2', text: 'Next Steps' },
      { t: 'p', text: 'New to automated trading? Start with our BTC MLT AI overview, then read the Currency Bot Coins guide to understand risk across products.' },
    ],
    links: [
      { label: 'BTC MLT AI overview', href: '/blogs/btc-x-ea-mt5-complete-overview' },
      { label: 'Currency Bot Coins guide', href: '/blogs/btc-x-ea-mt5-risk-management-guide' },
    ],
  },
  {
    slug: 'btc-x-ea-mt5-risk-management-guide',
    title: 'Currency Bot Coins: Multi-Currency Prop-Firm Trading Guide',
    excerpt:
      'Currency Bot Coins trades 8 Forex pairs on MT5 H1 with drawdown protection and automatic money management. This guide covers the basket, the risk framework, and prop-firm use.',
    image: '/assets/images/blogs/blog-6a7723004cc8b.jpg',
    date: 'Sep 22, 2026',
    category: 'Educational Article',
    body: [
      { t: 'p', text: 'Currency Bot Coins is a multi-currency Expert Advisor for MetaTrader 5, built for traders who want diversified Forex exposure from a single system. It trades 8 pairs on the H1 timeframe with automatic money management and drawdown protection.' },
      { t: 'h2', text: 'The 8-Pair Basket' },
      { t: 'p', text: 'Instead of concentrating risk on one symbol, Currency Bot Coins spreads entries across NZDCAD, EURCAD, USDCHF, AUDUSD, CADJPY, EURCHF, EURJPY and GBPNZD. Diversification smooths single-pair shocks but never removes market risk.' },
      { t: 'h2', text: 'Risk Framework' },
      { t: 'ul', items: [
        'Automatic money management sized to the account balance.',
        'Drawdown protection that closes positions at the configured threshold.',
        'Spread protection that skips entries when trading costs are unfavourable.',
        'Trailing-stop profit protection after the required movement.',
      ]},
      { t: 'h2', text: 'Prop-Firm Use' },
      { t: 'p', text: 'The controlled exposure and drawdown limits make Currency Bot Coins suitable for challenge and funded accounts where daily and total drawdown rules decide survival. Always confirm that any software complies with your specific prop-firm terms before use.' },
      { t: 'h2', text: 'Important Risk Notes' },
      { t: 'p', text: 'Correlated pairs can move together, so multi-pair systems can still face clustered losses. Test on demo, respect the drawdown settings, and never trade with funds you cannot afford to lose.' },
      { t: 'h2', text: 'Next Steps' },
      { t: 'p', text: 'Compare with our flagship BTC MLT AI overview, and watch for the upcoming Silver preview if you want launch updates.' },
    ],
    links: [
      { label: 'BTC MLT AI overview', href: '/blogs/btc-x-ea-mt5-complete-overview' },
      { label: 'Silver preview', href: '/blogs/btc-x-ea-mt5-backtest-settings-guide' },
    ],
  },
  {
    slug: 'btc-x-ea-mt5-backtest-settings-guide',
    title: 'Silver by BTCMLTAI: Launch Preview & What to Expect',
    excerpt:
      'Silver is the upcoming BTCMLTAI release, currently in final testing. This preview covers what is planned, launch updates, and how to get notified.',
    image: '/assets/images/blogs/blog-6a7726ca0bd2e.jpg',
    date: 'Sep 20, 2026',
    category: 'Educational Article',
    body: [
      { t: 'p', text: 'Silver is the upcoming release from BTCMLTAI and is currently in final testing. This page is a launch preview: what Silver is planned to be, how the launch will work, and how you can get notified the moment it is available.' },
      { t: 'h2', text: 'What Silver Is Planned to Be' },
      { t: 'ul', items: [
        'A focused Expert Advisor with a disciplined, low-frequency trading style.',
        'Structured entries with predefined risk controls on every position.',
        'Full BTCMLTAI digital delivery with installation guidance at launch.',
      ]},
      { t: 'h2', text: 'Current Status: Coming Soon' },
      { t: 'p', text: 'Silver is not available for order yet. The price and final specifications will be announced at launch. Anything you read elsewhere about Silver pricing or results before launch should be treated with caution.' },
      { t: 'h2', text: 'How to Get Notified' },
      { t: 'p', text: 'The simplest way to stay updated is the support chat on this website: share your name, email and phone number and ask to join the Silver early list. Our team will contact you within 2 to 3 hours of launch updates.' },
      { t: 'h2', text: 'Important Risk Notes' },
      { t: 'p', text: 'Pre-launch descriptions are plans, not promises. As with every trading product, test on demo first after launch and never trade with funds you cannot afford to lose.' },
      { t: 'h2', text: 'Next Steps' },
      { t: 'p', text: 'Meanwhile, explore the live range: read the BTC MLT AI overview and the installation guide so you are ready when Silver launches.' },
    ],
    links: [
      { label: 'BTC MLT AI overview', href: '/blogs/btc-x-ea-mt5-complete-overview' },
      { label: 'Installation guide', href: '/blogs/btc-x-ea-mt5-installation-setup-guide' },
    ],
  },
];

export const POST_TAGS =
  'automated trading software, expert advisor software, ea software, metatrader software, trading technology, automated software tools, metatrader ea guide, trading software education, BTCMLTAI software';

export function getPost(slug) {
  return POSTS.find((p) => p.slug === slug) || null;
}

/* ---------------- ABOUT ---------------- */
export const ABOUT = {
  hero: {
    title: 'Trading Software, Analysis Tools & Video Guides',
    text: 'BTCMLTAI provides digital trading software, market-analysis tools, general educational video guides, installation guidance, and customer support. Review product compatibility, licence terms, delivery information, and risk disclosures before purchase. Educational materials are general information only and are not personalised investment recommendations.',
    chips: ['Digital Software Provider', 'No Client Funds', 'No Guaranteed Returns'],
  },
  intro: {
    title: 'About BTCMLTAI',
    body: [
      'BTCMLTAI is a digital software brand providing trading software, market-analysis tools, general educational video guides, and installation guidance for supported platforms. Our aim is to present each product with clear information, licence terms, digital delivery details, platform compatibility, and practical setup support.',
      'Our website focuses on structured product information, responsible software use, general educational content, and customer support. Product availability, delivery, and access are subject to the applicable product terms and the laws and requirements that apply to the customer and transaction.',
    ],
  },
  provide: {
    title: 'What We Provide',
    items: [
      'Rule-based MT4 trading software and automated execution tools',
      'Market-analysis indicators and chart-support tools',
      'General educational video guides, platform tutorials, and setup guidance',
      'Digital product delivery and account-based software access',
      'Installation, configuration, and basic usage assistance',
      'Clear compatibility, licence, refund, and risk information',
    ],
  },
  approach: {
    title: 'Our Business Approach',
    body: [
      'We believe customers should receive accurate product information before purchase. Product pages explain the supported platform, intended market, delivery method, setup requirements, licence conditions, and important risk disclosures. Demo testing is recommended before any live use.',
      'BTCMLTAI provides digital software and general educational materials. We do not provide brokerage, personalised investment advisory, portfolio management, fund management, or client-account management services. We do not accept client trading funds or guarantee profit, income, loss recovery, accuracy, fixed returns, or any specific trading result.',
    ],
  },
  commitment: {
    title: 'Our Commitment',
    body: [
      'Customers independently choose their broker, account type, leverage, lot size, and risk controls. Our responsibility is to provide accurate product information, working software, clear licence and delivery terms, and responsive support.',
    ],
  },
  why: {
    title: 'Why Choose BTCMLTAI',
    items: [
      { t: 'Software Guidance', d: 'Setup notes and installation assistance so your EA runs correctly from the first session.' },
      { t: 'Analysis Tools', d: 'Indicators and chart-support tools built for structured analysis and testing.' },
      { t: 'Educational Resources', d: 'General video guides and written walkthroughs for platforms and strategy testing.' },
      { t: 'Account-Based Access', d: 'Licences tied to your account with clear, simple delivery terms.' },
      { t: 'Customer Support', d: 'Replies within 2–3 hours on compatibility, delivery and setup questions.' },
    ],
  },
};

/* ---------------- FAQS ---------------- */
export const FAQ_GROUPS = [
  {
    title: 'Quick Help',
    icon: 'sparkles',
    items: [
      { q: 'What is BTCMLTAI?', a: 'BTCMLTAI is a digital software website providing digital trading software, market-analysis tools, general educational video guides, digital delivery, installation guidance, and product support.' },
      { q: 'Is BTCMLTAI a broker or investment service?', a: 'No. BTCMLTAI does not provide brokerage, personalised investment advisory, portfolio management, fund management, or client-account management services. We do not accept or manage client trading funds.' },
      { q: 'Do BTCMLTAI products guarantee profit, accuracy, or monthly returns?', a: 'No. BTCMLTAI does not guarantee profit, income, accuracy, fixed or monthly returns, loss recovery, capital protection, or any specific trading result. Trading results can vary and losses are possible.' },
      { q: 'Are software outputs or indicator indications investment advice?', a: 'No. Depending on the product, software may display rule-based chart indications or execute predefined software logic. These outputs are software functions and are not personalised investment recommendations or instructions to buy, sell, or hold a financial product.' },
    ],
  },
  {
    title: 'Account Help',
    icon: 'shield',
    items: [
      { q: 'How do I create an account?', a: 'Select Create an account on the login page, enter your name, email, phone number and a password, then sign in. Your account lets you track orders and delivery details.' },
      { q: 'Do I need an account to buy software?', a: 'Yes. Checkout requires a signed-in account so your order, licence and delivery files are linked to you.' },
      { q: 'I forgot my password.', a: 'Contact our support team through the chat widget or the contact page. We will verify your identity and help you regain access.' },
    ],
  },
  {
    title: 'Order Support',
    icon: 'wallet',
    items: [
      { q: 'How are digital products delivered?', a: 'Instantly. After your payment is verified you receive the EA or tool files, licence details and installation guidance by email, normally within 2 to 3 hours.' },
      { q: 'How do I pay?', a: 'We accept USDT (BEP20). Send the exact amount to the wallet address shown at checkout, then submit your transaction hash and a payment screenshot.' },
      { q: 'How long does verification take?', a: 'Most orders are verified within 2 to 3 hours during support hours.' },
    ],
  },
  {
    title: 'Software Access',
    icon: 'cpu',
    items: [
      { q: 'Which platforms do you support?', a: 'Products are built for MetaTrader 4 and MetaTrader 5. Each product page states its supported platform, timeframe and instruments.' },
      { q: 'Do you offer refunds?', a: 'Refund eligibility depends on the product terms and whether the software has been delivered and used. See our Refund Policy for the current conditions.' },
      { q: 'Should I test software before live use?', a: 'Yes. Always validate any EA on a demo account first, start with conservative settings, and never trade with funds you cannot afford to lose.' },
    ],
  },
  {
    title: 'Policies & Refunds',
    icon: 'fileText',
    items: [
      { q: 'How do licences work?', a: 'Each purchase grants a single-account licence. The licence terms are stated on the product page before you order.' },
      { q: 'What does your risk disclosure cover?', a: 'Forex, CFD, leveraged and automated trading involve a high risk of financial loss. Software outputs and educational content are general information only.' },
      { q: 'Does BTCMLTAI recommend a specific broker?', a: 'No. Customers independently choose their broker, account type, leverage, lot size and risk controls.' },
    ],
  },
];

/* ---------------- LEGAL PAGES ---------------- */
export const POLICIES = {
  'terms-condition': {
    title: 'Terms & Conditions',
    intro: 'These terms govern your use of the BTCMLTAI website, digital software products, educational materials and support services.',
    sections: [
      { h: '1. Who We Are', p: ['BTCMLTAI is a digital software provider. We supply trading software, market-analysis tools, general educational materials, installation guidance and customer support to customers in supported markets. We are not a broker, fund manager or investment adviser.'] },
      { h: '2. Products and Licence', p: ['Products are licensed, not sold. Each purchase grants a single-account licence for the platform stated on the product page. Copying, redistributing, reselling or reverse-engineering the software is not permitted.', 'Software is delivered digitally. Delivery is considered complete once the files and licence details have been sent to the email address provided at checkout.'] },
      { h: '3. Pricing and Payment', p: ['Prices are shown in US dollars. We currently accept USDT (BEP20). You must send the exact amount shown at checkout and provide a valid transaction hash and payment screenshot.', 'If a payment is not received, is underpaid, or cannot be verified, the order will not be confirmed and may be cancelled.'] },
      { h: '4. Refunds', p: ['Because digital software is delivered instantly and cannot be returned, refunds are limited to cases where the software is materially not as described or is technically defective and cannot be made to work with reasonable support effort. See the Refund Policy for details.'] },
      { h: '5. Risk Disclosure', p: ['Forex, CFD, leveraged, algorithmic and automated trading involve a high risk of financial loss. Past performance and backtested results never guarantee live results.', 'We do not guarantee profit, fixed or monthly returns, loss recovery, accuracy, capital protection or any specific trading outcome. You choose your own broker, leverage, lot size and risk controls and remain responsible for every trading decision.'] },
      { h: '6. No Client Funds', p: ['We never accept, hold, manage or trade client trading funds or deposits. Payments are made directly to our published wallet address.'] },
      { h: '7. Acceptable Use', p: ['You may not use the website or software for market manipulation, signal redistribution, or any unlawful purpose, nor attempt to gain unauthorised access to the site or its APIs.'] },
      { h: '8. Intellectual Property', p: ['All software, designs, text, images and trademarks on this site belong to BTCMLTAI or its licensors. No rights are granted except the limited licence described above.'] },
      { h: '9. Limitation of Liability', p: ['To the maximum extent permitted by law, BTCMLTAI is not liable for trading losses, lost profits, data loss, or indirect damages arising from use of the website, software or educational materials.'] },
      { h: '10. Changes and Contact', p: ['We may update these terms and will publish the current version on this page. Continued use of the site or products after an update constitutes acceptance.', 'Questions about these terms can be sent to our support team via the contact page or chat widget.'] },
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    intro: 'How BTCMLTAI collects, uses and protects the information you provide when using this website.',
    sections: [
      { h: 'Information We Collect', p: ['Account information: your name, email address, phone number and password hash when you register.', 'Order information: the products you purchase, quantities, amounts, payment coin, transaction hash and any payment screenshot you submit.', 'Support information: the messages you send through the chat widget or contact form, and any lead details you submit.', 'Technical information: basic request data such as IP address, browser type and pages visited, used for security and diagnostics.'] },
      { h: 'How We Use Your Information', p: ['To create and manage your account.', 'To process, verify and deliver your orders.', 'To provide customer support and installation guidance.', 'To respond to enquiries and notify you about products you asked to hear about.', 'To maintain the security and integrity of the website.'] },
      { h: 'Payment Screenshots', p: ['Payment screenshots are stored so our team can verify a transaction. They are used only for verification, dispute handling and record keeping, and are not shared with third parties.'] },
      { h: 'Cookies', p: ['We use cookies and similar storage for essential functions: keeping you signed in, remembering your cart, and saving your support chat session. We do not use advertising cookies.'] },
      { h: 'Sharing Your Data', p: ['We do not sell or rent your personal information. Data may be processed by service providers who host the site, deliver emails or store the database, under confidentiality obligations. We may disclose information where required by law.'] },
      { h: 'Data Retention', p: ['Account and order records are retained for as long as your account is active and for a reasonable period afterwards for accounting, support and dispute purposes. Support conversations are retained while needed to resolve enquiries.'] },
      { h: 'Your Rights', p: ['You may request access to, correction of, or deletion of your personal information, and you may object to processing. Contact our support team and we will respond within a reasonable timeframe.'] },
      { h: 'Security', p: ['Passwords are stored as secure one-way hashes and never in plain text. Sessions use secure, HTTP-only cookies. No system is perfectly secure, so please choose a unique password and contact us promptly if you suspect unauthorised access.'] },
      { h: 'Children', p: ['Our services are intended for adults who are legally permitted to trade. We do not knowingly collect information from minors.'] },
      { h: 'Contact', p: ['For any privacy question or request, contact us through the contact page or the chat widget.'] },
    ],
  },
  'refund-policy': {
    title: 'Refund Policy',
    intro: 'How refunds work for BTCMLTAI digital software products, which are licensed and delivered instantly.',
    sections: [
      { h: 'Digital Delivery', p: ['Our products are digital software delivered electronically. Once the files, licence details and installation guidance have been sent, the product has been delivered and cannot be returned like a physical good.'] },
      { h: 'Refund Eligibility', p: ['A refund may be considered where:', 'The software is materially different from its product description.', 'The software is technically defective and our support team cannot resolve the issue despite reasonable effort.', 'We are unable to deliver the product to the email address provided at checkout.', 'A duplicate payment was made and the duplicate has been identified.'] },
      { h: 'Non-Refundable Situations', p: ['Refunds are not provided where:', 'Results differ from backtests, demonstrations or marketing descriptions.', 'Losses arise from market movement, incorrect settings, unsuitable leverage or lot size, or failure to follow installation guidance.', 'The licence has been used on a live account, or setup files have been accessed or shared.', 'A request is made after a significant period of use, or after the software has been resold or redistributed.'] },
      { h: 'How to Request a Refund', p: ['Contact our support team with your order code, the email address used at checkout and a description of the problem. Include screenshots or logs where relevant so we can investigate quickly.'] },
      { h: 'Verification and Timing', p: ['We verify each request against payment records and delivery logs. Approved refunds are returned to the payment address used for the purchase. Timing depends on the payment network or processor involved.'] },
      { h: 'Chargebacks', p: ['Filing a payment dispute without contacting us first can significantly delay resolution, because it prevents us from reviewing the case directly. Please contact support first so we can help.'] },
      { h: 'Changes to This Policy', p: ['We may update this policy. The version in effect at the time of your purchase applies to that order.'] },
    ],
  },
  'shipping-policy': {
    title: 'Digital Delivery Policy',
    intro: 'How BTCMLTAI delivers digital software, what you receive, and how to access your files and licence.',
    sections: [
      { h: 'No Physical Shipping', p: ['All BTCMLTAI products are delivered electronically. Nothing is shipped by post or courier, and no physical media is provided.'] },
      { h: 'What You Receive', p: ['The EA or tool file for your platform (MT4 or MT5).', 'Licence details for your account.', 'Recommended starting settings and setup notes.', 'Installation guidance and access to our support team.'] },
      { h: 'Delivery Timing', p: ['Orders are confirmed after payment verification, normally within 2 to 3 hours during support hours. Files are sent to the email address provided at checkout.'] },
      { h: 'Payment Verification', p: ['To release files we need the exact amount sent to the published wallet address, together with a valid transaction hash and a payment screenshot. Orders with incorrect or unverifiable payments are not released until resolved.'] },
      { h: 'Access and Re-delivery', p: ['If you cannot find your files, check your spam or promotions folder and search for your order code. If files are still missing, contact support and we will re-deliver them to the same address, or to a new address you confirm.'] },
      { h: 'System Requirements', p: ['Delivery does not include exchange, broker or VPS accounts. You need a compatible MetaTrader 4 or 5 installation, a funded account meeting the product requirements, and sufficient margin for your chosen lot settings.'] },
      { h: 'Download Problems', p: ['Some email providers block large or unusual attachments. If delivery fails, contact support and we will send an alternative download method or re-issue the licence.'] },
    ],
  },
};

/* ---------------- CONTACT ---------------- */
export const CONTACT_TOPICS = [
  'Product compatibility (MT4 / MT5)',
  'Order or payment verification',
  'Licence and delivery',
  'Installation and setup help',
  'Refund request',
  'Something else',
];

export const GALLERY_IMAGES = [
  '/assets/images/gallery/gallery-1.jpg',
  '/assets/images/gallery/gallery-2.jpg',
  '/assets/images/gallery/gallery-3.jpg',
  '/assets/images/gallery/gallery-4.jpg',
  '/assets/images/gallery/gallery-5.jpg',
  '/assets/images/gallery/gallery-placeholder.jpg',
];