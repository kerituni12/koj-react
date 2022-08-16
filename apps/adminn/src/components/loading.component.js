import { css } from '@emotion/css';
import { Spin } from 'antd';

export function InnerLoading() {
  return (
    <div className={innerLoadingStyle}>
      <Spin size="large" />
    </div>
  );
}

const innerLoadingStyle = css`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  background-color: rgb(0 0 0 / 50%);
  z-index: 999;
`;
