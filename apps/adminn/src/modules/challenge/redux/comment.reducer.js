import { combineReducers } from '@reduxjs/toolkit';

import commentReducer from './comment.slice';

const reducer = combineReducers({
  comment: commentReducer,
});

export default reducer;
