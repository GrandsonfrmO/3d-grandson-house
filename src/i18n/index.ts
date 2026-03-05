// Système de localisation centralisé
import { translations } from './translations';
import { formatCurrency, formatPrice, parseCurrency, CURRENCY } from './currency';

export const i18n = {
  // Langue actuelle (français)
  currentLanguage: 'fr' as const,
  
  // Obtenir une traduction
  t: (path: string, defaultValue: string = ''): string => {
    const keys = path.split('.');
    let value: any = translations.fr;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return typeof value === 'string' ? value : defaultValue;
  },
  
  // Devise
  currency: CURRENCY,
  formatCurrency,
  formatPrice,
  parseCurrency,
};

export * from './translations';
export * from './currency';
