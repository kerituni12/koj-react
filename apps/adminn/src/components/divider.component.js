import { css } from '@emotion/css';

export function Divider() {
  return <hr className={dividerStyle} />;
}

const dividerStyle = css`
  opacity: 0.3;
`;
