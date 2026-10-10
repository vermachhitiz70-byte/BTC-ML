export const PRODUCT_CONTENT = {
  'btc-mlt-ai': {
    name: 'BTC MLT AI',
    comingSoon: false,
    desc: 'BTC MLT AI is an Expert Advisor (EA) for automated trading on BTCUSD, built for the MetaTrader 5 (MT5) platform. It combines trend filtering (ADX) with volatility measurement (ATR) to recognise strong market phases, opens positions when its rule set is satisfied, and manages them with dynamic lot scaling and trailing-stop exits. Optimised setup files for conservative and standard risk profiles are included with delivery.',
    whyTitle: 'Why Use BTC MLT AI?',
    why: [
      'Rule-based entries remove emotional, manual trading decisions.',
      'ADX trend and ATR volatility filters keep entries structured in fast crypto markets.',
      'Full automation across the always-open BTCUSD market, weekends included.',
      'Dynamic lot scaling adjusts position size automatically to the account balance.',
      'Trailing-stop exits lock in gains as trends extend — no fixed target required.',
    ],
    features: [
      'Advanced trend and volatility filters (ADX and ATR) so trades align with strong market phases.',
      'Dynamic lot scaling — position sizes adjust automatically to the account balance.',
      'Multi-position trade handling that stacks positions through extended trends.',
      'Trailing-stop profit protection that secures gains dynamically as price moves favourably.',
      'Sideways-market filter that skips low-quality ranging conditions.',
      '24/7 crypto compatibility for always-open BTCUSD trading, weekends included.',
    ],
    usage: [
      'Install the EA file into the MT5 Experts folder, load one of the included .set files, and restart the terminal.',
      'Attach BTC MLT AI to a BTCUSD chart (M5 to H1), align the GMT offset with your broker time, and allow automated trading.',
      'Start with the conservative setfile and validate everything on a demo account first.',
      'Never trade with funds you cannot afford to lose.',
    ],
    settings: {
      groups: [
        {
          title: 'EA identification',
          rows: [
            { k: 'Magic Number', v: '111111 — unique identifier that keeps EA trades separate from manual trades or other EAs.' },
          ],
          note: '',
        },
        {
          title: 'Trend and volatility filters',
          rows: [
            { k: 'Sideway Filter', v: 'Enabled — skips ranging markets.' },
            { k: 'ADX Threshold', v: '20.0 — trades only when trend strength reads 20 or higher.' },
            { k: 'ATR Threshold', v: '0.001 — skips low-volatility phases.' },
          ],
          note: 'Combined filters raise entry quality: ADX confirms a strong trend while ATR confirms there is enough movement to trade.',
        },
        {
          title: 'Order settings',
          rows: [
            { k: 'Take Profit', v: '100000 — intentionally very large, so there is effectively no fixed target.' },
            { k: 'Stop Loss', v: '50000 — wide protective stop.' },
            { k: 'Slippage', v: '10 — maximum accepted price deviation.' },
            { k: 'Alerts', v: 'Disabled — no terminal notifications.' },
            { k: 'OCO Mode', v: 'Disabled — no one-cancels-other logic.' },
            { k: 'Min Distance Same Direction', v: '0 — positions may stack without spacing.' },
          ],
          note: 'With no fixed target and no spacing rule, exits depend on the trailing stop and positions can stack aggressively — use the conservative setfile to tame this.',
        },
        {
          title: 'Lot size settings',
          rows: [
            { k: 'Fixed Lot Mode', v: 'Disabled — lot size scales dynamically.' },
            { k: 'Fixed Lot Size', v: '0.01 — inactive while dynamic mode is on.' },
            { k: 'Lot per $100', v: '0.01 — scaling factor applied to the balance.' },
            { k: 'Max Lot Limit', v: '100 — very high ceiling; lower it for safety.' },
            { k: 'Margin Percentage', v: '100% — full margin use permitted.' },
          ],
          note: 'Dynamic scaling compounds quickly on crypto — 0.01 lot per $100 is aggressive. Halve it for calmer growth.',
        },
        {
          title: 'Position management',
          rows: [
            { k: 'Max Open Positions', v: '99 — very high ceiling; lower it for safety.' },
            { k: 'Force Min Volume', v: 'Enabled — always respects the broker minimum lot.' },
            { k: 'Min Candle Gap', v: '1 — minimal spacing between entries.' },
            { k: 'Balance Threshold', v: '1.0 — balance trigger for scaling steps.' },
          ],
          note: 'Up to 99 simultaneous positions with a 1-candle gap means high trade frequency — cap positions at 5–10 for controlled exposure.',
        },
        {
          title: 'Weekend and time filter',
          rows: [
            { k: 'Disable Weekend Trading', v: 'No — crypto trades through the weekend.' },
            { k: 'GMT Offset', v: '2 — align this with your broker server time.' },
          ],
          note: 'Crypto runs 24/7, so weekend trading is supported — expect thinner, more volatile moves.',
        },
        {
          title: 'Trailing stop',
          rows: [
            { k: 'Trailing Stop', v: 'Enabled — the main profit-locking mechanism.' },
          ],
          note: 'Because the take profit is effectively disabled, the trailing stop is what secures gains as trends extend.',
        },
      ],
      advice: [
        { title: 'For safer trading', items: ['Reduce Max Open Positions to 5–10.', 'Reduce Max Lot Limit to 1–5.', 'Add a fixed take profit of 1000–3000 points.', 'Lower the stop loss to 2000–5000 points.'] },
        { title: 'For balanced growth', items: ['Keep the trailing stop enabled.', 'Soften lot scaling to 0.005 per $100.', 'Require spacing between entries of at least 200 points.'] },
      ],
    },
    faqs: [
      { q: 'What is BTC MLT AI and how does it work?', a: 'BTC MLT AI is an automated Expert Advisor for BTCUSD on MetaTrader 5. It uses ADX trend and ATR volatility filters to recognise strong market phases, then opens and manages positions by fixed rules with dynamic lot sizing and trailing-stop exits.' },
      { q: 'Is BTC MLT AI suitable for beginners?', a: 'Yes, with basic preparation. Because the default settings are aggressive, beginners should learn position sizing first, load the conservative setfile, and validate on a demo account before any live use.' },
      { q: 'What trading strategy does it use?', a: 'A trend-following strategy with volatility confirmation and multi-position scaling: ADX confirms trend strength, ATR confirms movement, and the EA stacks positions through extended trends, exiting via trailing stop instead of a fixed target.' },
      { q: 'Does it use grid or martingale?', a: 'No classic martingale. However, its multi-position stacking can concentrate exposure like grid trading, so cap Max Open Positions at 5–10 to keep risk controlled.' },
      { q: 'How does it manage risk?', a: 'Through dynamic lot sizing, trailing-stop exits and technical entry filters. There is no hard drawdown cap by default, so set your own limits: lower max positions, cap max lot, and add a fixed stop loss.' },
      { q: 'Why is there no fixed take profit?', a: 'The take profit is set very large by design. Instead of a fixed exit level, the trailing stop locks in profit progressively as the trend extends.' },
      { q: 'What are the main risks?', a: 'Wide stop loss, high position counts and dynamic scaling can produce deep drawdowns in choppy markets. Use the conservative setfile, test on demo, and never trade funds you cannot afford to lose.' },
      { q: 'Can it open many positions at once?', a: 'Yes — the default ceiling is 99 simultaneous positions, which is very aggressive. Reduce it to 5–10 for controlled exposure.' },
      { q: 'Which markets, timeframes and platform does it need?', a: 'BTCUSD on MetaTrader 5, timeframes M5 to H1. Crypto trades 24/7 including weekends; the default GMT offset is +2 — align it with your broker server time.' },
      { q: 'What is the minimum deposit and leverage?', a: 'A $100 minimum deposit is suggested with leverage of 1:20 or higher on a hedging account. Larger balances handle the default scaling more comfortably.' },
      { q: 'How do I install it?', a: 'Copy the EA file into the MT5 Experts folder, load an included .set file, attach it to a BTCUSD chart and allow automated trading. Step-by-step installation guidance is included, and support replies within 2–3 hours.' },
      { q: 'Are any results guaranteed?', a: 'No. Past performance never guarantees future results. Always test on demo first and never trade with funds you cannot afford to lose.' },
    ],
    specs: [
      { k: 'Trading platform', v: 'MetaTrader 5 (MT5)' },
      { k: 'Timeframes', v: 'M5, M15, M30, H1' },
      { k: 'Instrument', v: 'BTCUSD (Bitcoin)' },
      { k: 'Minimum / recommended deposit', v: '$100' },
      { k: 'Leverage', v: '1:20 or higher, hedging account' },
      { k: 'Setup files', v: 'Included (conservative + standard)' },
      { k: 'Licence type', v: 'Single account, digital delivery' },
      { k: 'Delivery', v: 'Instant digital delivery + installation guidance' },
    ],
  },
  'currency': {
    name: 'Currency',
    comingSoon: false,
    desc: 'Currency is a multi-currency Expert Advisor for MetaTrader 5 (MT5) that trades 8 Forex pairs from a single setup. It is built around prop-firm style risk rules: automatic lot sizing, a spread filter, a configurable daily trading schedule, drawdown protection that can flatten all positions at your threshold, and trailing management for open gains. Optimised setfiles are included with delivery.',
    whyTitle: 'Why Use Currency?',
    why: [
      'One EA covers 8 Forex pairs from a single chart setup.',
      'Automatic lot sizing matched to your risk framework.',
      'Spread filter skips entries when transaction costs are unfavourable.',
      'Drawdown protection can close all positions at your threshold — built for challenge rules.',
      'Full automation with round-the-clock monitoring and a configurable daily schedule.',
    ],
    features: [
      'Multi-currency system across 8 Forex pairs from a single EA.',
      'Automatic money management that sizes positions to the account and risk framework.',
      'Spread protection that filters entries when market spread is unfavourable.',
      'Drawdown protection with an automatic mechanism that closes positions at the threshold.',
      'Flexible lot control: minimum, maximum, fixed and automatic position sizing.',
      'Configurable Take Profit and Stop Loss multipliers.',
      'Trailing management that protects gains after the required movement.',
      'Trading schedule with Friday control for session-based operation.',
    ],
    usage: [
      'Install the EA file into the MT5 Experts folder, load the included .set file, and restart the terminal.',
      'Attach Currency to an H1 chart, confirm the pair list, magic number and broker time settings, and allow automated trading.',
      'Configure risk, lot caps, spread cap and the drawdown threshold to your own or your prop-firm rules, then validate on a demo or challenge account.',
      'Never trade with funds you cannot afford to lose.',
    ],
    settings: {
      groups: [
        {
          title: 'General EA settings',
          rows: [
            { k: 'Magic Number', v: '71823 — unique identifier so MT5 tracks only this EA’s trades.' },
            { k: 'Pairs', v: 'NZDCAD, EURCAD, USDCHF, AUDUSD, CADJPY, EURCHF, EURJPY, GBPNZD — the 8 configured pairs.' },
            { k: 'Suffix / Prefix', v: 'Blank — no extra broker symbol affixes configured.' },
          ],
          note: 'If your broker adds a suffix to symbols (for example EURUSDm), fill it in or pairs will not be recognised.',
        },
        {
          title: 'Money management',
          rows: [
            { k: 'Auto Lot', v: 'true — position size is calculated automatically.' },
            { k: 'Risk', v: '1.0 — auto-sizing parameter; confirm from the EA documentation whether this means 1.0% account risk or another internal unit.' },
            { k: 'Fixed Lot', v: '0.1 — fixed-lot reference value in the configuration.' },
            { k: 'Min Lot', v: '0.05 — minimum permitted volume.' },
            { k: 'Max Lot', v: '60.0 — very high ceiling; cap it far lower for safety.' },
          ],
          note: '60 lots is far above the 0.05 minimum — make sure the automatic calculation cannot produce exposure your account cannot carry.',
        },
        {
          title: 'Take profit and stop loss',
          rows: [
            { k: 'TP Multiplier', v: '1.0 — base take-profit calculation unchanged.' },
            { k: 'SL Multiplier', v: '1.0 — base stop-loss calculation unchanged.' },
          ],
          note: 'Multipliers scale the EA’s internal levels — raise or lower them to match your risk plan.',
        },
        {
          title: 'Spread filter',
          rows: [
            { k: 'Max Spread in Points', v: '140.0 — no new trades while spread is above this.' },
          ],
          note: 'Compare 140 points against your broker’s typical spreads on all 8 pairs before going live.',
        },
        {
          title: 'Trading schedule',
          rows: [
            { k: 'Trading Start Time', v: '00:01 — daily window opens just after midnight.' },
            { k: 'Trading End Time', v: '23:59 — almost full-day coverage.' },
            { k: 'Trade on Fridays', v: 'true — Friday trading enabled.' },
            { k: 'One Order Per Pair', v: 'false — multiple simultaneous orders per pair allowed.' },
          ],
          note: 'Nearly round-the-clock trading with stacking permitted — combine with the lot caps and drawdown guard.',
        },
        {
          title: 'Prop-firm protection',
          rows: [
            { k: 'FTMO Randomizer', v: 'false — execution randomisation disabled.' },
            { k: 'Max Drawdown to Close All', v: '80.0 — flattens everything at this level; 0 disables it. Confirm the exact unit before relying on it as a firm limit.' },
          ],
          note: 'Verify what 80.0 means (percent, points or internal units) against your prop-firm daily and total limits.',
        },
        {
          title: 'Trailing management',
          rows: [
            { k: 'Trailing Distance', v: '0 — distance-based trailing is disabled (0 = disable).' },
            { k: 'Start Trailing After', v: '20 pips — activation threshold once trailing conditions are met.' },
          ],
          note: 'With distance at 0, only the 20-pip activation threshold is configured — enable a distance to use trailing exits.',
        },
      ],
      advice: [
        { title: 'For safer trading', items: ['Cap Max Lot at 1–5 lots regardless of auto sizing.', 'Set Max Spread below your broker’s typical peak spreads.', 'Confirm the drawdown unit, then set it inside your firm’s limits.', 'Validate on a demo or challenge account first.'] },
        { title: 'For balanced growth', items: ['Keep auto lot enabled with a verified Risk value.', 'Keep drawdown protection switched on at all times.', 'Trade liquid hours through the daily schedule.', 'Allow Friday trading only if spreads stay normal.'] },
      ],
    },
    faqs: [
      { q: 'What is Currency and how does it work?', a: 'Currency is a multi-currency Expert Advisor for MetaTrader 5. From one setup it trades 8 Forex pairs using automatic lot sizing, a spread filter, a daily schedule, drawdown protection and trailing management.' },
      { q: 'Which currency pairs and timeframe does it use?', a: 'NZDCAD, EURCAD, USDCHF, AUDUSD, CADJPY, EURCHF, EURJPY and GBPNZD on the H1 timeframe.' },
      { q: 'How does lot sizing work?', a: 'Auto Lot is enabled with Risk set to 1.0, inside a 0.05 minimum and 60.0 maximum range, with a 0.1 fixed-lot reference. Confirm what Risk 1.0 means in the documentation, and cap Max Lot for safety.' },
      { q: 'What spread protection is included?', a: 'A 140-point maximum spread cap blocks new entries while transaction costs are too high. Check it against your broker’s typical spreads.' },
      { q: 'Does it have drawdown protection?', a: 'Yes — it can close all positions when drawdown reaches 80.0 (0 disables it). Confirm the exact unit and keep it inside your prop-firm daily and total limits.' },
      { q: 'Is the trailing stop enabled?', a: 'The trailing distance is 0, which means distance-based trailing is off, while the 20-pip activation threshold is configured. Set a distance to use trailing exits.' },
      { q: 'Can it hold multiple orders per pair?', a: 'Yes — it is not restricted to one order per pair, so exposure can stack. Use the lot caps and drawdown guard to control it.' },
      { q: 'What is the minimum deposit?', a: 'A $200 minimum deposit is suggested, though prop-firm requirements may differ.' },
      { q: 'Can individuals use it outside prop firms?', a: 'Yes. Individual traders can use it on personal accounts with the same risk controls.' },
      { q: 'Is any trading system risk-free?', a: 'No. Always test on demo first and never trade with funds you cannot afford to lose.' },
    ],
    specs: [
      { k: 'Trading platform', v: 'MetaTrader 5 (MT5)' },
      { k: 'Minimum / recommended deposit', v: '$200' },
      { k: 'Timeframe', v: 'H1 (60 minute chart)' },
      { k: 'Currency pairs', v: 'NZDCAD, EURCAD, USDCHF, AUDUSD, CADJPY, EURCHF, EURJPY, GBPNZD' },
      { k: 'Setup files', v: 'Included' },
      { k: 'Licence type', v: 'Single account, digital delivery' },
      { k: 'Delivery', v: 'Instant digital delivery + installation guidance' },
    ],
  },
  'ict-silver-bullet-ea-mt4': {
    name: 'Silver',
    comingSoon: true,
    desc: 'Silver is the upcoming release from BTCMLTAI and is currently in final testing. It is planned as a focused Expert Advisor with a disciplined, low-frequency trading style, structured entries, and predefined risk controls on every position.',
    whyTitle: 'Why Watch Silver?',
    why: [
      'A disciplined system designed for controlled exposure.',
      'Structured entries with predefined risk controls.',
      'Full BTCMLTAI digital delivery with installation guidance at launch.',
    ],
    statusNote: 'Silver is not available for order yet. Price and final specifications will be announced at launch. Share your details through Notify Me and our team will contact you within 2 to 3 hours of launch updates.',
    usage: null,
    faqs: [
      { q: 'When does Silver launch?', a: 'Final testing is underway. Join the early list to be notified first.' },
      { q: 'What will the price be?', a: 'Pricing will be announced at launch.' },
      { q: 'How will I get notified?', a: 'Use Notify Me on this page with your name, email and phone number.' },
    ],
    specs: [
      { k: 'Status', v: 'Coming soon — in final testing' },
      { k: 'Platform', v: 'To be announced at launch' },
      { k: 'Instruments', v: 'To be announced at launch' },
      { k: 'Delivery', v: 'Digital delivery at launch' },
    ],
  },
};

export const PRODUCT_ORDER = ['btc-mlt-ai', 'currency', 'ict-silver-bullet-ea-mt4'];

