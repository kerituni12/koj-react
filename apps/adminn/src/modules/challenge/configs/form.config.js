import { defaultLanguages } from './languages.config';

const defaultFormLanguages = ['c++', 'javascript', 'python'];

export const defaultFormValues = {
  challengeName: '',
  difficulty: 'easy',
  audience: 'onlyme',
  languages: defaultLanguages.filter((language) =>
    defaultFormLanguages.includes(language.name.toLowerCase())
  ),
};
