import {
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/css';
import {
  Button,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { useRef } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { paramTypeOptions } from '../configs/input-type.config';
import { tabPaneStyle } from '../styles/challenge.style';

function ObjectConfig({ form }) {
  const scrollRef = useRef();

  function scrollTop() {
    const curr = scrollRef.current;
    if (curr) {
      curr.scroll(0, 0);
    }
  }

  return (
    <PerfectScrollbar containerRef={(el) => (scrollRef.current = el)}>
      <Content className={tabPaneStyle}>
        <Collapse className={collapseStyle} accordion defaultActiveKey={['1']}>
          <Collapse.Panel header="Dau ra" key="1">
            <Row>
              <Col span={24}>
                <Form.Item name="output">
                  <Select
                    style={{ width: '100%' }}
                    //   onChange={handleChange}
                    tokenSeparators={[',']}
                    options={paramTypeOptions}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider
                          style={{
                            margin: '8px 0',
                          }}
                        />
                        <div className={selectAddItemStyle}>
                          <Input
                            placeholder="Please enter item"
                            style={{ width: '100%' }}
                          />
                          <Typography.Link
                            onClick={() => console.log('add item')}
                            style={{
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <PlusOutlined /> Add item
                          </Typography.Link>
                        </div>
                      </>
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Collapse.Panel>
          <Collapse.Panel header="Cấu hình cho test case ngẫu nhiên" key="2">
            <Form.List
              name="inputs"
              // initialValue={[{ name: '', type: '' }]}
            >
              {(inputs, { add, remove }) => {
                return (
                  <>
                    {inputs.length === 0 && (
                      <Col span={24}>
                        <div className={headerStyle}>
                          <b>Đầu vào</b>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={() => {
                              add(
                                {
                                  name: `input${inputs.length + 1}`,
                                  type: 'INTEGER',
                                },
                                0
                              );
                              scrollTop();
                            }}
                            style={{ padding: '4px 0' }}
                          >
                            Thêm đầu vào
                          </Button>
                        </div>
                      </Col>
                    )}
                    {inputs.map((input, index) => (
                      <Row
                        gutter={16}
                        key={input.name}
                        style={{ paddingBottom: 13 }}
                      >
                        <Col span={24}>
                          <div className={headerStyle}>
                            <b>Đầu vào {Number(inputs.length - input.name)}</b>
                            <Space>
                              <Button
                                type="link"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                  add(
                                    {
                                      name: `input${inputs.length + 1}`,
                                      type: 'INTEGER',
                                    },
                                    0
                                  );
                                  scrollTop();
                                }}
                                style={{ padding: '4px 0' }}
                              >
                                Thêm đầu vào
                              </Button>

                              <Button
                                type="link"
                                icon={<DeleteOutlined />}
                                danger
                                onClick={() => remove(input.name)}
                              />
                            </Space>
                          </div>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            label="Tên tham số"
                            name={[input.name, 'name']}
                            required
                            tooltip="This is a required field"
                          >
                            <Input placeholder="input placeholder" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Kiểu dữ liệu"
                            name={[input.name, 'type']}
                            tooltip={{
                              title: 'Tooltip with customize icon',
                              icon: <InfoCircleOutlined />,
                            }}
                          >
                            <Select
                              style={{ width: '100%' }}
                              //   onChange={handleChange}
                              options={paramTypeOptions}
                              dropdownRender={(menu) => (
                                <>
                                  {menu}
                                  <Divider
                                    style={{
                                      margin: '8px 0',
                                    }}
                                  />
                                  <div className={selectAddItemStyle}>
                                    <Input
                                      placeholder="Please enter item"
                                      style={{ width: '100%' }}
                                    />
                                    <Typography.Link
                                      onClick={() => console.log('add item')}
                                      style={{
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      <PlusOutlined /> Add item
                                    </Typography.Link>
                                  </div>
                                </>
                              )}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                  </>
                );
              }}
            </Form.List>
          </Collapse.Panel>
          <Collapse.Panel header="Cấu hình cho test case ngẫu nhiên" key="3">
            <Form.List
              name="inputs"
              // initialValue={[{ name: '', type: '' }]}
            >
              {(inputs, { add, remove }) => {
                return (
                  <>
                    {inputs.length === 0 && (
                      <Col span={24}>
                        <div className={headerStyle}>
                          <b>Đầu vào</b>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={() => {
                              add(
                                {
                                  name: `input${inputs.length + 1}`,
                                  type: 'INTEGER',
                                },
                                0
                              );
                              scrollTop();
                            }}
                            style={{ padding: '4px 0' }}
                          >
                            Thêm đầu vào
                          </Button>
                        </div>
                      </Col>
                    )}
                    {inputs.map((input, index) => (
                      <Row
                        gutter={16}
                        key={input.name}
                        style={{ paddingBottom: 13 }}
                      >
                        <Col span={24}>
                          <div className={headerStyle}>
                            <b>Đầu vào {Number(inputs.length - input.name)}</b>
                            <Space>
                              <Button
                                type="link"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                  add(
                                    {
                                      name: `input${inputs.length + 1}`,
                                      type: 'INTEGER',
                                    },
                                    0
                                  );
                                  scrollTop();
                                }}
                                style={{ padding: '4px 0' }}
                              >
                                Thêm đầu vào
                              </Button>

                              <Button
                                type="link"
                                icon={<DeleteOutlined />}
                                danger
                                onClick={() => remove(input.name)}
                              />
                            </Space>
                          </div>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            label="Tên tham số"
                            name={[input.name, 'name']}
                            required
                            tooltip="This is a required field"
                          >
                            <Input placeholder="input placeholder" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Kiểu dữ liệu"
                            name={[input.name, 'type']}
                            tooltip={{
                              title: 'Tooltip with customize icon',
                              icon: <InfoCircleOutlined />,
                            }}
                          >
                            <Select
                              style={{ width: '100%' }}
                              //   onChange={handleChange}
                              options={paramTypeOptions}
                              dropdownRender={(menu) => (
                                <>
                                  {menu}
                                  <Divider
                                    style={{
                                      margin: '8px 0',
                                    }}
                                  />
                                  <div className={selectAddItemStyle}>
                                    <Input
                                      placeholder="Please enter item"
                                      style={{ width: '100%' }}
                                    />
                                    <Typography.Link
                                      onClick={() => console.log('add item')}
                                      style={{
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      <PlusOutlined /> Add item
                                    </Typography.Link>
                                  </div>
                                </>
                              )}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                  </>
                );
              }}
            </Form.List>
          </Collapse.Panel>
        </Collapse>
      </Content>
    </PerfectScrollbar>
  );
}

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
`;

const collapseStyle = css`
  & > .ant-collapse-item > .ant-collapse-header {
    padding: 5px 10px;
  }
`;

const selectAddItemStyle = css`
  padding: 0 8px 4px;
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export default ObjectConfig;
