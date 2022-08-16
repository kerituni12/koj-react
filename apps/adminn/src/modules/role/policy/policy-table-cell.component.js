import { Form, Input, Select, Switch } from 'antd';
import { policyOptions } from './policy-options.config';

const PolicyEditTableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let Cell;
  switch (dataIndex) {
    case 'action':
      Cell = (
        <Form.Item
          name={dataIndex}
          initialValue={record.action}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${dataIndex}!`,
            },
          ]}
        >
          <Select
            options={policyOptions.action}
            style={{ width: '100%' }}
            disabled={!editing}
          />
        </Form.Item>
      );
      break;
    case 'effectWith':
      Cell = (
        <Form.Item
          name={dataIndex}
          initialValue={record.effectWith}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${dataIndex}!`,
            },
          ]}
        >
          <Select
            options={policyOptions.effectWith}
            style={{ width: '100%' }}
            disabled={!editing}
          />
        </Form.Item>
      );
      break;
    case 'effect':
      Cell = (
        <Form.Item
          name={dataIndex}
          initialValue={record.effect === 'deny' ? true : false}
          style={{
            margin: 0,
          }}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      );
      break;
    case 'condition':
      Cell = (
        <Form.Item
          name={dataIndex}
          initialValue={record.condition}
          style={{
            margin: 0,
          }}
          rules={[
            {
              max: 50,
              message: `Linit with 50 character`,
            },
          ]}
        >
          <Input />
        </Form.Item>
      );
      break;
    default:
      children;
  }

  return <td {...restProps}>{editing ? Cell : children}</td>;
};

export default PolicyEditTableCell;
