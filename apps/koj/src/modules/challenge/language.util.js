import { defaultLanguages } from './configs/languages.config';

export function genLanguages(languages = [], solutions = []) {
  const languagesResult = [];
  const languagesMap = new Map(
    defaultLanguages.map((language) => [language.id, language])
  );

  languages.forEach((language) => {
    if (languagesMap.has(language.id)) {
      const language$ = languagesMap.get(language.id);
      if (language.timeout) language$.timeout = language.timeout;
      if (language.description) language$.description = language.description;

      const files = [
        {
          name: `main.${language$.extension}`,
          type: 'main',
          content: language.placeholder,
          closable: false,
        },
      ];

      const iSolutions = solutions.filter(
        (solution) => solution.languageId === language.id
      );

      if (iSolutions.length) {
        files.push(...iSolutions);
      }

      languagesResult.push({ ...language$, files });
    }
  });
  return languagesResult;
}
