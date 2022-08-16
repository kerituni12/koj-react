import { useSelector } from 'react-redux';

import Forbidden from '@/components/forbidden.component';
import { eqSet } from '@/utils/set';

const AuthRoute = (props) => {
  const userPermissions = useSelector(
    ({ user }) => user?.user?.permissions,
    eqSet
  );

  return userPermissions instanceof Set ? props.element : <Forbidden />;
};

export default AuthRoute;
