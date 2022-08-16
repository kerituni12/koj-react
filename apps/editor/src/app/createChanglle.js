import { useState, useRef, useEffect } from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import SplitPane from 'react-split-pane';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';

import { Layout, Tabs, Input, Form, Row, Col, Select, Button } from 'antd';
import { InfoCircleOutlined, RedoOutlined } from '@ant-design/icons/lib/icons';

import './App.css';

import KojModal from './Modal';
import KojEditor from './editor';

import { az, getTranslations, langChange } from '@koj-react/editor-lib';
import FileManager from '@koj-react/editor-lib';
import { Editor as ClassicEditor } from '@koj-react/ckeditor';
import { Emitter } from '@koj-react/emitter';
import useViewport from './useViewPort';
import { List } from 'antd';
import { css } from '@emotion/css';
import clsx from 'clsx';
import LanguageComponent from './language.component';
import Testcase from './testcase.component';

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

// const renderTabBar = (props, DefaultTabBar) => (
//   <Layout>
//     <Header
//       style={{
//         position: 'fixed',
//         zIndex: 1,
//         top: 0,
//         width: '100%',
//         height: 40,
//       }}
//     ></Header>
//     <DefaultTabBar
//       {...props}
//       style={{
//         top: 40,
//         zIndex: 1,
//         position: 'fixed',
//         background: '#fff',
//         width: '100%',
//         padding: '0 10px',
//       }}
//     />
//   </Layout>
// );

const tagOptions = [];
for (let i = 10; i < 36; i++) {
  tagOptions.push(
    <Select.Option key={i.toString(36) + i}>{i.toString(36) + i}</Select.Option>
  );
}

