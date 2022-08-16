import moment from 'moment';
import ReactDOM from 'react-dom';
import { css } from '@emotion/css';
import { connect, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Content } from 'antd/lib/layout/layout';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate, useParams } from 'react-router-dom';

import { Drawer, Layout, Modal, Spin } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from 'react';

import 'react-markdown-editor-lite/lib/index.css';

import { useMediaQuery } from '@koj-react/hooks';
import { headerHeightPx } from '@/constants/default-value';
import { getSidebarChallengeViewItems } from '@/configs/sidebar.config';

import SidebarMenu from '@/components/sidebar.component';
import { RightHeader } from '@/components/header.component';
import NotFoundPage from '@/components/not-found.component';
import ErrorFallback from '@/components/error-fallback.component';

import { CommentPane } from '../components/comment.component';
import { Submission } from '../components/submission.component';
import CodePaneView from '../components/code-pane-view.component';
import DescriptionView from '../components/description-view.component';
import { CommentDrawer } from '../components/comment-drawer.component';
import { SubmissionRank } from '../components/submission-rank.component';

import { genLanguages } from '../language.util';
import { CommentContext, CommentProvider } from '../context/comment.context';
import { getChallengeById } from '../graphql/challenge.query';
import { LoginContext, LoginRequiredProvider } from '../context/login.context';
import LoginForm from '@/modules/auth/signin.component';

const { Header, Sider } = Layout;

function Challenge(props) {
  let params = useParams();
  const ckeditor = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id: userId } = useSelector(({ user }) => user.user);
  const { isLoginRequired, setIsLoginRequired } = useContext(LoginContext);

  //Todo convert to using form values
  const [languages, setLanguages] = useState([]);
  const [customType, setCustomType] = useState([]);

  if (!params.slug) {
    return <NotFoundPage />;
  }

  const { data, loading, error } = useQuery(getChallengeById, {
    variables: {
      where: {
        slug: params.slug,
      },
    },
    onCompleted({ challenge }) {
      const languages = genLanguages(challenge.languages, challenge.solutions);
      ReactDOM.unstable_batchedUpdates(() => {
        setLanguages(languages);
        setCustomType(challenge.types || []);
      });
    },
  });

  const isDesktop = useMediaQuery('(min-width: 992px)');

  const [collapsed, setCollapsed] = useState(true);
  const [tabKey, setTabKey] = useState('description');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isOpenCommentDrawer, setIsOpenCommentDrawer] = useState(false);

  const sidebarChallengeViewItems = useMemo(
    () => getSidebarChallengeViewItems(t),
    [t]
  );

  const onCollapse = () => setCollapsed((collapsed) => !collapsed);

  const setLoginRequiredFasle = useCallback(
    () => setIsLoginRequired(false),
    []
  );

  const setTabKeyCallback = (tabKey) => {
    if (tabKey === 'history') {
      if (!userId) {
        setIsLoginRequired(true);
        return;
      }
    }
    setTabKey(tabKey);
  };
  const render = useMemo(() => {
    if (tabKey === 'description') {
      return <DescriptionView challenge={data?.challenge} />;
    }
    if (tabKey === 'comment') {
      return (
        <CommentPane
          setIsOpenCommentDrawer={setIsOpenCommentDrawer}
          challengeId={Number(data?.challenge?.id)}
        />
      );
    }
    if (tabKey === 'history') {
      return <Submission challenge={data?.challenge} />;
    }
    if (tabKey === 'rank') {
      return <SubmissionRank challenge={data?.challenge} />;
    }
  }, [tabKey, data]);

  useEffect(() => {
    console.log('component mount');
    return () => {
      console.log('component unmount');
    };
  }, []);

  if (error) {
    return <ErrorFallback error={error} />;
  }
  if (loading) {
    return (
      <div className="center-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className={layoutDashboardStyle}>
      <Header className={headerStyle}>
        <div className={leftHeaderStyle}>
          <div style={{ width: 48, display: 'flex', justifyContent: 'center' }}>
            <LeftOutlined onClick={() => navigate(-1)} />
          </div>

          <div>{data.challenge?.title || ''}</div>
        </div>
        <RightHeader />
      </Header>
      <Content className="child-layout">
        <SplitPane
          split="vertical"
          minSize={300}
          maxSize={700}
          defaultSize={555}
          className="primary"
          style={{
            height: `calc(100vh - ${headerHeightPx}`,
            position: 'relative',
          }}
        >
          {/* Pane 1 */}
          <Layout hasSider className="child-layout">
            {isDesktop ? (
              <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                collapsedWidth={48}
                className={challengeSiderStyle}
              >
                <SidebarMenu
                  items={sidebarChallengeViewItems}
                  callback={setTabKeyCallback}
                  selectedKeys={[tabKey]}
                />
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
                <SidebarMenu
                  items={sidebarChallengeViewItems}
                  callback={setTabKeyCallback}
                  selectedKeys={[tabKey]}
                />
              </Drawer>
            )}
            <PerfectScrollbar style={{ width: '100%' }}>
              <Content className="content">{render}</Content>
            </PerfectScrollbar>
          </Layout>

          {/* Pane 2 */}
          {!languages.length ? (
            <div className="center-screen">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <CodePaneView
                ckeditor={ckeditor}
                languages={languages}
                setLanguages={setLanguages}
                challenge={data.challenge}
                customType={customType}
              />
              {isOpenCommentDrawer && (
                <CommentDrawer
                  setIsOpenCommentDrawer={setIsOpenCommentDrawer}
                  isOpenCommentDrawer={isOpenCommentDrawer}
                  challengeId={Number(data?.challenge?.id)}
                />
              )}
            </>
          )}
        </SplitPane>
        <Modal
          title=""
          footer={null}
          centered
          visible={isLoginRequired}
          onOk={setLoginRequiredFasle}
          onCancel={setLoginRequiredFasle}
        >
          <LoginForm isFromModal={true} callback={setLoginRequiredFasle} />
        </Modal>
      </Content>
    </Layout>
  );
}

