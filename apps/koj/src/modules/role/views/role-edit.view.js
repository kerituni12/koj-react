import { css } from '@emotion/css';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { memo, useMemo, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Input, Row, Space, Spin, Typography } from 'antd';

import ErrorFallback from '@/components/error-fallback.component';
import { checkPermission } from '@/utils/permission';
import Forbidden from '@/components/forbidden.component';
import NotFoundPage from '@/components/not-found.component';

import { resources } from '../tree.mock';
import { getRoleById } from '../graphql/role.query';
import { Resource } from '../resource/resource.component';
import { updateRoleMutation } from '../graphql/role.mutations';
import RoleEditPolicy from '../policy/role-edit-policy.component';

function getInitialRoleStateFromLocation({ state }) {
  return {
    name: state?.role?.name,
    id: state?.role?.id,
    key: state?.role?.key,
  };
}

function RoleEdit() {
  // Todo using ref for input
  const location = useLocation();
  const navigate = useNavigate();
  const [getRoleByIdGql, { loading, error }] = useLazyQuery(getRoleById);
  const [updateRoleGql, { reset }] = useMutation(updateRoleMutation);

  const userPermissions = useSelector(({ user }) => user.user?.permissions);
  const [role, setRole] = useState(getInitialRoleStateFromLocation(location));
  console.log('🚀 ~ file: role-edit.view.js ~ line 38 ~ RoleEdit ~ role', role);

  const availableResources = useMemo(() => {
    return resources.filter((resource) =>
      checkPermission(resource.permissions, userPermissions)
    );
  }, [userPermissions]);
  const [currentResource, setCurrentResource] = useState(
    availableResources[0]?.key
  );

  if (!role.id) return <NotFoundPage />;

  if (typeof role.name === 'undefined') {
    getRoleByIdGql({
      variables: {
        where: {
          id: Number(role.id),
        },
      },
      onCompleted({ role }) {
        setRole({ key: role.key, id: role.id, name: role.name });
      },
    });
  }

  function changeRole(event) {
    setRole({
      ...role,
      name: event.target.value,
    });
  }

  async function editRole() {
    if (!role.name) {
      toast.error('Must include role name', { toastId: 'editRole' });
      return;
    }

    try {
      await updateRoleGql({
        variables: {
          data: { name: role.name },
          where: {
            id: Number(role.id),
          },
        },
        ignoreResults: true,
      });
      toast.success('Update role succes', { toastId: 'editRoleSuccess' });
      navigate('./', { state: { role: { ...role, name: role.name } } });
    } catch (error) {
      toast.error(error.message, { toastId: 'editRoleFailed' });
      reset();
    }
  }

  if (error) return <ErrorFallback error={error} />;
  if (!currentResource) return <Forbidden />;
  if (loading)
    return (
      <div className="center-screen">
        <Spin size="large" />
      </div>
    );

  return (
    <div className={roleStyle}>
      <div className="add-role">
        <Typography.Title level={3}>Add Role</Typography.Title>
        <Space direction="vertical" style={{ marginBottom: 10 }}>
          <Input defaultValue={role.name} onChange={changeRole} />
        </Space>
        <div className="action">
          <Button type="primary" onClick={editRole}>
            Save
          </Button>
        </div>
      </div>

      <Row>
        <Col span={6}>
          <div className={resourceStyle}>
            <Card
              size="small"
              title={<Typography.Title level={4}>Resource</Typography.Title>}
              bodyStyle={{
                height: `calc(100vh - 100px - 20px - 48px  - 45px)`,
              }}
            >
              <PerfectScrollbar>
                <Resource
                  resources={availableResources}
                  setCurrentResource={setCurrentResource}
                  currentResource={currentResource}
                />
              </PerfectScrollbar>
            </Card>
          </div>
        </Col>
        <Col span={18}>
          <RoleEditPolicy
            currentResource={currentResource}
            roleId={role.id}
            roleKey={role.key}
          />
        </Col>
      </Row>
      {/* <Footer
        style={{
          textAlign: 'center',
          position: 'sticky',
          bottom: 0,
          height: 48,
          padding: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button danger> Cancel</Button>
        <Button type="primary">Save</Button>
      </Footer> */}
    </div>
  );
}

export default memo(RoleEdit);

const roleStyle = css`
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & .add-role {
    height: 100px;
  }
  & .action {
    float: right;
  }
  & .ant-row {
    height: 100%;
  }
`;
const resourceStyle = css`
  // & .ant-card-body {
  //   padding-right: 0;
  //   padding-bottom: 0;
  // }
`;
