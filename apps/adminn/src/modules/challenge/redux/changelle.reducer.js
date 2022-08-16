import { combineReducers } from '@reduxjs/toolkit';

import challengeReducer from './challenge.slice';

const reducer = combineReducers({
  challenge: challengeReducer,
});

export default reducer;
