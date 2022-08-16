import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

const GroupList = lazy(() =>
  import(/* webpackChunkName: "user.list" */ './group-list.view')
);
const routeList = [{ path: '/list', element: <GroupList /> }];

const GroupRouter = () => {
  const element = useRoutes(routeList);

  return element;
};

export default GroupRouter;
