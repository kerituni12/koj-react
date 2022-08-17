import {
  ACCESS_PAYLOAD_KEY,
  REFRESH_PAYLOAD_KEY,
  BASE_API_PREFIX,
  BASE_API_URL,
} from '@/constants/default-value';
import { NETWORK_ERROR } from '@/constants/error-code';
import Axios from 'axios';

const axios = Axios.create({
  baseURL: `${BASE_API_URL}/${BASE_API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
    'x-domain': process.env.REACT_APP_X_DOMAIN,
  },
  withCredentials: true,
});

axios.interceptors.request.use(
  (config) => {
    config.headers[ACCESS_PAYLOAD_KEY] =
      localStorage.getItem(ACCESS_PAYLOAD_KEY);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    const errorResult = getResponseError(error);

    if (
      (error.response?.status === 401 &&
        originalConfig.url ===
          `${BASE_API_URL}/${BASE_API_PREFIX}/auth/login`) ||
      originalConfig.url === `${BASE_API_URL}/${BASE_API_PREFIX}/auth/refresh`
    ) {
      return Promise.reject(errorResult);
    }

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const refreshTokenPayload$ = localStorage.getItem('x-refresh-payload');

        if (!refreshTokenPayload$) throw new Error('Missing refresh token');

        const { accessTokenPayload, refreshTokenPayload } = await axios.get(
          `${BASE_API_URL}/${BASE_API_PREFIX}/auth/refresh`,
          {
            headers: {
              'Content-Type': 'application/json',
              [`${REFRESH_PAYLOAD_KEY}`]: refreshTokenPayload$,
            },
          }
        );
        localStorage.setItem(REFRESH_PAYLOAD_KEY, refreshTokenPayload);
        localStorage.setItem(ACCESS_PAYLOAD_KEY, accessTokenPayload);
        return axios(originalConfig);
      } catch (error) {
        const errorResult = getResponseError(error);
        return Promise.reject(errorResult);
      }
    }
    return Promise.reject(errorResult);
  }
);

export function getResponseError(error) {
  if (error.response) {
    return {
      ...error.response.data,
      statusCode: error.response?.status || error.response.data.statusCode,
    };
  }

  if (error.message === 'Network Error') {
    return {
      statusCode: 500,
      errorCode: NETWORK_ERROR,
      message: error.message,
    };
  }

  return {
    statusCode: 555,
    errorCode: 'unknow_platform_error',
    message: error.message,
  };
}
export default axios;
