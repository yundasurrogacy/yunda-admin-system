import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCN from '../public/locales/zh-CN/common.json';
import en from '../public/locales/en/common.json';

const resources = {
  'zh-CN': { common: zhCN },
  en: { common: en },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: typeof window !== 'undefined'
        ? (localStorage.getItem('i18nextLng') || 'en')
        : 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
