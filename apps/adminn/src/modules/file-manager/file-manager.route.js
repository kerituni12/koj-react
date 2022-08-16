import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

const FileManager = lazy(() =>
  import(/* webpackChunkName: "file-manager.view" */ './file-manager.view')
);

const routeList = [
  { path: '/view', element: <FileManager /> },
  { path: '/create', element: <FileManager /> },
];

const FileManagerRouter = () => {
  const element = useRoutes(routeList);
  return element;
};

export default FileManagerRouter;
