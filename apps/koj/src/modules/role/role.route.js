import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

import { PermissionRoute } from '@/routes/permission-route.component';
import withReducer from '@/store/withReducer';

import roleReducer from './redux/role.reducer';

const NotFoundPage = lazy(() =>
  import(
    /* webpackChunkName: "notfound.component" */ '@/components/not-found.component'
  )
);
const RoleList = lazy(() =>
  import(/* webpackChunkName: "role.list" */ './views/role-list.view')
);
const RoleAdd = lazy(() =>
  import(/* webpackChunkName: "role.list" */ './views/role-add.view')
);
const RoleEdit = lazy(() =>
  import(/* webpackChunkName: "role.list" */ './views/role-edit.view')
);
const routeList = [
  {
    path: '/list',
    element: <PermissionRoute element={<RoleList />} permissions="role.read" />,
  },
  {
    path: '/create',
    element: (
      <PermissionRoute element={<RoleAdd />} permissions="role.create" />
    ),
  },
  {
    path: '/edit',
    element: <PermissionRoute element={<RoleEdit />} permissions="role.edit" />,
  },
];

const RoleRouter = () => {
  const element = useRoutes(routeList);

  return element;
};

export default withReducer('role', roleReducer)(RoleRouter);
