const javascriptDefaultValue = `function solution(){\n\t\n}`;
const cppDefaultValue = `void solution(){\n\t\n}`;
const defaultSolution = '// Solve Solution';
// const files = {
//   javascript: {
//     main: {
//       name: 'main.js',
//       defaultValue: javascriptDefaultValue,
//     },
//     solution: {
//       name: 'solution.js',
//       defaultValue: defaultSolution,
//     },
//   },
//   cpp: {
//     main: {
//       name: 'main.cpp',
//       value: cppDefaultValue,
//     },
//     solution: {
//       name: 'solution.cpp',
//       value: defaultSolution,
//     },
//   },
// };

const defaultTabFiles = {
  1: [
    {
      name: 'main',
      type: 'main',
      extension: 'cpp',
      content: cppDefaultValue,
    },
    {
      name: 'solution',
      type: 'solution',
      extension: 'cpp',
      content: defaultSolution,
    },
  ],
  2: [
    {
      name: 'main.js',
      type: 'main',
      extension: 'js',
      content: javascriptDefaultValue,
      closable: false,
    },
    {
      name: 'solution.js',
      type: 'solution',
      extension: 'js',
      content: defaultSolution,
      closable: false,
    },
  ],
  3: [
    {
      name: 'main',
      type: 'main',
      extension: 'py',
      content: javascriptDefaultValue,
      closable: false,
    },
    {
      name: 'solution',
      type: 'solution',
      extension: 'py',
      content: defaultSolution,
      closable: false,
    },
  ],
  4: [
    {
      name: 'main',
      type: 'main',
      extension: 'java',
      content: javascriptDefaultValue,
      closable: false,
    },
    {
      name: 'solution',
      type: 'solution',
      extension: 'java',
      content: defaultSolution,
      closable: false,
    },
  ],
  5: [
    {
      name: 'main',
      type: 'main',
      extension: 'go',
      content: javascriptDefaultValue,
      closable: false,
    },
    {
      name: 'solution',
      type: 'solution',
      extension: 'go',
      content: defaultSolution,
      closable: false,
    },
  ],
};

export default defaultTabFiles;
