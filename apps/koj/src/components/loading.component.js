import { css } from '@emotion/css';
import { Button, Spin, Typography } from 'antd';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';

export function InnerLoading() {
  return (
    <div className={innerLoadingStyle}>
      <Spin size="large" />
    </div>
  );
}

export function LoginRequire() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={clsx(innerLoadingStyle, loginRequireStyle)}>
      <h2> Please login first!</h2>
      <Button
        type="primary"
        onClick={() =>
          navigate(
            `/signin?from=${
              location.pathname === '/' || location.pathname === '/signin'
                ? '/'
                : encodeURIComponent(location.pathname)
            }`
          )
        }
      >
        Login
      </Button>
    </div>
  );
}

const loginRequireStyle = css`
  flex-direction: column;
  h2 {
    color: #fff;
  }
`;

const innerLoadingStyle = css`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  background-color: rgb(0 0 0 / 50%);
  z-index: 9999;
`;
