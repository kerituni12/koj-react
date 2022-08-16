import { useLocation, useParams } from 'react-router-dom';

export const useBasePath = (key) => {
  const location = useLocation();
  const params = useParams();

  return location.pathname.replace('/' + params[`${key}`], '');
};
