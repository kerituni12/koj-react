import { genCppPlaceholder } from '../placeholder/cplusplus.placeholder';
import { getJavascriptPlaceholder } from '../placeholder/javascript.placeholder';
import { genPythonPlaceholder } from '../placeholder/python.placehoder';
import {
  cppDefaultValue,
  defaultSolution,
  javascriptDefaultValue,
} from './placeholder.config';

export const defaultLanguages = [
  {
    name: 'C++',
    id: 'cplusplus',
    timeout: 2,
    extension: 'cpp',
    genPlaceholder: genCppPlaceholder,
    files: [
      {
        name: 'main.cpp',
        type: 'main',
        content: cppDefaultValue,
        closable: false,
      },
      {
        name: 'solution.cpp',
        type: 'solution',
        content: defaultSolution,
        closable: false,
      },
    ],
  },
  {
    name: 'Javascript',
    id: 'javascript',
    timeout: 2,
    extension: 'js',
    genPlaceholder: getJavascriptPlaceholder,
    files: [
      {
        name: 'main.js',
        type: 'main',
        content: javascriptDefaultValue,
        closable: false,
      },
      {
        name: 'solution.js',
        type: 'solution',
        content: defaultSolution,
        closable: false,
      },
    ],
  },
  {
    name: 'Python',
    id: 'python',
    timeout: 2,
    extension: 'py',
    genPlaceholder: genPythonPlaceholder,
    files: [
      {
        name: 'main.py',
        type: 'main',
        content: javascriptDefaultValue,
        closable: false,
      },
      {
        name: 'solution.py',
        type: 'solution',
        content: defaultSolution,
        closable: false,
      },
    ],
  },
  {
    name: 'Java',
    id: 'java',
    timeout: 2,
    extension: 'java',
    genPlaceholder: genCppPlaceholder,
    files: [
      {
        name: 'main.java',
        type: 'main',
        content: javascriptDefaultValue,
        closable: false,
      },
      {
        name: 'solution.java',
        type: 'solution',
        content: defaultSolution,
        closable: false,
      },
    ],
  },
  {
    name: 'Golang',
    id: 'golang',
    timeout: 2,
    extension: 'go',
    genPlaceholder: genCppPlaceholder,
    files: [
      {
        name: 'main.go',
        type: 'main',
        content: javascriptDefaultValue,
        closable: false,
      },
      {
        name: 'solution.go',
        type: 'solution',
        content: defaultSolution,
        closable: false,
      },
    ],
  },
];

export const defaultLanguageOptions = defaultLanguages.map(({ id, name }) => ({
  value: id,
  label: name,
}));
