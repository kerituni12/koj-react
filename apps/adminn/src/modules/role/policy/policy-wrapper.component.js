import React from 'react';
import { useImmerReducer } from 'use-immer';
import { policyInitialState, policyReducer } from './policy.reducer';

export const PolicyContext = React.createContext({});

function PolicyProvider({ children }) {
  const [policyState, dispatch] = useImmerReducer(
    policyReducer,
    policyInitialState
  );
  const providerState = { policyState, dispatch };

  return (
    <PolicyContext.Provider value={providerState}>
      {children}
    </PolicyContext.Provider>
  );
}

function withPolicy(Component) {
  const [policyState, dispatch] = useImmerReducer(
    policyReducer,
    policyInitialState
  );
  const providerState = { policyState, dispatch };

  return function PolicyWrapper(props) {
    <PolicyContext.Provider value={providerState}>
      <Component {...props} />
    </PolicyContext.Provider>;
  };
}

export default withPolicy;
