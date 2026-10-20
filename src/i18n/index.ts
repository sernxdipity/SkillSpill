import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './locales/en';
import { bm } from './locales/bm';
import { zh } from './locales/zh';
import { ta } from './locales/ta';

export const LANGUAGE_STORAGE_KEY = 'skillspill_user_language';

export const SUPPORTED_LANGUAGES = [
  { code: 'EN', name: 'English (US)', flag: '🇺🇸' },
  { code: 'BM', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'ZH', name: '中文 (简体)', flag: '🇨🇳' },
  { code: 'TA', name: 'தமிழ்', flag: '🇮🇳' },
];

export const getSavedLanguage = (): string => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved.toUpperCase())) {
      return saved.toUpperCase();
    }
  } catch {
    // ignore local storage errors
  }
  return 'EN';
};

export const setSavedLanguage = (lang: string) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang.toUpperCase());
  } catch {
    // ignore
  }
};

const resources = {
  EN: { translation: en },
  BM: { translation: bm },
  ZH: { translation: zh },
  TA: { translation: ta },
  // aliases for standard ISO tags
  en: { translation: en },
  bm: { translation: bm },
  ms: { translation: bm },
  zh: { translation: zh },
  ta: { translation: ta },
};

const initialLang = getSavedLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'EN',
    interpolation: {
      escapeValue: false, // react already protects from xss
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
