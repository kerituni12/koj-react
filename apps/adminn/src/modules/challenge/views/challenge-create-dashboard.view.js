import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { useState, useRef } from 'react';
import SplitPane from 'react-split-pane';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Layout, Tabs, Form, Button } from 'antd';

import useViewport from '@/hooks/use-viewport';
import { headerHeightPx } from '@/constants/default-value';

import DescriptionMobile from '../components/description-mobile.component';
import LanguageComponent from '../components/language.component';
import Description from '../components/description.component';
import CodePane from '../components/code-pane-create.component';
import ChallengeInput from '../components/input.component';
import { challengeStyle, tabPaneStyle } from '../styles/challenge.style';
import { defaultFormValues } from '../configs/form.config';
import defaultTabFiles from '../configs/file.config';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

function Challenges(props) {
  console.log('challenge re-render');
  const [form] = Form.useForm();
  const ckeditor = useRef(null);

  const [maxActiveTab, setMaxActiveTab] = useState(1);
  const [activeTab, setActiveTab] = useState('1');
  const [customType, setCustomType] = useState([]);
  const [languages, setLanguages] = useState([]);

  const viewPort = useViewport();
  const isMobile = viewPort.width <= 768;

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
          <Form layout="vertical" form={form} initialValues={defaultFormValues}>
            <Tabs
              animated={false}
              activeKey={activeTab}
              tabBarStyle={{ padding: '0 10px', height: '46px' }}
              onChange={(key) => {}}
              onTabClick={(key, event) => {
                event.preventDefault();
                console.log('tab-click');
                form.validateFields().then((data) =>
                  ReactDOM.unstable_batchedUpdates(() => {
                    setActiveTab(key);
                    if (Number(key) > maxActiveTab) setMaxActiveTab(key);
                  })
                );
              }}
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
                    <Description ckeditor={ckeditor} />
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
                      setLanguages={setLanguages}
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
                    Test case
                  </span>
                }
                key="3"
                disabled={maxActiveTab < 2}
              >
                <ChallengeInput
                  form={form}
                  customType={customType}
                  setCustomType={setCustomType}
                />
              </TabPane>
            </Tabs>
          </Form>
        </Layout>

        {/* Pane 2 */}
        <CodePane
          form={form}
          ckeditor={ckeditor}
          languages={defaultFormValues.languages}
          files={defaultTabFiles}
        />
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
