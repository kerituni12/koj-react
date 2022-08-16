import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// import LazyImportPlugin from './lazyimportlocale';

i18n
  // .use(LazyImportPlugin)
  .use(LanguageDetector)
  .use(Backend)

  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  .init({
    // fallbackLng: false, //avoid twice request call locale
    fallbackLng: ['en'],
    debug: process.env.NODE_ENV === 'development',
    defaultNS: 'common',
    ns: ['common'],
    backend: {
      loadPath: `${process.env.PUBLIC_URL}/assets/locales/{{lng}}/{{ns}}.json`,
    },
    saveMissing: true, // for missing key handler to fire
    missingKeyHandler: function (lng, ns, key, fallbackValue) {
      console.log(key);
    },
    react: {
      // useSuspense: false,
    },
    load: 'languageOnly',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
