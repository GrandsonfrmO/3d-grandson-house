// Configuration de devise - Franc Guinéen (GNF)
export const CURRENCY = {
  code: 'GNF',
  symbol: 'FG',
  name: 'Franc Guinéen',
  locale: 'fr-GN',
  decimalPlaces: 0, // GNF n'utilise généralement pas de décimales
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: CURRENCY.decimalPlaces,
    maximumFractionDigits: CURRENCY.decimalPlaces,
  }).format(amount);
};

export const formatPrice = (amount: number): string => {
  // Format: "1 000 FG" (avec espace comme séparateur de milliers)
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} ${CURRENCY.symbol}`;
};

export const parseCurrency = (value: string): number => {
  // Enlever le symbole et les espaces, puis convertir en nombre
  return parseInt(value.replace(/[^\d]/g, ''), 10);
};
