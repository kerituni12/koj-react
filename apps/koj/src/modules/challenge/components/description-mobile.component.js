import { CKEditor } from '@ckeditor/ckeditor5-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { StickyContainer, Sticky } from 'react-sticky';

import { Tabs, Input, Form, Row, Col, Select, Button, Layout } from 'antd';
import { InfoCircleOutlined, RedoOutlined } from '@ant-design/icons/lib/icons';

import KojModal from '../Modal';
import KojEditor from '../editor';

import { Editor as ClassicEditor } from '@koj-react/ckeditor';
import { Emitter } from '@koj-react/emitter';
import { html } from '@/utils/format-search';
import { lazy, useEffect, useRef, useState } from 'react';

const FileManager = lazy(() =>
  import(
    /* webpackChunkName: "file-manager.create" */ '@koj-react/editor-lib/FileManager/FileManager'
  )
);

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

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

function DescriptionMobile() {
  const ckeditor = useRef(null);

  const [data, setData] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  function showModal() {
    setIsModalVisible(true);
  }
  function handleCancel() {
    setIsModalVisible(false);
  }
  function handleData() {
    setData(ckeditor?.current?.getData());
  }
  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  useEffect(() => {
    Emitter.on('open_modal', (image) => showModal());
    Emitter.on('close_modal', (image) => setIsModalVisible(false));
    return () => {
      console.log('clear');
    };
  }, []);

  return (
    <>
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
                          <KojModal
                            isOpen={isModalVisible}
                            handleCancel={handleCancel}
                          >
                            {isModalVisible && (
                              <FileManager height={window.innerHeight - 140} />
                            )}
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
            <Button style={{ marginLeft: 'auto' }} icon={<RedoOutlined />}>
              Get data
            </Button>
            <br />
          </div>

          <div style={{ height: 500 }}>
            <KojEditor />
          </div>

          <div style={{ zIndex: 1 }}>hello</div>
        </div>
      </StickyContainer>
    </>
  );
}
export default DescriptionMobile;