function handleChange(value) {
  console.log(`selected ${value}`);
}

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
          <TabPane tab="Description" key="1">
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
                              label="Tên thử thách"
                              required
                              tooltip="This is a required field"
                            >
                              <Input placeholder="input placeholder" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="Tên Hàm"
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
                              label="Đối tượng xem"
                              required
                              tooltip="This is a required field"
                            >
                              <Input placeholder="input placeholder" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="Độ khó"
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
      <Header style={{ height: '40px' }}>
        <div className="logo" />
      </Header>
      <SplitPane
        split="vertical"
        minSize={300}
        maxSize={700}
        defaultSize={555}
        className="primary"
        style={{ height: 'calc(100vh - 40px)' }}
      >
        <Layout className={layoutStyle}>
          <Tabs defaultActiveKey="1" tabBarStyle={{ padding: '0 10px' }}>
            <TabPane tab="Description" key="1">
              <PerfectScrollbar>
                <Content className={tabPaneStyle}>
                  <div style={{ overflow: 'initial' }}>
                    <Form layout="vertical">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label="Tên thử thách"
                            required
                            tooltip="This is a required field"
                          >
                            <Input placeholder="input placeholder" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Tên hàm"
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
                            label="Đối tượng xem"
                            required
                            tooltip="This is a required field"
                          >
                            <Input placeholder="input placeholder" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Độ khó"
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
                        <Col span={24}>
                          <Form.Item
                            label="Tags"
                            required
                            tooltip="This is a required field"
                          >
                            <Select
                              mode="tags"
                              style={{ width: '100%' }}
                              onChange={handleChange}
                              tokenSeparators={[',']}
                            >
                              {tagOptions}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <div>
                        <CKEditor
                          className="mt-3 wrap-ckeditor"
                          editor={ClassicEditor}
                          onReady={(editor) => {
                            ckeditor.current = editor;
                            editor.editing.view.change((writer) => {
                              writer.setStyle(
                                'height',
                                '450px',
                                editor.editing.view.document.getRoot()
                              );
                            });
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
            </TabPane>
            <TabPane tab="Language" key="2">
              <Content className={tabPaneStyle}>
                <LanguageComponent />
              </Content>
            </TabPane>
            <TabPane tab="Test case" key="3">
              <PerfectScrollbar>
                <Content className={tabPaneStyle}>
                  <Testcase />
                </Content>
              </PerfectScrollbar>
            </TabPane>
          </Tabs>
        </Layout>

        <SplitPane
          split="horizontal"
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
            </div>

            <KojEditor />
          </div>

          <div style={{ zIndex: 1, display: 'block', width: '100%' }}>
            <div className="testcase-header">
              <div>Test case</div>
              <Button style={{ marginLeft: 'auto' }} icon={<RedoOutlined />}>
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
                {/* <ul className="testcases">
                  <li className="false" data-target="kiem-thu-1">
                    <a className="toggle" href="#kiem-thu-1" data="0">
                      <i className="ti-angle-right"></i>
                      <span className="tc-label">Kiểm thử 1</span>
                      <span className="tc-mb-label">1</span>
                    </a>
                  </li>
                  <li className="false" data-target="kiem-thu-2">
                    <a className="toggle active" href="#kiem-thu-2" data="1">
                      <i className="ti-angle-right"></i>
                      <span className="tc-label">Kiểm thử 2</span>
                      <span className="tc-mb-label">2</span>
                    </a>
                  </li>
                  <li className="false" data-target="kiem-thu-3">
                    <a className="toggle" href="#kiem-thu-3" data="2">
                      <i className="ti-angle-right"></i>
                      <span className="tc-label">Kiểm thử 3</span>
                      <span className="tc-mb-label">3</span>
                    </a>
                  </li>
                  <li className="false" data-target="kiem-thu-4">
                    <a className="toggle" href="#kiem-thu-4" data="3">
                      <i className="ti-angle-right"></i>
                      <span className="tc-label">Kiểm thử 4</span>
                      <span className="tc-mb-label">4</span>
                    </a>
                  </li>
                  <li className="false" data-target="kiem-thu-5">
                    <a className="toggle" href="#kiem-thu-5" data="4">
                      <i className="ti-angle-right"></i>
                      <span className="tc-label">Kiểm thử 5</span>
                      <span className="tc-mb-label">5</span>
                    </a>
                  </li>
                  <li className="case-hidden">
                    <a className="toggle" href="#kiem-thu-6" data="5">
                      <i className="ti-angle-right"></i>
                      <span className="tc-label">Kiểm thử 6</span>
                      <span className="tc-mb-label">6</span>
                      <span className="fa fa-lock"></span>
                    </a>
                  </li>
                  <li className="case-hidden">
                    <a className="toggle" href="#kiem-thu-7" data="6">
                      <i className="ti-angle-right"></i>
                      <span className="tc-label">Kiểm thử 7</span>
                      <span className="tc-mb-label">7</span>
                      <span className="fa fa-lock"></span>
                    </a>
                  </li>
                  <li className="case-hidden">
                    <a className="toggle" href="#kiem-thu-8" data="7">
                      <i className="ti-angle-right"></i>
                      <span className="tc-label">Kiểm thử 8</span>
                      <span className="tc-mb-label">8</span>
                      <span className="fa fa-lock"></span>
                    </a>
                  </li>
                  <li className="case-hidden">
                    <a className="toggle" href="#kiem-thu-9" data="8">
                      <i className="ti-angle-right"></i>
                      <span className="tc-label">Kiểm thử 9</span>
                      <span className="tc-mb-label">9</span>
                      <span className="fa fa-lock"></span>
                    </a>
                  </li>
                  <li className="case-hidden">
                    <a className="toggle" href="#kiem-thu-10" data="9">
                      <i className="ti-angle-right"></i>
                      <span className="tc-label">Kiểm thử 10</span>
                      <span className="tc-mb-label">10</span>
                      <span className="fa fa-lock"></span>
                    </a>
                  </li>
                </ul> */}
                <div className="wrap-testcases-content">
                  <div id="kiem-thu-1" className="testcase-content">
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
                        <Col span={4}>Giới hạn thời gian:</Col>
                        <div
                          className="col-sm-8 control-label time-limit"
                          time="0.5"
                          style={{ textAlign: 'left' }}
                        >
                          4000 ms
                        </div>
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
                  <div id="kiem-thu-2" className="testcase-content active">
                    <div className="form-horizontal" data="1">
                      <Row>
                        <Col span={8}>Đầu vào:</Col>
                        <Col span={16}>[10,10,8,2,5]</Col>
                      </Row>
                      <Row>
                        <Col span={8}>Đầu ra thực tế:</Col>
                        <Col span={16}></Col>
                      </Row>
                      <Row>
                        <Col span={8}>Đầu ra mong muốn:</Col>
                        <Col span={16}>8</Col>
                      </Row>
                      <Row>
                        <Col span={4}>Giới hạn thời gian:</Col>
                        <div
                          className="col-sm-8 control-label time-limit"
                          time="0.5"
                          style={{ textAlign: 'left' }}
                        >
                          4000 ms
                        </div>
                      </Row>
                      <Row>
                        <Col span={8}>Thời gian thực hiện:</Col>
                        <Col span={16}></Col>
                      </Row>
                      <Row>
                        <Col span={8}>Tin nhắn:</Col>
                        <Col span={16}>
                          <div id="txtRunContentMesseger_1"></div>
                        </Col>
                      </Row>
                      <div className="form-group hide">
                        <Col span={8}>Mô tả:</Col>
                        <Col span={16}></Col>
                      </div>
                    </div>
                  </div>
                  <div id="kiem-thu-3" className="testcase-content">
                    <div className="form-horizontal" data="2">
                      <Row>
                        <Col span={8}>Đầu vào:</Col>
                        <Col span={16}>[8,9,4,8,9]</Col>
                      </Row>
                      <Row>
                        <Col span={8}>Đầu ra thực tế:</Col>
                        <Col span={16}></Col>
                      </Row>
                      <Row>
                        <Col span={8}>Đầu ra mong muốn:</Col>
                        <Col span={16}>3</Col>
                      </Row>
                      <Row>
                        <Col span={4}>Giới hạn thời gian:</Col>
                        <div
                          className="col-sm-8 control-label time-limit"
                          time="0.5"
                          style={{ textAlign: 'left' }}
                        >
                          4000 ms
                        </div>
                      </Row>
                      <Row>
                        <Col span={8}>Thời gian thực hiện:</Col>
                        <Col span={16}></Col>
                      </Row>
                      <Row>
                        <Col span={8}>Tin nhắn:</Col>
                        <Col span={16}>
                          <div id="txtRunContentMesseger_2"></div>
                        </Col>
                      </Row>
                      <div className="form-group hide">
                        <Col span={8}>Mô tả:</Col>
                        <Col span={16}></Col>
                      </div>
                    </div>
                  </div>
                  <div id="kiem-thu-4" className="testcase-content">
                    <div className="form-horizontal" data="3">
                      <Row>
                        <Col span={8}>Đầu vào:</Col>
                        <Col span={16}>[12,1,2,14,96,97,27,33,70,21]</Col>
                      </Row>
                      <Row>
                        <Col span={8}>Đầu ra thực tế:</Col>
                        <Col span={16}></Col>
                      </Row>
                      <Row>
                        <Col span={8}>Đầu ra mong muốn:</Col>
                        <Col span={16}>13</Col>
                      </Row>
                      <Row>
                        <Col span={4}>Giới hạn thời gian:</Col>
                        <div
                          className="col-sm-8 control-label time-limit"
                          time="0.5"
                          style={{ textAlign: 'left' }}
                        >
                          4000 ms
                        </div>
                      </Row>
                      <Row>
                        <Col span={8}>Thời gian thực hiện:</Col>
                        <Col span={16}></Col>
                      </Row>
                      <Row>
                        <Col span={8}>Tin nhắn:</Col>
                        <Col span={16}>
                          <div id="txtRunContentMesseger_3"></div>
                        </Col>
                      </Row>
                      <div className="form-group hide">
                        <Col span={8}>Mô tả:</Col>
                        <Col span={16}></Col>
                      </div>
                    </div>
                  </div>
                  <div id="kiem-thu-5" className="testcase-content">
                    <div className="form-horizontal" data="4">
                      <Row>
                        <Col span={8}>Đầu vào:</Col>
                        <Col span={16}>[51,61,76,56,99,98,86,28,92,33]</Col>
                      </Row>
                      <Row>
                        <Col span={8}>Đầu ra thực tế:</Col>
                        <Col span={16}></Col>
                      </Row>
                      <Row>
                        <Col span={8}>Đầu ra mong muốn:</Col>
                        <Col span={16}>22</Col>
                      </Row>
                      <Row>
                        <Col span={4}>Giới hạn thời gian:</Col>
                        <div
                          className="col-sm-8 control-label time-limit"
                          time="0.5"
                          style={{ textAlign: 'left' }}
                        >
                          4000 ms
                        </div>
                      </Row>
                      <Row>
                        <Col span={8}>Thời gian thực hiện:</Col>
                        <Col span={16}></Col>
                      </Row>
                      <Row>
                        <Col span={8}>Tin nhắn:</Col>
                        <Col span={16}>
                          <div id="txtRunContentMesseger_4"></div>
                        </Col>
                      </Row>
                      <div className="form-group hide">
                        <Col span={8}>Mô tả:</Col>
                        <Col span={16}></Col>
                      </div>
                    </div>
                  </div>
                  <div id="kiem-thu-6" className="case-hidden testcase-content">
                    <div className="form-horizontal" data="5">
                      Test case ẩn
                    </div>
                    <div className="form-horizontal" data="5">
                      Mô tả :
                    </div>
                  </div>
                  <div id="kiem-thu-7" className="case-hidden testcase-content">
                    <div className="form-horizontal" data="6">
                      Test case ẩn
                    </div>
                    <div className="form-horizontal" data="6">
                      Mô tả :
                    </div>
                  </div>
                  <div id="kiem-thu-8" className="case-hidden testcase-content">
                    <div className="form-horizontal" data="7">
                      Test case ẩn
                    </div>
                    <div className="form-horizontal" data="7">
                      Mô tả :
                    </div>
                  </div>
                  <div id="kiem-thu-9" className="case-hidden testcase-content">
                    <div className="form-horizontal" data="8">
                      Test case ẩn
                    </div>
                    <div className="form-horizontal" data="8">
                      Mô tả :
                    </div>
                  </div>
                  <div
                    id="kiem-thu-10"
                    className="case-hidden testcase-content"
                  >
                    <div className="form-horizontal" data="9">
                      Test case ẩn
                    </div>
                    <div className="form-horizontal" data="9">
                      Mô tả :
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

const tabPaneStyle = css`
  padding: 0 10px 10px 10px;
  height: calc(100vh - 102px);
`;

const layoutStyle = css`
  & .ant-row .ant-form-item {
    margin-bottom: 10px;
  }
`;
