/* eslint-disable camelcase */
/**
 *
 * LoginSocialGithub
 *
 */
import React, { memo, useCallback, useEffect } from 'react';

const GITHUB_URL = 'https://github.com';
const GITHUB_API_URL = 'https://api.github.com/';
const PREVENT_CORS_URL = 'https://cors.bridged.cc';

export const LoginSocialGithub = ({
  state = '',
  scope = 'user',
  client_id,
  client_secret,
  className = '',
  redirect_uri,
  allow_signup = false,
  children,
  onReject,
  onResolve,
  onLoginStart,
}) => {
  useEffect(() => {
    const popupWindowURL = new URL(window.location.href);
    const code = popupWindowURL.searchParams.get('code');
    const state = popupWindowURL.searchParams.get('state');
    if (state?.includes('_github') && code) {
      localStorage.setItem('github', code);
      window.close();
    }
  }, []);

  const getProfile = useCallback(
    (data) => {
      fetch(`${PREVENT_CORS_URL}/${GITHUB_API_URL}/user`, {
        method: 'GET',
        headers: {
          Authorization: `token ${data.access_token}`,
          'x-cors-grida-api-key': '875c0462-6309-4ddf-9889-5227b1acc82c',
        },
      })
        .then((res) => res.json())
        .then((response) => {
          onResolve({ provider: 'github', data: { ...response, ...data } });
        })
        .catch((err) => {
          onReject(err);
        });
    },
    [onReject, onResolve]
  );

  const getAccessToken = useCallback(
    (code) => {
      const params = {
        code,
        state,
        redirect_uri,
        client_id,
        client_secret,
      };
      const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-cors-grida-api-key': '875c0462-6309-4ddf-9889-5227b1acc82c',
      });

      fetch(`${PREVENT_CORS_URL}/${GITHUB_URL}/login/oauth/access_token`, {
        method: 'POST',
        headers,
        body: new URLSearchParams(params),
      })
        .then((response) => response.text())
        .then((response) => {
          const data = {};
          const searchParams = new URLSearchParams(response);
          for (const p of searchParams) {
            data[p[0]] = p[1];
          }
          if (data.access_token) getProfile(data);
          else onReject('no data');
        })
        .catch((err) => {
          onReject(err);
        });
    },
    [client_id, client_secret, getProfile, onReject, redirect_uri, state]
  );

  const handlePostMessage = useCallback(
    async ({ type, code, provider }) => {
      if (type === 'code' && provider === 'github' && code) {
        fetch(`https://${BASE_API_URL}/api/auth/github/callback?code=${code}`, {
          method: 'GET',
        })
          .then((response) => response.json())
          .then((response) => {
            onResolve({ provider: 'github', data: response });
            if (response) {
              //
            } else onReject('no data');
          })
          .catch((err) => {
            onReject(err);
          });
      }
    },
    [getAccessToken]
  );

  const onChangeLocalStorage = useCallback(() => {
    window.removeEventListener('storage', onChangeLocalStorage, false);
    const code = localStorage.getItem('github');
    if (code) {
      //   handlePostMessage({ provider: 'github', type: 'code', code });
      onResolve({ provider: 'github', data: { code } });
      localStorage.removeItem('github');
    }
  }, [handlePostMessage]);

  const onLogin = useCallback(() => {
    onLoginStart && onLoginStart();
    window.addEventListener('storage', onChangeLocalStorage, false);
    const oauthUrl = `${GITHUB_URL}/login/oauth/authorize?client_id=${client_id}&scope=${scope}&state=${
      state + '_github'
    }&redirect_uri=${redirect_uri}&allow_signup=${allow_signup}`;
    const width = 450;
    const height = 730;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      oauthUrl,
      'Github',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left
    );
  }, [
    onLoginStart,
    onChangeLocalStorage,
    client_id,
    scope,
    state,
    redirect_uri,
    allow_signup,
  ]);

  return (
    <div className={className} onClick={onLogin}>
      {children}
    </div>
  );
};

export default memo(LoginSocialGithub);
