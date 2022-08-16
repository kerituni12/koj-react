import { createContext, useState } from 'react';

export const LoginContext = createContext({});

export function LoginRequiredProvider({ children }) {
  const [isLoginRequired, setIsLoginRequired] = useState(false);
  console.log(
    '🚀 ~ file: login.context.js ~ line 7 ~ LoginRequiredProvider ~ setIsLoginRequired',
    setIsLoginRequired
  );
  console.log(
    '🚀 ~ file: login.context.js ~ line 7 ~ LoginRequiredProvider ~ isLoginRequired',
    isLoginRequired
  );

  return (
    <LoginContext.Provider value={{ isLoginRequired, setIsLoginRequired }}>
      {children}
    </LoginContext.Provider>
  );
}
