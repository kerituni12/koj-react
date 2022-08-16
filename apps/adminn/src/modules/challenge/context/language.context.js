import { createContext } from 'react';

export const LanguageContext = createContext({
  languages: [],
  setLanguages: () => {},
});
