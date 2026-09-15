export const CURRENCY_OPTIONS = ['$', '€', '£'] as const;
export type CurrencyCode = (typeof CURRENCY_OPTIONS)[number];

const FALLBACK_RATES: Record<CurrencyCode, number> = {
  '$': 1,
  '€': 0.92,
  '£': 0.79,
};

let exchangeRates: Record<CurrencyCode, number> = { ...FALLBACK_RATES };

export const CURRENCY_STORAGE_KEY = 'zavilla-currency';

export const getStoredCurrency = (): CurrencyCode => {
  if (typeof window === 'undefined') {
    return '$';
  }

  const savedCurrency = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
  return CURRENCY_OPTIONS.includes(savedCurrency as CurrencyCode)
    ? (savedCurrency as CurrencyCode)
    : '$';
};

export const setStoredCurrency = (currency: CurrencyCode) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }
};

export const setExchangeRates = (rates: Partial<Record<CurrencyCode, number>>) => {
  exchangeRates = {
    ...exchangeRates,
    ...Object.fromEntries(
      Object.entries(rates).filter(([, rate]) => typeof rate === 'number' && Number.isFinite(rate) && rate > 0),
    ),
  } as Record<CurrencyCode, number>;
};

export const convertPrice = (usdAmount: number, currency: CurrencyCode) => {
  return usdAmount * exchangeRates[currency];
};

export const formatCurrency = (usdAmount: number, currency: CurrencyCode) => {
  const converted = convertPrice(usdAmount, currency);
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  });

  return `${currency}${formatter.format(Math.round(converted))}`;
};

export const formatCompactCurrency = (usdAmount: number, currency: CurrencyCode) => {
  const converted = convertPrice(usdAmount, currency);
  const rounded = Math.round(converted);

  if (rounded >= 1_000_000) {
    return `${currency}${(rounded / 1_000_000).toFixed(1)}M`;
  }

  if (rounded >= 1_000) {
    return `${currency}${(rounded / 1_000).toFixed(0)}k`;
  }

  return `${currency}${rounded.toLocaleString()}`;
};
