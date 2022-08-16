import CryptoJS from 'crypto-js';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import createTransform from 'redux-persist/es/createTransform';

import userReducer from './user.slice';

const encryptor = createTransform(
  (inboundState, key) => {
    if (!inboundState) return inboundState;
    if (key === 'permissions') {
      const cryptedText = CryptoJS.AES.encrypt(
        JSON.stringify(Array.from(inboundState)),
        process.env.REACT_APP_UNSAFE_ENCRYPT_KEY
      );
      inboundState = cryptedText.toString();
    }
    return inboundState;
  },
  (outboundState, key) => {
    if (!outboundState) return outboundState;
    if (key === 'permissions') {
      const bytes = CryptoJS.AES.decrypt(
        outboundState,
        process.env.REACT_APP_UNSAFE_ENCRYPT_KEY
      );
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      outboundState = decrypted ? new Set(JSON.parse(decrypted)) : null;
    }
    return outboundState;
  }
);

const userPersistConfig = {
  key: 'user',
  keyPrefix: '@koj/',
  storage: storage,
  transforms: [encryptor],
};

const reducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
});

export default reducer;
