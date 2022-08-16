import HeaderComponent from '@/components/header.component';
import { headerHeightPx } from '@/constants/default-value';
import { css } from '@emotion/css';
import { Layout } from 'antd';
import React from 'react';

export default function KojLayout({ children }) {
  React.useEffect(() => {
    console.log('mount');
    return () => console.log('unmount');
  }, []);
  return (
    <Layout className={layoutStyle}>
      <HeaderComponent />
      {children}
    </Layout>
  );
}

const layoutStyle = css`
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;

  & .child-layout {
    height: calc(100vh - ${headerHeightPx}px);
  }

  & + ant-layout-sider {
    height: calc(100vh - ${headerHeightPx}px - 48px);
    top: ${headerHeightPx}px;
    position: sticky;
  }

  & .content {
    position: relative;
    height: calc(100vh - ${headerHeightPx}px);
    overflow: auto;
    padding: 20px 20px 0;
  }

  & .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover {
    background: none;
  }

  & .ant-menu.ant-menu-dark .ant-menu-item-selected {
    background: none;
    border-bottom: 2px solid #fff;
  }
`;
