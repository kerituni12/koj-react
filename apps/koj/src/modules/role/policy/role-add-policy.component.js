import React, { useState } from 'react';
import { Card, Table, Form, Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { useDispatch, useSelector } from 'react-redux';
import PolicyEditTableCell from './policy-table-cell.component';
import { getPolicyColumns } from './policy-column.config';
import { policyAction } from '../redux/policy.slice';
import { toast } from 'react-toastify';

const PolicyResource = ({ currentResource }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const policies$ = useSelector(
    ({ role }) => role.policy?.policies?.[currentResource] || []
  );

  const [editingKey, setEditingKey] = useState('');
  const [isEditingFromCreate, setIsEditingFromCreate] = useState(false);

  const isEditing = (record) => record.id === editingKey;

  const addPolicy = () => {
    const id = policies$?.length ? policies$[0]?.id + 'z' : 'z';

    const policy = {
      id: id,
      object: currentResource,
      condition: '',
      action: 'read',
      effect: 'allow',
      effectWith: 'own',
    };

    form.setFieldsValue({
      ...policy,
      effect: policy.effect === 'allow' ? false : true,
    });

    dispatch(
      policyAction.addPolicy({ resource: currentResource, policy: policy })
    );
    setEditingKey(policy.id);
    setIsEditingFromCreate(true);
  };

  const editPolicy = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancelPolicy = () => {
    setEditingKey('');
    setIsEditingFromCreate(false);
  };

  const removePolicy = (record) => {
    cancelPolicy();
    dispatch(
      policyAction.removePolicy({ resource: currentResource, id: record.id })
    );
  };

  const savePolicy = async (id) => {
    try {
      const row = await form.validateFields();
      row.id = id;
      row.effect = row.effect ? 'deny' : 'allow';
      dispatch(
        policyAction.updatePolicy({ resource: currentResource, policy: row })
      );
      setEditingKey('');
    } catch (error) {
      toast.error(error.message, { toastId: 'savePolicy' });
    }
  };

  const columns = getPolicyColumns({
    isEditing,
    editingKey,
    editPolicy,
    cancelPolicy,
    removePolicy,
    savePolicy,
    isEditingFromCreate,
  });

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Card
      size="small"
      title={<Typography.Title level={4}>Policy</Typography.Title>}
      extra={
        <Button
          size="small"
          disabled={editingKey !== ''}
          onClick={addPolicy}
          type="primary"
          shape="circle"
        >
          <PlusOutlined />
        </Button>
      }
      bodyStyle={{
        height: `calc(100vh - 100px - 20px - 48px  - 45px)`,
      }}
    >
      <PerfectScrollbar>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: PolicyEditTableCell,
              },
            }}
            pagination={false}
            size="small"
            dataSource={policies$}
            columns={mergedColumns}
            rowClassName="editable-row"
            rowKey={(record) => record.id}
          />
        </Form>
      </PerfectScrollbar>
    </Card>
  );
};

export default PolicyResource;
