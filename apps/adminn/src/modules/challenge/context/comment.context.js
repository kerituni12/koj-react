import { createContext } from 'react';

export const CommentContext = createContext({
  comments: [],
  setComments: () => {},
});
