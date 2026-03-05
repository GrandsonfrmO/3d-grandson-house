import { useStore } from '../store';
import { i18n } from '../i18n';

export const useTranslation = () => {
  const language = useStore((state: any) => state.language);
  
  return {
    t: (path: string, defaultValue: string = ''): string => {
      return i18n.t(path, defaultValue);
    },
    language,
    currency: i18n.currency,
    formatPrice: i18n.formatPrice,
    formatCurrency: i18n.formatCurrency,
  };
};
