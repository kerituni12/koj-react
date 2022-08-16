import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from '@/services/axios';
import { resetUser, setUser } from '@/modules/user/user.slice';

import {
  BASE_API_URL,
  BASE_API_PREFIX,
  ACCESS_PAYLOAD_KEY,
  REFRESH_PAYLOAD_KEY,
} from '@/constants/default-value';

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

export const { logoutSuccess, authSuccess } = authSlice.actions;

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

export const logout = createAsyncThunk('logout', async (data, { dispatch }) => {
  localStorage.removeItem(ACCESS_PAYLOAD_KEY);
  localStorage.removeItem(REFRESH_PAYLOAD_KEY);

  dispatch(resetUser());
  return true;
});

export default authSlice.reducer;
