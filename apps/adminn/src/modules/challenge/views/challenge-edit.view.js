import { useState, useRef, useMemo } from 'react';
import SplitPane from 'react-split-pane';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Layout, Tabs, Form, Button, Spin } from 'antd';

import useViewport from '@/hooks/use-viewport';
import LanguageComponent from '../components/language.component';
import ChallengeInput from '../components/input.component';
import { headerHeightPx } from '@/constants/default-value';
import { challengeStyle, tabPaneStyle } from '../styles/challenge.style';
import Description from '../components/description.component';
import DescriptionMobile from '../components/description-mobile.component';
import CodePane from '../components/code-pane-create.component';
import { useQuery } from '@apollo/client';
import { getChallengeById } from '../graphql/challenge.query';
import ErrorFallback from '@/components/error-fallback.component';
import { useLocation, useParams } from 'react-router-dom';
import NotFoundPage from '@/components/not-found.component';
import { genLanguages } from '../language.util';

const { Content } = Layout;
const { TabPane } = Tabs;

function Challenges(props) {
  console.log('challenge re-render');

  const [form] = Form.useForm();
  const params = useParams();
  const ckeditor = useRef(null);

  //Todo convert to using form values
  const [languages, setLanguages] = useState([]);

  const [customType, setCustomType] = useState([]);
  const [description, setDescription] = useState(null);

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
        setDescription(challenge.description);
        setCustomType(challenge.types || []);
      });
    },
  });

  const mappingFormData = useMemo(() => {
    if (!data) return data;
    const challenge = data.challenge;
    return {
      ...challenge,
      challengeName: challenge.title,
      topicTags: challenge.topicTags.map((topic) => Number(topic.id)),
    };
  }, [data]);

  const viewPort = useViewport();
  const isMobile = viewPort.width <= 768;
  const onSetLanguages = (languages) => {
    const { solutions } = data.challenge;
    const languagesResult = genLanguages(languages, solutions);
    setLanguages(languagesResult);
  };

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

  return isMobile ? (
    <DescriptionMobile />
  ) : (
    <div className={challengeStyle}>
      <SplitPane
        split="vertical"
        minSize={300}
        maxSize={700}
        defaultSize={555}
        className="primary"
        style={{
          height: `calc(100vh - ${headerHeightPx} )`,
          top: 0,
        }}
      >
        <Layout>
          <Form layout="vertical" form={form} initialValues={mappingFormData}>
            <Tabs
              animated={false}
              defaultActiveKey="1"
              tabBarStyle={{ padding: '0 10px', height: '46px' }}
            >
              <TabPane
                tab={
                  <span>
                    <Button type="primary" shape="circle" size="small">
                      1
                    </Button>
                    Description
                  </span>
                }
                key="1"
              >
                <PerfectScrollbar>
                  <Content className={tabPaneStyle}>
                    {description !== null && (
                      <Description
                        ckeditor={ckeditor}
                        description={description}
                      />
                    )}
                  </Content>
                </PerfectScrollbar>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Button type="primary" shape="circle" size="small">
                      2
                    </Button>
                    Language
                  </span>
                }
                key="2"
              >
                <PerfectScrollbar>
                  <Content className={tabPaneStyle}>
                    <LanguageComponent
                      form={form}
                      languages={languages}
                      setLanguages={onSetLanguages}
                    />
                  </Content>
                </PerfectScrollbar>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Button type="primary" shape="circle" size="small">
                      3
                    </Button>
                    In/Output
                  </span>
                }
                key="3"
              >
                <ChallengeInput
                  form={form}
                  customType={customType}
                  setCustomType={setCustomType}
                  structs={data.challenge?.structs}
                />
              </TabPane>
            </Tabs>
          </Form>
        </Layout>

        {/* Pane 2 */}
        {!languages.length ? (
          <div className="center-screen">
            <Spin size="large" />
          </div>
        ) : (
          <CodePane
            form={form}
            ckeditor={ckeditor}
            languages={languages}
            setLanguages={setLanguages}
            challenge={data.challenge}
            customType={customType}
            // testcases={testcases}
            // setTestcases={setTestcases}
          />
        )}
      </SplitPane>
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    store,
    translations: store.fileMananger?.dashboard?.translations,
    lang: store.fileMananger?.dashboard?.lang,
  };
};

export default connect(mapStateToProps)(Challenges);
