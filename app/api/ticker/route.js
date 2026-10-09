/* /api/ticker — live BTC/ETH/forex prices via CoinGecko + exchangerate.host */
import { NextResponse } from 'next/server';

const COINGECKO = 'https://api.coingecko.com/api/v3/simple/price';
const FRANKFURTER = 'https://api.frankfurter.dev/v1/latest';

const SYMBOLS = {
  crypto: ['bitcoin', 'ethereum'],
  forex: [
    { pair: 'EURUSD', base: 'EUR', quote: 'USD' },
    { pair: 'GBPUSD', base: 'GBP', quote: 'USD' },
    { pair: 'USDJPY', base: 'USD', quote: 'JPY' },
    { pair: 'AUDUSD', base: 'AUD', quote: 'USD' },
    { pair: 'USDCAD', base: 'USD', quote: 'CAD' },
    { pair: 'USDCHF', base: 'USD', quote: 'CHF' },
    { pair: 'NZDUSD', base: 'NZD', quote: 'USD' },
  ],
};

async function fetchCrypto() {
  try {
    const url = `${COINGECKO}?ids=${SYMBOLS.crypto.join(',')}&vs_currencies=usd&include_24hr_change=true`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('CoinGecko ' + res.status);
    const data = await res.json();
    return SYMBOLS.crypto.map((id) => {
      const d = data[id];
      return {
        symbol: id === 'bitcoin' ? 'BTC' : 'ETH',
        price: d?.usd ?? 0,
        change24h: d?.usd_24h_change ?? 0,
      };
    });
  } catch (e) {
    console.error('[ticker] crypto fetch failed:', e.message);
    return SYMBOLS.crypto.map((id) => ({ symbol: id === 'bitcoin' ? 'BTC' : 'ETH', price: 0, change24h: 0 }));
  }
}

async function fetchForex() {
  try {
    // Frankfurter returns rates with base currency, so we need to query for each base
    // We'll use EUR as base and compute others, or just query USD as base
    const bases = [...new Set(SYMBOLS.forex.map((f) => f.base))];
    const quotes = [...new Set(SYMBOLS.forex.map((f) => f.quote))].join(',');
    
    const allRates = {};
    for (const base of bases) {
      const url = `${FRANKFURTER}?base=${base}&symbols=${quotes}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (!res.ok) continue;
      const data = await res.json();
      if (data.rates) {
        for (const [quote, rate] of Object.entries(data.rates)) {
          allRates[`${base}${quote}`] = rate;
        }
      }
    }
    return SYMBOLS.forex.map((f) => {
      const rate = allRates[`${f.base}${f.quote}`];
      return { symbol: f.pair, price: rate ?? 0, change24h: 0 };
    });
  } catch (e) {
    console.error('[ticker] forex fetch failed:', e.message);
    return SYMBOLS.forex.map((f) => ({ symbol: f.pair, price: 0, change24h: 0 }));
  }
}

export async function GET() {
  const [crypto, forex] = await Promise.all([fetchCrypto(), fetchForex()]);
  const items = [...crypto, ...forex].map((item) => ({
    symbol: item.symbol,
    price: item.price,
    change: item.change24h,
    up: item.change24h >= 0,
  }));
  return NextResponse.json({ items, ts: Date.now() });
}