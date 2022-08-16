import {
  LogoutOutlined,
  UserOutlined,
  GlobalOutlined,
  MailOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Layout, Dropdown, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import HeaderNoticeComponent from './notice';
import Avator from '@/assets/images/header/avator.jpeg';
import { ReactComponent as ViVnSvg } from '@/assets/images/header/vi_VN.svg';
import { ReactComponent as EnUsSvg } from '@/assets/images/header/en_US.svg';
// import { LocaleFormatter, useLocale } from '@/locales';
// import ReactSvg from '@/assets/logo/react.svg';
// import AntdSvg from '@/assets/logo/antd.svg';
// import { logoutAsync, setUserItem } from '@/stores/user.store';
import { useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/css';
import HeaderNoticeComponent from './notice.component';
// import { setGlobalState } from '@/stores/global.store';
import LogoKoj from '@/assets/images/logo-w.svg';
import { headerHeightPx } from '@/constants/default-value';
import i18n from '@/i18n/i18n';
import { setLocale } from '@/modules/user/user.slice';
import { useMemo, useState } from 'react';
const { Header } = Layout;

const headerMenuItems = [
  {
    label: <Link to="/challenge">Changlle</Link>,
    key: 'challenge',
    style: { lineHeight: `${headerHeightPx}px` },
  },
  {
    label: <Link to="/">Contest</Link>,
    key: 'contest',
    style: { lineHeight: `${headerHeightPx}px` },
  },
  {
    label: <Link to="/">Course</Link>,
    key: 'course',
    style: { lineHeight: `${headerHeightPx}px` },
  },
  {
    label: <Link to="/">Blog</Link>,
    key: 'blog',
    style: { lineHeight: `${headerHeightPx}px` },
  },
];

const HeaderComponent = ({ collapsed, toggle }) => {
  const { email, device, locale } = useSelector(({ user }) => user.user);
  const [acitveMenuKey, setAcitveMenuKey] = useState('');
  //   const { theme } = useSelector((state) => state.global);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onActionClick = async (action) => {
    switch (action) {
      case 'userInfo':
        return;
      case 'userSetting':
        return;
      case 'logout':
        // const res = Boolean(await dispatch(logoutAsync()));

        // res && navigate('/login');

        return;
    }
  };

  const onMenuClick = (e) => {
    setAcitveMenuKey(e.key);
  };

  const selectLocale = ({ key }) => {
    dispatch(setLocale({ locale: key }));
    i18n.changeLanguage(key);
  };

  const languageMenu = useMemo(() => [
    {
      label: 'Vietnam',
      key: 'vi_VN',
      disabled: locale === 'vi_VN',
      icon: <ViVnSvg />,
    },
    {
      label: 'English',
      key: 'en_US',
      disabled: locale === 'en_US',
      icon: <EnUsSvg />,
    },
  ]);

  const userActionMenu = (
    <Menu>
      <Menu.Item key="1">
        <span>
          <UserOutlined />
          <span className={userAction} onClick={() => navigate('/dashboard')}>
            Account
            {/* <LocaleFormatter id="header.avator.account" /> */}
          </span>
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">
        <span>
          <LogoutOutlined />
          <span className={userAction} onClick={() => onActionClick('logout')}>
            Log out
            {/* <LocaleFormatter id="header.avator.logout" /> */}
          </span>
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className={headerStyle}>
      {device !== 'MOBILE' && (
        <div className="header-left">
          <img
            src={LogoKoj}
            alt=""
            onClick={() => {
              navigate('/');
              setAcitveMenuKey('');
            }}
          />
          <Menu
            theme="dark"
            onClick={onMenuClick}
            selectedKeys={[acitveMenuKey]}
            mode="horizontal"
            items={headerMenuItems}
          />
        </div>
      )}
      <div className="header-right">
        {/* <HeaderNoticeComponent /> */}
        <Dropdown
          overlay={<Menu onClick={selectLocale} items={languageMenu} />}
        >
          <GlobalOutlined style={{ fontSize: '20px', color: '#fff' }} />
        </Dropdown>
        {email ? (
          <Dropdown overlay={userActionMenu}>
            <span className="user-actions">
              <img src={Avator} className="user-avator" alt="avator" />
            </span>
          </Dropdown>
        ) : (
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/signin')}
          >
            {/* {formatMessage({ id: 'gloabal.tips.login' })} */}
            login
          </span>
        )}
      </div>
    </Header>
  );
};

const headerStyle = css`
  & .header-left {
    display: flex;
    height: 100%;
  }
  & .header-left img {
    height: 80%;
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
  & span.user-action {
    padding-left: 5px;
  }
`;

const userAction = css`
  padding-left: 5px;
`;
export default HeaderComponent;
