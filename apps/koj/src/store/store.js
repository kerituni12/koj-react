import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';

import createReducer from './root-reducer';
import persistStore from 'redux-persist/es/persistStore';

const persistConfig = {
  key: 'root',
  keyPrefix: '@koj/',
  storage,
};

const persistedReducer = persistReducer(persistConfig, createReducer());

const store = configureStore({
  reducer: persistedReducer,
  devTools:
    process.env.NODE_ENV === 'development'
      ? { serialize: { options: { set: true } } }
      : { serialize: { options: { set: true } } },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./root-reducer', () => {
    store.replaceReducer(createReducer());
  });
}

store.asyncReducers = {};
store.persistor = persistStore(store);

export function injectReducer(key, reducer) {
  if (store.asyncReducers[key]) {
    return false;
  }
  store.asyncReducers[key] = reducer;
  store.replaceReducer(createReducer(store.asyncReducers));
  return store;
}

export default store;
