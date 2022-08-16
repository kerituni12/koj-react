import { useState, useRef, useEffect } from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import SplitPane from 'react-split-pane';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';

import { Layout, Tabs, Input, Form, Row, Col, Select, Button } from 'antd';
import {
  InfoCircleOutlined,
  RedoOutlined,
  FileTextOutlined,
  TrophyOutlined,
  HistoryOutlined,
  MessageOutlined,
  SettingOutlined,
  LeftOutlined,
} from '@ant-design/icons/lib/icons';

import './App.css';

import KojModal from './Modal';
import KojEditor from './editor';

import {
  az,
  FileManager,
  getTranslations,
  langChange,
} from '@koj-react/editor-lib';
import { Editor as ClassicEditor } from '@koj-react/ckeditor';
import { Emitter } from '@koj-react/emitter';
import useViewport from './useViewPort';
import { List } from 'antd';
import { css } from '@emotion/css';
import clsx from 'clsx';

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

function html(html, opts = {}) {
  return parse(DOMPurify.sanitize(html));
}

const dataSource = [
  'Test case 1',
  'Test case 1',
  'Test case 1',
  'Test case 1',
  'Test case 1',
  'Test case 1',
];

const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar
        {...props}
        className="site-custom-tab-bar"
        style={{ ...style }}
      />
    )}
  </Sticky>
);

