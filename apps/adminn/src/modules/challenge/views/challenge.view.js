import { useState, useRef, useEffect, useMemo } from 'react';
import SplitPane from 'react-split-pane';
import { connect } from 'react-redux';
import { Button, Drawer, Form, Layout, Spin } from 'antd';
import ReactDOM from 'react-dom';
import { LeftOutlined } from '@ant-design/icons/lib/icons';

import { css } from '@emotion/css';
import NotFoundPage from '@/components/not-found.component';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { getChallengeById, getChallengeList } from '../graphql/challenge.query';
import { genLanguages } from '../language.util';
import { useParams } from 'react-router-dom';
import ErrorFallback from '@/components/error-fallback.component';
import CodePaneView from '../components/code-pane-view.component';
import SidebarMenu from '@/components/sidebar.component';
import { sidebarChallengeViewItems } from '@/configs/sidebar.config';
import { headerHeightPx } from '@/constants/default-value';
import { useMediaQuery } from '@koj-react/hooks';
import { Content } from 'antd/lib/layout/layout';
import DescriptionView from '../components/description-view.component';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CommentPane } from '../components/comment.component';
import moment from 'moment';

import 'react-markdown-editor-lite/lib/index.css';
import { CommentContext } from '../context/comment.context';
import { CommentDrawer } from '../components/comment-drawer.component';

const { Header, Sider } = Layout;

function Challenges(props) {
  let params = useParams();
  const ckeditor = useRef(null);

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
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isOpenCommentDrawer, setIsOpenCommentDrawer] = useState(false);
  const [tabKey, setTabKey] = useState('description');

  const onCollapse = () => setCollapsed((collapsed) => !collapsed);

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
  }, [tabKey, data]);

  useEffect(() => {
    console.log('component mount');
    return () => {
      console.log('component unmount');
    };
  }, []);

  // const {set}
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
    <CommentProvider>
      <Layout className={layoutDashboardStyle}>
        <Header
          style={{
            height: headerHeightPx,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 0,
            color: '#fff',
          }}
        >
          <div style={{ width: 48, display: 'flex', justifyContent: 'center' }}>
            <LeftOutlined />
          </div>
          <div>Title</div>
          {/* <div></div> */}
          <div style={{ marginLeft: 'auto' }}>help</div>
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
                    callback={setTabKey}
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
                    callback={setTabKey}
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
        </Content>
      </Layout>
    </CommentProvider>
  );
}

export function CommentProvider({ children }) {
  const [comments, setComments] = useState([]);

  // const providerMemo = useMemo(() => ({ comments, setComments }), [comments]);

  return (
    <CommentContext.Provider value={{ comments, setComments }}>
      {children}
    </CommentContext.Provider>
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

export default connect(mapStateToProps)(Challenges);

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
