import { Button, Checkbox, Divider, Form, Input, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './auth.slice';
import { formatSearch } from '@/utils/format-search';
import { css } from '@emotion/css';
import { headerHeightPx } from '../../constants/default-value';

const initialValues = {
  username: 'guest',
  password: 'guest',
  // remember: true
};

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const onFinished = async (form) => {
    const res = dispatch(login(form));

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!res) {
      const search = formatSearch(location.search);
      const from = search.from || { pathname: '/' };

      navigate(from);
    }
  };

  return (
    <div className={loginRightStyle}>
      {/* <Typography.Title level={3}>Welcome to Vuexy! 👋</Typography.Title>
      <p>Please sign-in to your account and start the adventure</p> */}
      <Button
        className="auth-button"
        type="text"
        // icon={}
        block
      >
        <img src="https://app.codesignal.com/img/social/facebook.svg" />
        Sign up with Facebook
      </Button>
      <Button
        className="auth-button"
        type="text"
        // icon={}
        block
      >
        <img src="https://app.codesignal.com/img/social/google.svg" />
        Sign up with Google
      </Button>
      <Button
        className="auth-button"
        type="text"
        // icon={}
        block
      >
        <img src="https://app.codesignal.com/img/social/github.svg" />
        Sign up with Github
      </Button>
      <Divider plain>or</Divider>
      <Form
        onFinish={onFinished}
        className="login-page-form"
        // initialValues={initialValues}
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Email is required' }]}
        >
          <Input placeholder="abc@gmail.com" />
        </Form.Item>
        <Form.Item
          label="User Name"
          name="username"
          style={{ marginBottom: 0 }}
          rules={[{ required: true }]}
        >
          <Form.Item
            name="firstname"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Input placeholder="first name" />
          </Form.Item>
          <Form.Item
            name="lastname"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(50% - 8px)',
              marginLeft: '16px',
            }}
          >
            <Input placeholder="last name" />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Password is required！' }]}
        >
          <Input type="password" placeholder="password" />
        </Form.Item>
        <Button htmlType="submit" block type="primary" className="login-button">
          Sign Up
        </Button>
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
    border-top-width: 2px;
  }
  & .login-button {
    margin-top: 10px;
  }
`;

export default LoginForm;
