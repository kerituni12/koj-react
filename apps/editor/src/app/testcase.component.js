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
} from 'antd';

const tagOptions = [];
for (let i = 10; i < 36; i++) {
  tagOptions.push(
    <Select.Option key={i.toString(36) + i}>{i.toString(36) + i}</Select.Option>
  );
}
function Testcase() {
  function handleAdd() {
    console.log('handleAdd');
  }
  return (
    <div style={{ overflow: 'initial' }}>
      <Row>
        <div className={headerStyle}>
          <b>Đầu ra</b>
        </div>

        <Col span={24}>
          <Form.Item>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              //   onChange={handleChange}
              tokenSeparators={[',']}
            >
              {tagOptions}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <hr style={{ marginTop: '2px', width: '30px' }} />
      <Form.List name="testcases">
        {(testcases, { add, remove }) => {
          add();
          return testcases.map((testcase, index) => (
            <Row gutter={16}>
              <Col span={24}>
                <div className={headerStyle}>
                  <b>Đầu vào 1</b>
                  <Space>
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      style={{ padding: '4px 0' }}
                    >
                      Thêm đầu vào
                    </Button>
                    <Button type="link" icon={<DeleteOutlined />} danger />
                  </Space>
                </div>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Tên tham số"
                  name={[testcase.name, 'name']}
                  required
                  tooltip="This is a required field"
                >
                  <Input placeholder="input placeholder" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Kiểu dữ liệu"
                  name={[testcase.name, 'type']}
                  tooltip={{
                    title: 'Tooltip with customize icon',
                    icon: <InfoCircleOutlined />,
                  }}
                >
                  <Input placeholder="input placeholder" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Collapse defaultActiveKey={['1']} className={collapseStyle}>
                  <Collapse.Panel
                    header="Cấu hình cho test case ngẫu nhiên"
                    key="1"
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Tên tham số"
                          name={[testcase.name, 'testcaseConfig', 'name']}
                          required
                          tooltip="This is a required field"
                        >
                          <Input placeholder="input placeholder" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Kiểu dữ liệu"
                          name={[testcase.name, 'testcaseConfig', 'name']}
                          tooltip={{
                            title: 'Tooltip with customize icon',
                            icon: <InfoCircleOutlined />,
                          }}
                        >
                          <Input placeholder="input placeholder" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Collapse.Panel>
                </Collapse>
              </Col>
            </Row>
          ));
        }}
      </Form.List>
    </div>
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

export default Testcase;
