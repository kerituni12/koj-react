import { Layout, Spin, Drawer } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import React, { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '@koj-react/hooks';
import { css } from '@emotion/css';
import { headerHeightPx } from '@/constants/default-value';
import SidebarMenu from './sidebar.component';
import ErrorFallback from './error-fallback.component';
import { sidebarItems } from '@/configs/sidebar.config';

const { Header, Content, Sider } = Layout;

function LayoutDashboard(props) {
  const isDesktop = useMediaQuery('(min-width: 992px)');

  const [collapsed, setCollapsed] = useState(true);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const onCollapse = () => setCollapsed((collapsed) => !collapsed);
  const toggleDrawer = () => setIsOpenDrawer((isOpenDrawer) => !isOpenDrawer);

  useEffect(() => {
    console.log('component mount');
    return () => {
      console.log('component unmount');
    };
  }, []);

  return (
    <Layout className={layoutDashboardStyle}>
      {isDesktop ? (
        <Header className={header}>
          <div
            className="logo"
            style={{ width: `${collapsed ? 48 : 200}px` }}
          />
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger collapse',
              onClick: onCollapse,
            }
          )}
        </Header>
      ) : (
        <Header className={header}>
          <div className="logo" style={{ width: 48 }} />
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger collapse',
              onClick: toggleDrawer,
            }
          )}
        </Header>
      )}
      <Layout className="child-layout">
        {isDesktop ? (
          <Sider
            // trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            collapsedWidth={48}
          >
            <SidebarMenu items={sidebarItems} callback={() => {}} />
          </Sider>
        ) : (
          <Drawer
            title="Menu"
            onClose={() => setIsOpenDrawer(false)}
            closable={false}
            visible={isOpenDrawer}
            placement="left"
            className={`${drawerStyle} extend-sider-bg`}
          >
            <SidebarMenu items={sidebarItems} callback={() => {}} />
          </Drawer>
        )}
        <Content className="content">
          <Suspense
            fallback={
              <div className="center-screen">
                <Spin size="large" />
              </div>
            }
          >
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                // reset the state of your app so the error doesn't happen again
              }}
            >
              <Outlet />
            </ErrorBoundary>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}

const layoutDashboardStyle = css`
  height: 100vh;
  overflow: hidden;
  & header {
    height: ${headerHeightPx}px;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  & .child-layout {
    height: calc(100vh - ${headerHeightPx}px)
  }
  & + ant-layout-sider {
      height: calc(100vh - ${headerHeightPx}px - 48px);
      top: ${headerHeightPx}px
      position: sticky;

  }
  & .content {
    position: relative;
    height: calc(100vh - ${headerHeightPx}px);
    overflow: auto;
    padding: 20px 20px 0;
  }
`;

const header = css`
  padding: 0;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  & .logo {
    height: 100%;
    background-color: #fff;
    transition: all 0.2s;
  }
  & .collapse {
    color: #fff;
    padding: 0 20px;
    font-size: 18px;
    cursor: pointer;
  }
`;

const drawerStyle = css`
  & .ant-drawer-body {
    padding: 0;
    height: 100%;
  }
  & .ant-drawer-header {
    height: ${headerHeightPx}px;
  }

  & .extend-sider-bg {
  }
`;

export default LayoutDashboard;
