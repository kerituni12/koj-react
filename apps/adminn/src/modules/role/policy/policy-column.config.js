import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Select, Space, Switch, Typography } from 'antd';
import { policyOptions } from './policy-options.config';

export function getPolicyColumns({
  isEditing,
  editingKey,
  editPolicy,
  cancelPolicy,
  removePolicy,
  savePolicy,
  isEditingFromCreate,
}) {
  return [
    {
      title: 'Action',
      dataIndex: 'action',
      width: '25%',
      editable: true,
      render: (action) => {
        return (
          <Select
            defaultValue={action}
            options={policyOptions.action}
            style={{ width: '100%' }}
            disabled={true}
          />
        );
      },
    },
    {
      title: 'Effect With',
      dataIndex: 'effectWith',
      width: '25%',
      editable: true,
      render: (action) => {
        return (
          <Select
            defaultValue={action}
            options={policyOptions.effectWith}
            style={{ width: '100%' }}
            disabled={true}
          />
        );
      },
    },
    {
      title: 'Deny',
      dataIndex: 'effect',
      width: '10%',
      align: 'center',
      editable: true,
      render: (effect) => {
        return (
          <Switch
            disabled={true}
            defaultChecked={effect === 'deny' ? true : false}
          />
        );
      },
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      width: '25%',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => savePolicy(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={() =>
                isEditingFromCreate
                  ? removePolicy(record)
                  : cancelPolicy(record)
              }
            >
              <a>{isEditingFromCreate ? 'Delete' : 'Cancel'}</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Space size={'middle'}>
              <Typography.Link
                disabled={editingKey !== ''}
                onClick={() => editPolicy(record)}
              >
                <EditOutlined />
              </Typography.Link>
              <Typography.Link
                disabled={editingKey !== ''}
                onClick={() => removePolicy(record)}
              >
                <DeleteOutlined />
              </Typography.Link>
            </Space>
          </>
        );
      },
    },
  ];
}
