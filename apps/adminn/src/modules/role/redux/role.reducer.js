import { combineReducers } from '@reduxjs/toolkit';

import policyReducer from './policy.slice';

const reducer = combineReducers({
  policy: policyReducer,
});

export default reducer;
