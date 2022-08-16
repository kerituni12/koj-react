import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './auth.slice';

const authPersistConfig = {
  key: 'auth',
  keyPrefix: '@koj/',
  storage: storage,
};

const reducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});

export default reducer;
