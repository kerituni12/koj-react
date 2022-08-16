export function checkPermission(permissions, userPermissions) {
  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }

  return permissions.some((permission) => userPermissions?.has(permission));
}
