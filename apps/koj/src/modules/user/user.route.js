import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

import withReducer from '@/store/withReducer';

import userReducer from './user.reducer';
import { PermissionRoute } from '@/routes/permission-route.component';

const NotFoundPage = lazy(() =>
  import(
    /* webpackChunkName: "notfound.component" */ '@/components/not-found.component'
  )
);
const UserList = lazy(() =>
  import(/* webpackChunkName: "user.list" */ './user-list.view')
);

const routeList = [
  { path: '/create', element: <NotFoundPage /> },
  {
    path: '/list',
    element: <PermissionRoute permissons="user.read" element={<UserList />} />,
  },
];

const UserRouter = () => {
  const element = useRoutes(routeList);

  return element;
};

export default withReducer('user', userReducer)(UserRouter);
