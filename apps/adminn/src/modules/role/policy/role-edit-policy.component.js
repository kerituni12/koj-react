import { toast } from 'react-toastify';
import { useImmerReducer } from 'use-immer';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Card, Table, Form, Typography, Button } from 'antd';

import {
  addPolicyMutation,
  policyResultFragment,
  removePolicyMutation,
} from '../graphql/policy.mutation';

import ErrorFallback from '@/components/error-fallback.component';

import { getPolicyColumns } from './policy-column.config';
import PolicyEditTableCell from './policy-table-cell.component';
import { getPolicyByRoleResource } from '../graphql/policy.query';
import { policyInitialState, policyReducer } from './policy.reducer';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

const RoleEditPolicy = ({ currentResource, roleId, roleKey }) => {
  console.log('role edit');

  const [form] = Form.useForm();
  const [policyState, policyDispatch] = useImmerReducer(
    policyReducer,
    policyInitialState
  );

  const [addPolicyGql] = useMutation(addPolicyMutation, {
    ignoreResults: true,
  });
  const [removePolicyGql] = useMutation(removePolicyMutation, {
    ignoreResults: true,
  });

  const { loading, error: queryError } = useQuery(getPolicyByRoleResource, {
    variables: {
      where: {
        resource: currentResource,
        roleId,
      },
    },
    onCompleted: (data) =>
      policyDispatch({
        type: 'setPolicy',
        payload: {
          policy: data.z_policyByRoleResource,
        },
      }),
  });

  if (queryError) {
    return <ErrorFallback error={queryError} />;
  }

  const isEditing = (record) => record.id === policyState.editingKey;

  const addPolicy = () => {
    const id = policyState.policies?.length
      ? policyState.policies[0]?.id + 'z'
      : 'z';
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

    policyDispatch({ type: 'addPolicy', payload: { policy } });
  };

  const editPolicy = (record) => {
    form.setFieldsValue({
      ...record,
      effect: record.effect === 'allow' ? false : true,
    });
    policyDispatch({ type: 'editPolicy', payload: { policy: record } });
  };

  const cancelPolicy = () => {
    policyDispatch({ type: 'resetEditingState' });
  };

  const removePolicy = async (record) => {
    try {
      if (!policyState.isEditingFromCreate) {
        await removePolicyGql({
          variables: {
            where: {
              id: Number(record.id),
            },
          },
          update(cache) {
            cache.modify({
              fields: {
                z_policyByRoleResource(existingPolicies = [], { readField }) {
                  return existingPolicies.filter(
                    (policyRef) => record.id !== readField('id', policyRef)
                  );
                },
              },
            });
          },
        });
      }
      policyDispatch({ type: 'removePolicy', payload: { policy: record } });
    } catch (error) {
      toast.error(error.message, { toastId: 'removePolicy' });
    }
  };

  const savePolicy = async () => {
    try {
      const row = await form.validateFields();
      row.effect = row.effect ? 'deny' : 'allow';
      await addPolicyGql({
        variables: {
          data: {
            subject: roleKey,
            object: currentResource,
            action: row.action,
            effect: row.effect,
            effectWith: row.effectWith,
            condition: row.condition,
          },
        },
        update(cache, { data }) {
          cache.modify({
            fields: {
              z_policyByRoleResource(existingPolicies = []) {
                const policyRef = cache.writeFragment({
                  data: data.policy.createPolicy,
                  fragment: policyResultFragment,
                });
                return [policyRef, ...existingPolicies];
              },
            },
          });
        },
        onCompleted() {
          policyDispatch({
            type: 'resetEditingState',
          });
          toast.success('Add policy success', { toastId: 'addPolicySuccess' });
        },
      });
    } catch (error) {
      toast.error(error.message, { toastId: 'savePolicy' });
    }
  };

  const columns = getPolicyColumns({
    isEditing,
    editingKey: policyState.editingKey,
    editPolicy,
    cancelPolicy,
    removePolicy,
    savePolicy,
    isEditingFromCreate: policyState.isEditingFromCreate,
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
          disabled={policyState.editingKey !== ''}
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
            loading={loading}
            pagination={false}
            size="small"
            dataSource={policyState.policies}
            columns={mergedColumns}
            rowClassName="editable-row"
            rowKey={(record) => record.id}
          />
        </Form>
      </PerfectScrollbar>
    </Card>
  );
};

export default memo(RoleEditPolicy);
