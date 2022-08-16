import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

const ChallengeCreate = lazy(() =>
  import(
    /* webpackChunkName: "challenge.create" */ '@/modules/challenge/views/challenge-create-dashboard.view'
  )
);
const ChallengeEdit = lazy(() =>
  import(
    /* webpackChunkName: "challenge.create" */ '@/modules/challenge/views/challenge-edit.view'
  )
);
const ChallengeList = lazy(() =>
  import(
    /* webpackChunkName: "challenge.list" */ '@/modules/challenge/views/challenge-list.view'
  )
);

const routeList = [
  { path: '/create', element: <ChallengeCreate /> },
  { path: '/edit/:slug', element: <ChallengeEdit /> },
  { path: '/list', element: <ChallengeList /> },
  // { path: '/view', element: <challengeView /> },
];

const FileManagerRouter = () => {
  const element = useRoutes(routeList);
  return element;
};

export default FileManagerRouter;
