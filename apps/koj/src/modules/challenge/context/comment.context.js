import { createContext, useState } from 'react';

export const CommentContext = createContext({
  // comments: [],
  // setComments: () => {},
});

export function CommentProvider({ children }) {
  const [comments, setComments] = useState();

  return (
    <CommentContext.Provider value={{ comments, setComments }}>
      {children}
    </CommentContext.Provider>
  );
}