function ChallengeWrapper() {
  return (
    <LoginRequiredProvider>
      <CommentProvider>
        <Challenge />
      </CommentProvider>
    </LoginRequiredProvider>
  );
}

const mapStateToProps = (store) => ({
  store,
  translations: store.fileMananger?.dashboard?.translations,
  lang: store.fileMananger?.dashboard?.lang,
});

export const defaultComment = [
  {
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: `<p>
        We supply a series of design principles, practical patterns and high
        quality design resources (Sketch and Axure), to help people create their
        product prototypes beautifully and efficiently.
      </p>`,
    datetime: moment().fromNow(),
  },
  {
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: `<p>
        We supply a series of design principles, practical patterns and high
        quality design resources (Sketch and Axure), to help people create their
        product prototypes beautifully and efficiently.
      </p>`,
    datetime: moment().fromNow(),
  },
];

export default connect(mapStateToProps)(ChallengeWrapper);

const headerStyle = css`
  height: ${headerHeightPx}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  padding-right: 20px;
  color: #fff;
  height: ${headerHeightPx}px;
  position: sticky;
  top: 0;
  z-index: 1;

  .header-right {
    display: flex;
    gap: 16px;
    height: 100%;
    align-items: center;
  }

  .user-actions {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .user-actions img {
    height: 22px;
    border-radius: 50%;
  }

  .login-action {
    cursor: pointer;
    width: max-content;
  }

  // antd icon
  .anticon {
    font-size: 20px;
    padding: 10px 0;
  }
`;

const layoutDashboardStyle = css`
  height: 100vh;
  overflow: hidden;

  & .child-layout {
    position: relative;
    height: calc(100vh - ${headerHeightPx}px)
  }
  & + ant-layout-sider {
      height: calc(100vh - ${headerHeightPx}px - 48px);
      top: ${headerHeightPx}px
      position: sticky;

  }
  & .content {
    position: relative;
    overflow: auto;
    padding: 10px;
    height: 100%;
    background-color: #fff;
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

const challengeSiderStyle = css`
  & .ant-menu-item:first-child {
    margin-top: 0;
  }
`;

const leftHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  height: 100%;
  align-items: center;
`;
