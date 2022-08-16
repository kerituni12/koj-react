import React, { useState } from 'react';
import { css } from '@emotion/css';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Divider, Form, Input } from 'antd';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { formatSearch } from '@/utils/format-search';
import {
  BASE_API_PREFIX,
  BASE_API_URL,
  headerHeightPx,
} from '@/constants/default-value';

import {
  authSuccess,
  login,
  loginWithGithub,
  loginWithGoogle,
} from './auth.slice';
import { LoginSocialFacebook, LoginSocialGoogle } from 'reactjs-social-login';
import { LoginSocialGithub } from './github.component';
import axios from '@/services/axios';
import SocialLogin from 'react-social-login';

const initialValues = {
  email: 'hieunguyen',
  password: 'hieunguyen',
  // remember: true
};

const sleep = (timer) => {
  return new Promise((r) => setTimeout(r, timer));
};

class SocialButton extends React.Component {
  render() {
    const { children, triggerLogin, ...props } = this.props;
    return (
      <button onClick={triggerLogin} {...props}>
        {children}
      </button>
    );
  }
}

export const SocialLoginButton = SocialLogin(SocialButton);

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const onFinished = async (actionFnc, data) => {
    const { error } = await dispatch(actionFnc(data)).unwrap();
    if (error) {
      return setError(error.message);
    }
    console.log('run sau');
    const search = formatSearch(location.search);
    const from = search.from || { pathname: '/' };
    navigate(from);
  };
  // const github = () => {
  //   window.open('https://sub.koj.test/api/auth/github?path=1', '_self');
  // };
  const github = () => {
    window.open(
      `https://github.com/login/oauth/authorize?client_id=Iv1.7b1c7b07ba355ee5&redirect_uri=https://sub.koj.test/api/auth/github/callback?path='hello'&scope=user:email`,
      '_self'
    );
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
        <img src="https://app.codesignal.com/img/social/facebook.svg" />
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
      >
        <Button
          className="auth-button"
          type="text"
          // icon={}
          block
        >
          <img src="https://app.codesignal.com/img/social/google.svg" />
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
      >
        <Button
          className="auth-button"
          type="text"
          // icon={}
          block
        >
          <img src="https://app.codesignal.com/img/social/github.svg" />
          Sign in with Github
        </Button>
      </LoginSocialGithub>

      <Divider plain>or</Divider>
      <Form
        name="basic"
        onFinish={(data) => onFinished(login, data)}
        className="login-page-form"
        initialValues={initialValues}
        layout="vertical"
      >
        {error && <h5>{error}</h5>}
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
          <Button
            htmlType="submit"
            block
            type="primary"
            className="login-button"
          >
            Login
          </Button>
        </Form.Item>
        <p className="create-new">
          New on our platform? <Link to="/signup"> Create an account </Link>
        </p>
      </Form>
    </div>
  );
};

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
  & .auth-button {
    background-color: #eff3ff;
    color: '#2b3b52';
    font-weight: bold;
    border-radius: 5px;
    margin-bottom: 24px;
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

export default LoginForm;
