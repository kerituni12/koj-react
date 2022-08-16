import { useSelector } from 'react-redux';

import { checkPermission } from '@/utils/permission';
import Forbidden from '@/components/forbidden.component';
import { eqSet } from '@/utils/set';

// export function PermissionRoute({ permissions, element }) {
//   const userPermissions = useSelector(
//     ({ user }) => user?.user?.permissions,
//     eqSet
//   );

//   const checkPermissionResult = checkPermission(permissions, userPermissions);
//   return checkPermissionResult ? element : <Forbidden />;
// }

export function PermissionRoute({ permissions, element }) {
  return element;
}
