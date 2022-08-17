import { lazy } from 'react';
import { Provider } from 'react-redux';
import { Link, useRoutes } from 'react-router-dom';
import store from '@koj-react/editor-lib/Redux/store';

import RoleRouter from '@/modules/role/role.route';
import UserRouter from '@/modules/user/user.route';
import RoleList from '@/modules/role/views/role-list.view';
import GroupRouter from '@/modules/group/group.route';
import LayoutDashboard from '@/components/layout-dashboard.component';
import NotFoundPage from '@/components/not-found.component';
// import GroupRouter from '@/modules/group/group.route';
import ChallengeRoute from '@/modules/challenge/challenge.route';
import FileManagerRoute from '@/modules/file-manager/file-manager.route';
import ChallengeView from '@/modules/challenge/views/challenge.view';
import ReactMarkdowTest from './react-markdown';
import AuthRoute from './auth-route.component';
import { Test } from './test';
import HomePage from '@/modules/app/views/homepage.view';

// import ChallengeRoute from '@/modules/challenge/problem.route';

const SignInView = lazy(() =>
  import(/* webpackChunkName: "with-aside" */ '@/modules/auth/signin.view')
);

const SignUpView = lazy(() =>
  import(/* webpackChunkName: "with-aside" */ '@/modules/auth/signup.view')
);
const UserList = lazy(() =>
  import(/* webpackChunkName: "with-tabs" */ '@/modules/user/user-list.view')
);

const Challenges = lazy(() =>
  import(
    /* webpackChunkName: "challenge.list" */ '@/modules/challenge/views/challenges.view'
  )
);

const routeList = [
  // { path: '/', element: <HomePage /> },
  {
    path: '/signin',
    element: <SignInView />,
  },
  {
    path: '/signup',
    element: <SignUpView />,
  },
  // {
  //   path: '/user',
  //   element: <AuthRoute element={<UserList />} titleId="title.login" />,
  // },
  // {
  //   path: '/challenge',
  //   element: <Challenges />,
  //   children: [{ path: ':slug', element: <ChallengeView /> }],
  // },
  // {
  //   path: '/react-markdown',
  //   element: <ReactMarkdowTest />,
  // },
  // {
  //   path: '/test',
  //   element: <Test />,
  // },
  {
    path: '/',
    element: <AuthRoute element={<LayoutDashboard />} />,
    children: [
      { path: 'user/*', element: <UserRouter /> },
      { path: 'role/*', element: <RoleRouter /> },
      { path: 'group/*', element: <GroupRouter /> },
      {
        path: 'challenge/*',
        element: (
          <Provider store={store}>
            <ChallengeRoute />
          </Provider>
        ),
      },
      {
        path: 'file-manager/*',
        element: (
          <Provider store={store}>
            <FileManagerRoute />
          </Provider>
        ),
      },
    ],
  },
  {
    path: '/d',
    element: <LayoutDashboard />,
    children: [
      { path: 'user/', element: <UserList /> },
      { path: 'role/edit', element: <RoleList /> },
      { path: 'role/create', element: <RoleList /> },
      { path: 'role/list', element: <RoleList /> },
      {
        path: 'challenge/*',
        element: (
          <Provider store={store}>
            <ChallengeRoute />
          </Provider>
        ),
      },
      {
        path: 'file-manager/*',
        element: (
          <Provider store={store}>
            <FileManagerRoute />
          </Provider>
        ),
      },
    ],
  },
  {
    path: '/ckeditor',
    // element: <CkeditorDemo />,
  },
  {
    path: '/',
    element: <Link to="/dashboard">Go to user</Link>,
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
];

const RenderRouter = () => {
  const element = useRoutes(routeList);

  return element;
};

export default RenderRouter;
