import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import LazyImportPlugin from './lazyimportlocale';

i18n
  .use(LazyImportPlugin)

  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)

  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  // .use(Backend)

  // pass the i18n instance to react-i18next.
  .use(initReactI18next)

  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: false, //avoid twice request call locale
    debug: process.env.NODE_ENV === 'development',
    defaultNS: 'common',
    ns: ['common'],
    // backend: {
    //   loadPath: `${process.env.PUBLIC_URL}/assets/locales/{{lng}}/{{ns}}.json`,
    // },
    saveMissing: true, // for missing key handler to fire
    missingKeyHandler: function (lng, ns, key, fallbackValue) {
      console.log(key);
    },
    react: {
      useSuspense: false,
    },
    load: 'languageOnly',
    // special options for react-i18next
    // learn more: https://react.i18next.com/components/i18next-instance
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
