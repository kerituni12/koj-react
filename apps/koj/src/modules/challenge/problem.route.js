import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

const challenge = lazy(() =>
  import(/* webpackChunkName: "user.list" */ './challenge-create.view')
);
const challengeRoute = [{ path: '/create', element: <challenge /> }];

const challengeRoute = () => {
  const element = useRoutes(challengeRoute);

  return element;
};

export default challengeRoute;
