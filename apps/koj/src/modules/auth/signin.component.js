import React, { useState } from 'react';
import { css } from '@emotion/css';
import { useDispatch } from 'react-redux';
import { Button, Checkbox, Divider, Form, Input } from 'antd';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { formatSearch } from '@/utils/format-search';

import { login, loginWithGithub, loginWithGoogle } from './auth.slice';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { LoginSocialGithub } from './github.component';
import { SignupForm } from './signup.component';
import { useTranslation } from 'react-i18next';

const initialValues = {
  email: 'hieunguyen',
  password: 'hieunguyen',
  // remember: true
};

const Login = ({ isFromModal, isSignup, callback }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const [formType, setFormType] = useState(!isSignup ? 'signin' : 'signup');

  const onFinished = async (actionFnc, data) => {
    const { error } = await dispatch(actionFnc(data)).unwrap();
    if (error) {
      return setError(error.message);
    }
    if (isFromModal) {
      callback();
      return;
    }
    const search = formatSearch(location.search);
    const from = search.from || { pathname: '/' };
    navigate(from);
  };

  return (
    <div className={loginRightStyle}>
      {/* <LoginSocialFacebook
      appId={"2086263614924092"}
      onLoginStart={onLoginStart}
      fieldsProfile={
        "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email"
      }
      onResolve={({ provider, data }) => {
        setProvider(provider);
        setProfile(data);
      }}
      onReject={(err) => {
        console.log(err);
      }}
      >

      <Button className="auth-button" type="text" block>
                  <img src={`${process.env.PUBLIC_URL}/assets/img/logos/facebook.svg`} />

        Sign in with Facebook
      </Button>
      </LoginSocialFacebook> */}

      <LoginSocialGoogle
        scope="email"
        client_id={
          process.env.REACT_APP_GG_APP_ID ||
          '393042588124-mdcagqs55a8evivejhfgoe5o01tjfkda.apps.googleusercontent.com'
        }
        onLoginStart={() => console.log('start')}
        onResolve={async ({ data }) => {
          data.provider = 'google';
          onFinished(loginWithGoogle, data);
        }}
        onReject={(err) => {
          console.log(err);
        }}
        className="social-login"
      >
        <Button
          className="auth-button"
          type="text"
          // icon={}
          block
        >
          <img src={`${process.env.PUBLIC_URL}/assets/img/logos/google.svg`} />
          Sign in with Google
        </Button>
      </LoginSocialGoogle>

      <LoginSocialGithub
        client_id={
          process.env.REACT_APP_GITHUB_APP_ID || 'Iv1.7b1c7b07ba355ee5'
        }
        redirect_uri="https://react.koj.test/signin"
        onResolve={({ data }) => {
          data.provider = 'github';
          onFinished(loginWithGithub, data);
        }}
        onReject={(err) => {
          console.log(err);
        }}
        className="social-login"
      >
        <Button
          className="auth-button"
          type="text"
          // icon={}
          block
        >
          <img src={`${process.env.PUBLIC_URL}/assets/img/logos/github.svg`} />
          Sign in with Github
        </Button>
      </LoginSocialGithub>

      <Divider plain>or</Divider>
      {error && <h5>{error}</h5>}
      {formType === 'signup' ? (
        <SignupForm setFormType={setFormType} />
      ) : (
        <LoginForm onFinished={onFinished} setFormType={setFormType} />
      )}
    </div>
  );
};

export function LoginForm({ onFinished, setFormType }) {
  const { t } = useTranslation();

  return (
    <Form
      name="basic"
      onFinish={(data) => onFinished(login, data)}
      className="login-page-form"
      initialValues={initialValues}
      layout="vertical"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Email is required' }]}
      >
        <Input placeholder="email" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Password is required！' }]}
      >
        <Input type="password" placeholder="password" />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" block type="primary" className="login-button">
          Login
        </Button>
      </Form.Item>
      <p className="create-new">
        {t('title.no_account')}?
        <Button type="link" onClick={() => setFormType('signup')}>
          {t('action.signup')}
        </Button>
      </p>
    </Form>
  );
}
const loginRightStyle = css`
  background-color: #fff;
  height: 100%;
  overflow: auto;
  padding: 2rem;
  & .login-page-form,
  .login-button {
    width: 100%;
  }
  & .create-new {
    text-align: center;
  }
  & .ant-divider-inner-text {
    opacity: 0.8;
  }
  & .social-login {
    margin-bottom: 24px;
  }
  & .auth-button {
    background-color: #eff3ff;
    color: '#2b3b52';
    font-weight: bold;
    border-radius: 5px;

    & img {
      position: absolute;
      left: 12px;
      top: 6px;
    }
    & span {
      margin-left: 18px;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  & form {
    width: 100%;
    & .ant-form-item {
      margin-bottom: 12px;
    }
  }
  & .login-form-forgot {
    float: right;
  }
  & .ant-divider-horizontal.ant-divider-with-text::before,
  .ant-divider-horizontal.ant-divider-with-text::after {
    top: 0;
  }
`;

export default Login;
