import { combineReducers } from '@reduxjs/toolkit';

import userReducer from '../modules/user/user.reducer';

const createReducer = (asyncReducers) =>
  combineReducers({
    user: userReducer,
    ...asyncReducers,
  });

export default createReducer;
