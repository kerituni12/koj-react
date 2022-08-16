import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { setUser } from '@/modules/user/user.slice';
import axios from '@/services/axios';
import {
  ACCESS_PAYLOAD_KEY,
  BASE_API_PREFIX,
  BASE_API_URL,
  REFRESH_PAYLOAD_KEY,
} from '@/constants/default-value';

const handleLoginSuccess = (data, dispatch) => {
  localStorage.setItem(ACCESS_PAYLOAD_KEY, data.accessTokenPayload);
  localStorage.setItem(REFRESH_PAYLOAD_KEY, data.refreshTokenPayload);

  dispatch(setUser({ ...data, permissions: new Set(data.permissions) }));
};

export const login = createAsyncThunk(
  'login',
  async ({ email, password }, { dispatch }) => {
    try {
      const url = `${BASE_API_URL}/${BASE_API_PREFIX}/auth/login`;
      const { data } = await axios.post(url, { email, password });
      handleLoginSuccess(data, dispatch);
      return { data };
    } catch (error) {
      return { error };
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'loginWithGoogle',
  async (payload, { dispatch }) => {
    try {
      const url = `${BASE_API_URL}/${BASE_API_PREFIX}/auth/google`;
      const { data } = await axios.post(url, payload);
      handleLoginSuccess(data, dispatch);
      return { data };
    } catch (error) {
      return { error };
    }
  }
);

export const loginWithGithub = createAsyncThunk(
  'loginWithGoogle',
  async (payload, { dispatch }) => {
    try {
      const url = `${BASE_API_URL}/${BASE_API_PREFIX}/auth/github/callback?code=${payload.code}`;
      const { data } = await axios.get(url);
      handleLoginSuccess(data, dispatch);
      return { data };
    } catch (error) {
      return { error };
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
    },
    authSuccess: (state) => {
      state.isAuthenticated = true;
    },
  },
});

export const logout = createAsyncThunk('logout', async (data, { dispatch }) => {
  dispatch(logoutSuccess());
  return true;
});

export const { logoutSuccess, authSuccess } = authSlice.actions;

export default authSlice.reducer;
