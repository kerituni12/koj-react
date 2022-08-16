import i18n from '@/i18n/i18n';

import {
  LogoutOutlined,
  UserOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

import { css } from '@emotion/css';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Dropdown, Menu, Drawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import LogoKoj from '@/assets/images/logo-w.svg';
// import Avatar from '@/assets/images/header/avatar.jpeg';
import { ReactComponent as ViVnSvg } from '@/assets/images/header/vi_VN.svg';
import { ReactComponent as EnUsSvg } from '@/assets/images/header/en_US.svg';

import { logout } from '@/modules/auth/auth.slice';
import { headerHeightPx } from '@/constants/default-value';
import { useMediaQuery } from '@koj-react/hooks';
import SidebarMenu from './sidebar.component';
import { sidebarItems } from '@/configs/sidebar.config';

import { MenuFoldOutlined } from '@ant-design/icons';

const { Header } = Layout;

const getheaderMenuItems = (t) => [
  {
    label: <Link to="/challenge">{t('title.challenges')}</Link>,
    key: 'challenges',
    style: { lineHeight: `${headerHeightPx}px` },
  },
  {
    label: <Link to="/">{t('title.contests')}</Link>,
    key: 'contests',
    style: { lineHeight: `${headerHeightPx}px` },
  },
  {
    label: <Link to="/">{t('title.courses')}</Link>,
    key: 'courses',
    style: { lineHeight: `${headerHeightPx}px` },
  },
  {
    label: <Link to="/">{t('title.blog')}</Link>,
    key: 'blog',
    style: { lineHeight: `${headerHeightPx}px` },
  },
];

const UserActionMenu = ({ onActionClick }) => {
  const { t } = useTranslation();

  const userActionMenuItems = [
    {
      label: <Link to="/">{t('title.account')}</Link>,
      key: 'account',
      icon: <UserOutlined />,
    },
    {
      label: t('action.logout'),
      key: 'logout',
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Menu
      onClick={onActionClick}
      className={userActionMenuStyle}
      items={userActionMenuItems}
    />
  );
};

const HeaderComponent = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [acitveMenuKey, setAcitveMenuKey] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(!isDesktop);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const headerMenuItems = useMemo(() => getheaderMenuItems(t), [t]);

  const toggleDrawer = () => setIsOpenDrawer((isOpenDrawer) => !isOpenDrawer);

  const onMenuClick = (e) => {
    setAcitveMenuKey(e.key);
  };

  return (
    <>
      {isDesktop ? (
        <Header className={headerStyle}>
          <div className="header-left">
            <img
              alt="koj logo"
              src={LogoKoj}
              onClick={() => {
                navigate('/');
                setAcitveMenuKey('');
              }}
            />
            <Menu
              style={{ width: '100%' }}
              theme="dark"
              onClick={onMenuClick}
              selectedKeys={[acitveMenuKey]}
              mode="horizontal"
              items={headerMenuItems}
            />
          </div>
          <RightHeader />
        </Header>
      ) : (
        <Header className={mobileHeaderStyle}>
          {/* <div className="logo" style={{ width: 48 }} /> */}
          {React.createElement(MenuFoldOutlined, {
            className: 'trigger collapse',
            onClick: toggleDrawer,
          })}
          <RightHeader />
        </Header>
      )}
      {!isDesktop && (
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
    </>
  );
};

export function RightHeader() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email } = useSelector(({ user }) => user.user);

  const selectLocale = ({ key }) => {
    i18n.changeLanguage(key);
  };

  const onActionClick = async ({ key }) => {
    switch (key) {
      case 'userInfo':
        return;
      case 'userSetting':
        return;
      case 'logout': {
        const res = await dispatch(logout()).unwrap();
        res &&
          navigate(`/signin?from=${encodeURIComponent(location.pathname)}`);
        return;
      }
    }
  };

  const languageMenu = useMemo(() => [
    {
      label: 'Vietnam',
      key: 'vi',
      disabled: i18n.language.startsWith('vi'),
      icon: <ViVnSvg />,
    },
    {
      label: 'English',
      key: 'en',
      disabled: i18n.language.startsWith('en'),
      icon: <EnUsSvg />,
    },
  ]);
  return (
    <div className="header-right">
      {/* <HeaderNoticeComponent /> */}
      <Dropdown overlay={<Menu onClick={selectLocale} items={languageMenu} />}>
        <GlobalOutlined />
      </Dropdown>

      {email ? (
        <Dropdown overlay={<UserActionMenu onActionClick={onActionClick} />}>
          {/* <span className="user-actions">
              <img src={Avatar} className="user-avatar" alt="avatar" />
            </span> */}
          <UserOutlined />
        </Dropdown>
      ) : (
        <span
          className="login-action"
          onClick={() =>
            navigate(`/signin?from=${encodeURIComponent(location.pathname)}`)
          }
        >
          {t('action.login')}
        </span>
      )}
    </div>
  );
}

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

const mobileHeaderStyle = css`
  color: #fff;
  height: ${headerHeightPx}px;
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

  & .header-right {
    display: flex;
    gap: 16px;
    height: 100%;
    align-items: center;
  }

  & .user-actions {
    height: 100%;
    display: flex;
    align-items: center;
  }

  & .user-actions img {
    height: 22px;
    border-radius: 50%;
  }

  & .login-action {
    cursor: pointer;
    width: max-content;
  }

  // antd icon
  & .anticon {
    font-size: 20px;
    padding: 10px 0;
  }
`;

const headerStyle = css`
  top: 0;
  color: #fff;
  z-index: 999;
  display: flex;
  padding: 0 20px;
  position: sticky;
  align-items: center;
  height: ${headerHeightPx}px;

  & .header-left {
    display: flex;
    height: 100%;
    width: 100%;
  }

  & .header-left img {
    height: 80%;
    width: 48px;
    margin: auto;
  }

  & .header-right {
    display: flex;
    gap: 16px;
    height: 100%;
    align-items: center;
  }

  & .user-actions {
    height: 100%;
    display: flex;
    align-items: center;
  }

  & .user-actions img {
    height: 22px;
    border-radius: 50%;
  }

  & .login-action {
    cursor: pointer;
    width: max-content;
  }

  // antd icon
  & .anticon {
    font-size: 20px;
    padding: 10px 0;
  }
`;

const userAction = css`
  padding-left: 5px;
`;

const userActionMenuStyle = css`
  border-radius: 2px;
  & .ant-menu-item-selected {
    background: none !important;
  }
`;
export default HeaderComponent;
