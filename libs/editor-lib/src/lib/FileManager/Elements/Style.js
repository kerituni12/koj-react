import { css } from '@emotion/css';
const loadingStyle = css`
  position: absolute;
  z-index: 55;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  & .opaOverlaw {
    opacity: '0.8';
    background: '#fff';
    position: 'absolute';
    width: '100%';
    height: '100%';
  }
`;
const messageBoxStyle = css`
  z-index: 66;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  float: right;
`;
