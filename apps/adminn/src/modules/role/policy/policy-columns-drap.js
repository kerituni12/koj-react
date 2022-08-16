import React, { useEffect, useState } from 'react';
import { Card, Table, Form, Typography, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useMutation, useQuery } from '@apollo/client';
import { getPolicyByRoleResource } from '../graphql/policy.query';
import { addPolicyMutation } from '../graphql/policy.mutation';
import { toast } from 'react-toastify';
import PolicyEditTableCell from './policy-table-cell.component';
import { getPolicyColumn } from './policy-column.config';

const originData = [];

for (let i = 0; i < 10; i++) {
  originData.push({
    id: i.toString(),
    condition: `r.user.active == true`,
    action: Math.random() < 0.5 ? 'read' : 'write',
    effect: Math.random() < 0.5 ? 'allow' : 'deny',
    effectWith: Math.random() < 0.5 ? 'own' : 'any',
  });
}

let editingKey = '';
let isEditingFromCreate = false;
const RoleEditPolicy = ({ currentResource, roleId }) => {
  console.log('role edit');
  const [form] = Form.useForm();
  const [policies, setPolices] = useState([]);
  // const [editingKey, setEditingKey] = useState('');
  // const [isEditingFromCreate, setIsEditingFromCreate] = useState(false);
  const [, policyResult] = useMutation(addPolicyMutation);

  const { loading, error } = useQuery(getPolicyByRoleResource, {
    variables: {
      where: {
        resource: currentResource,
        roleId,
      },
    },
    onCompleted: (data) => setPolices(data.z_policyByRoleResource),
  });
  useEffect(() => {
    console.log('Run something');
  }, []);

  const forceUpdate = React.useState()[1].bind(null, {});
  const isEditing = (record) => record.id === editingKey;
  const getEditingKey = () => editingKey;
  const getIsEditingFromCreate = () => isEditingFromCreate;

  const handleAdd = async () => {
    const id = policies?.length ? policies[0]?.id + 'z' : 'z';
    const policy = {
      id: id,
      condition: '',
      action: 'read',
      effect: 'allow',
      effectWith: 'own',
    };
    form.setFieldsValue({
      ...policy,
    });
    // await setEditingKey(policy.id);
    // setIsEditingFromCreate(true);
    editingKey = policy.id;
    isEditingFromCreate = true;
    setPolices((prePolicy) => {
      return [policy, ...prePolicy];
    });
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    // setEditingKey(record.id);
    editingKey = record.id;
  };

  const handleCancel = () => {
    // setEditingKey('');
    editingKey = '';
    forceUpdate();
  };

  const handleDelete = (record) => {
    setPolices((prePolicy) => {
      // setEditingKey('');
      // setIsEditingFromCreate(false);
      editingKey = '';
      isEditingFromCreate = false;
      const tmp = prePolicy.filter((data) => data.id !== record.id);
      return tmp;
    });
  };

  const handleSave = async (id) => {
    try {
      const row = await form.validateFields();
      row.id = id;
      row.effect = row.effect ? 'deny' : 'allow';
      // await addPolicyGql({
      //   variables: {
      //     data: {
      //       object: currentResource,
      //       action: 'read',
      //       effect: `allow`,
      //       effectWith: 'own',
      //       condition: '',
      //     },
      //   },
      // });

      const newData = [...policies];
      const index = newData.findIndex((item) => id === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
      } else {
        newData.push(row);
      }
      // setEditingKey('');
      editingKey = '';
      setPolices(newData);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = getPolicyColumn({
    getEditingKey,
    isEditing,
    getIsEditingFromCreate,
    handleEdit,
    handleCancel,
    handleDelete,
    handleSave,
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
  if (policyResult.error) {
    toast.error(policyResult.error.message, { toastId: 'addPolicyMutation' });
    policyResult.reset();
  }

  if (error) {
    toast.error(error.message, { toastId: 'getPolicyByRoleResource' });
  }

  if (loading)
    return (
      <div className="center-screen">
        <Spin size="large" />
      </div>
    );

  if (!columns) return <h1>loading</h1>;
  return (
    <Card
      size="small"
      title={<Typography.Title level={4}>Policy</Typography.Title>}
      extra={
        <Button
          size="small"
          disabled={editingKey !== ''}
          onClick={handleAdd}
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
            dataSource={policies}
            columns={mergedColumns}
            rowClassName="editable-row"
            rowKey={(record) => record.id}
          />
        </Form>
      </PerfectScrollbar>
    </Card>
  );
};

export default RoleEditPolicy;
