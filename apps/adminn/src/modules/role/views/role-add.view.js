import { css } from '@emotion/css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Button, Card, Col, Input, Row, Space, Spin, Typography } from 'antd';
import { resources } from '../tree.mock';
import PolicyResource from '../policy/role-add-policy.component';
import { Resource } from '../resource/resource.component';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { getRoleById } from '../graphql/role.query';
import ErrorFallback from '@/components/error-fallback.component';
import { useDispatch, useSelector } from 'react-redux';
import { checkPermission } from '@/utils/permission';
import Forbidden from '@/components/forbidden.component';
import { getPolicies, policyAction } from '../redux/policy.slice';
import { addRoleMutation } from '../graphql/role.mutations';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function RoleAdd() {
  const userPermissions = useSelector(({ user }) => user.user?.permissions);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const availableResources = useMemo(() => {
    return resources.filter((resource) =>
      checkPermission(resource.permissions, userPermissions)
    );
  }, [userPermissions]);

  const [role, setRole] = useState({ name: '' });
  const [currentResource, setCurrentResource] = useState(
    availableResources[0]?.key
  );

  const [addRoleGql, { reset }] = useMutation(addRoleMutation);

  function changeRoleName(event) {
    setRole({ name: event.target.value });
  }

  async function addRole() {
    if (!role.name) {
      toast.error('Must include role name', { toastId: 'addRole' });
      return;
    }

    try {
      let policies$ = [];
      const policyGroups = await dispatch(getPolicies()).unwrap();
      Object.entries(policyGroups).forEach(([key, policies]) => {
        policies.forEach((policy) => {
          const { id, ...policy$ } = policy;
          policies$.push(policy$);
        });
      });

      await addRoleGql({
        variables: {
          data: {
            name: role.name,
            policies: policies$,
          },
        },
        onCompleted({ role }) {
          console.log(
            '🚀 ~ file: role-add.view.js ~ line 64 ~ onCompleted ~ role',
            role
          );
          navigate('../edit', {
            state: {
              role: {
                name: role.createRole.name,
                id: role.createRole.id,
                key: role.createRole.key,
              },
            },
          });
          dispatch(policyAction.resetPolicy());
          toast.success('Create user success');
        },
      });
    } catch (error) {
      toast.error(error.message, { toastId: 'addRole' });
      reset();
    }
  }
  if (!currentResource) return <Forbidden />;

  return (
    <div className={roleStyle}>
      <div className="add-role">
        <Typography.Title level={3}>Add Role</Typography.Title>
        <Space direction="vertical" style={{ marginBottom: 10 }}>
          <Input placeholder="Basic usage" onChange={changeRoleName} />
        </Space>
        <div className="action">
          <Button type="primary" onClick={addRole}>
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
          <PolicyResource
            currentResource={currentResource}
            roleName={role.name}
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

export default RoleAdd;

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