function Challenges(props) {
  const divRef = useRef(null);
  const ckeditor = useRef(null);
  const elementRef = useRef(null);

  const [data, setData] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const viewPort = useViewport();
  const isMobile = viewPort.width <= 768;

  // const [height, setHeight] = useState(0);
  const [divHeight, setDivHeight] = useState(0);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleData = () => {
    setData(ckeditor?.current?.getData());
  };
  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  if (props.translations.lang !== props.lang) {
    import(`${props.lang} from '@koj-react/editor-lib'`)
      .then((result) => {
        props.getTranslations({
          lang: props.lang,
          data: result.default,
        });
      })
      .catch((e) => {
        props.getTranslations({
          lang: props.lang,
          data: {},
        });
      });
  }

  useEffect(() => {
    Emitter.on('open_modal', (image) => showModal());
    Emitter.on('close_modal', (image) => setIsModalVisible(false));
    return () => {
      console.log('clear');
    };
  }, []);

  useEffect(() => {
    // setHeight(elementRef.current.clientHeight);
    if (divRef?.current?.parentElement) {
      setDivHeight(
        divRef.current.parentElement.clientHeight -
          elementRef.current.clientHeight
      );
    }

    window.addEventListener('resize', () => {
      if (divRef?.current?.parentElement) {
        setDivHeight(
          divRef.current.parentElement.clientHeight -
            elementRef.current.clientHeight
        );
      }
    });

    return () => {
      window.removeEventListener('resize', null);
    };
  }, []);

  return isMobile ? (
    <>
      <Header style={{ height: '40px' }}>
        <div className="logo" />
      </Header>
      <StickyContainer>
        <Tabs
          defaultActiveKey="1"
          renderTabBar={renderTabBar}
          tabBarStyle={{ padding: '0 10px' }}
        >
          <TabPane tab="Setting" key="1">
            <Row>
              <Col xs={24}>
                <PerfectScrollbar>
                  <Content
                    style={{
                      padding: '10px',
                    }}
                  >
                    <div
                      className="site-layout-background"
                      style={{ overflow: 'initial' }}
                    >
                      <Form layout="vertical">
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              label="Field A"
                              required
                              tooltip="This is a required field"
                            >
                              <Input placeholder="input placeholder" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="Field B"
                              tooltip={{
                                title: 'Tooltip with customize icon',
                                icon: <InfoCircleOutlined />,
                              }}
                            >
                              <Input placeholder="input placeholder" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              label="Field A"
                              required
                              tooltip="This is a required field"
                            >
                              <Input placeholder="input placeholder" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="Field B"
                              tooltip={{
                                title: 'Tooltip with customize icon',
                                icon: <InfoCircleOutlined />,
                              }}
                            >
                              <Input placeholder="input placeholder" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <div>
                          <CKEditor
                            className="mt-3 wrap-ckeditor"
                            editor={ClassicEditor}
                            onReady={(editor) => {
                              ckeditor.current = editor;
                            }}
                            config={{
                              extendConfig: { emitter: Emitter },
                            }}
                          />
                          <div className="ck-content" onClick={handleData}>
                            show
                            {html(data) || null}
                          </div>
                          <KojModal
                            isOpen={isModalVisible}
                            handleCancel={handleCancel}
                          >
                            <FileManager height={window.innerHeight - 140} />
                          </KojModal>
                        </div>
                        {/* <Form.Item>
<Button type="primary">Submit</Button>
</Form.Item> */}
                      </Form>
                    </div>
                  </Content>
                </PerfectScrollbar>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Language" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Input/Output" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
        <div style={{ padding: '0 10px' }}>
          <div
            ref={elementRef}
            style={{
              display: 'flex',
              padding: '5px 0',
              backgroundColor: 'rgb(240 242 245)',
            }}
          >
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Select.Option value="jack">Jack</Select.Option>
              <Select.Option value="lucy">Lucy</Select.Option>
              <Select.Option value="disabled" disabled>
                Disabled
              </Select.Option>
              <Select.Option value="Yiminghe">yiminghe</Select.Option>
            </Select>
            <Button style={{ marginLeft: 'auto' }} icon={<RedoOutlined />}>
              Reset
            </Button>
            <br />
          </div>

          <div ref={divRef} style={{ height: 500 }}>
            <KojEditor />
          </div>

          <div style={{ zIndex: 1 }}>hello</div>
        </div>
      </StickyContainer>
    </>
  ) : (
    <>
      <Header
        style={{
          height: '40px',
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
      <SplitPane
        split="vertical"
        minSize={300}
        maxSize={700}
        defaultSize={555}
        className="primary"
        style={{ height: 'calc(100vh - 40px)' }}
      >
        {/* Pane 1 */}

        <div className={changleArea}>
          <div className={sidebarArea}>
            <div>
              <div></div>
              <FileTextOutlined className={clsx(sidebarIcon, 'active')} />
              <TrophyOutlined className={sidebarIcon} />
              <MessageOutlined className={sidebarIcon} />
              <HistoryOutlined className={sidebarIcon} />
              <InfoCircleOutlined className={sidebarIcon} />
            </div>
            <div>
              <SettingOutlined className={clsx(sidebarIcon, 'active')} />
            </div>
          </div>
          <div className={contentArea}></div>
        </div>

        {/* Pane 2 */}
        <SplitPane
          split="horizontal"
          style={{ backgroundColor: '#1e1e1e' }}
          defaultSize={35}
          maxSize={300}
          minSize={35}
          primary="second"
          onChange={(newSize) => {
            setDivHeight(
              divRef.current.parentElement.clientHeight -
                elementRef.current.clientHeight
            );
          }}
        >
          <div ref={divRef} style={{ height: divHeight }}>
            <div
              ref={elementRef}
              style={{
                display: 'flex',
                padding: 5,
                height: 40,
                backgroundColor: 'rgb(240 242 245)',
                alignItems: 'center',
              }}
            >
              <Select
                defaultValue="lucy"
                style={{ width: 120 }}
                onChange={handleChange}
              >
                <Select.Option value="jack">Jack</Select.Option>
                <Select.Option value="lucy">Lucy</Select.Option>
                <Select.Option value="disabled" disabled>
                  Disabled
                </Select.Option>
                <Select.Option value="Yiminghe">yiminghe</Select.Option>
              </Select>
              <Button style={{ marginLeft: 'auto' }} icon={<RedoOutlined />}>
                Reset
              </Button>
            </div>

            <KojEditor />
          </div>

          <div style={{ zIndex: 1, display: 'block', width: '100%' }}>
            <div className="testcase-header">
              <div>Test case</div>
              <Button
                size="small"
                type="primary"
                style={{ marginLeft: 'auto' }}
                icon={<RedoOutlined />}
              >
                Run test
              </Button>
            </div>
            <div className="testcase-panel">
              <div className="wrap-testcases tab-active">
                <List
                  size="small"
                  dataSource={dataSource}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                  className={clsx('testcases', testCaseItem)}
                />
                <div className="wrap-testcases-content">
                  <div id="kiem-thu-1" className="testcase-content active">
                    <div className="form-horizontal" data="0">
                      <Row>
                        <Col span={8}>Đầu vào:</Col>
                        <Col span={16}>[3,1,2]</Col>
                      </Row>
                      <Row>
                        <Col span={8}>Đầu ra thực tế:</Col>
                        <Col span={16}></Col>
                      </Row>
                      <Row>
                        <Col span={8}>Đầu ra mong muốn:</Col>
                        <Col span={16}>2</Col>
                      </Row>
                      <Row>
                        <Col span={8}>Giới hạn thời gian:</Col>
                        <Col
                          span={16}
                          className="col-sm-8 control-label time-limit"
                          time="0.5"
                          style={{ textAlign: 'left' }}
                        >
                          4000 ms
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>Thời gian thực hiện:</Col>
                        <Col span={16}></Col>
                      </Row>
                      <Row>
                        <Col span={8}>Tin nhắn:</Col>
                        <Col span={16}>
                          <div id="txtRunContentMesseger_0"></div>
                        </Col>
                      </Row>
                      <div className="form-group hide">
                        <Col span={8}>Mô tả:</Col>
                        <Col span={16}></Col>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="wrap-main-console"></div>
            </div>
          </div>
        </SplitPane>
      </SplitPane>
    </>
  );
}

const mapStateToProps = (store) => ({
  store,
  translations: store.dashboard.translations,
  lang: store.dashboard.lang,
});

const mapDispatchToProps = (dispatch) => ({
  langChange: (lang) => dispatch(langChange(lang)),
  getTranslations: (data) => dispatch(getTranslations(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Challenges);

const testCaseItem = css`
  & .ant-list-item {
    background: #1d2631;
    color: #fff;
  }
`;

const changleArea = css`
  display: flex;
  height: 100%;
`;
const sidebarArea = css`
  width: 48px;
  background-color: rgb(29 38 49);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const contentArea = css``;
const sidebarIcon = css`
  display: flex;
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 24px;
  &.active {
    background-color: #004ae1;
  }
`;
