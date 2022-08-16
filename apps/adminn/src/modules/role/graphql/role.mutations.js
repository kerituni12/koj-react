import { gql } from '@apollo/client';

export const addRoleMutation = gql`
  mutation CreateRole($data: RoleCreateInput!) {
    role {
      createRole(data: $data) {
        id
        key
        name
      }
    }
  }
`;

export const updateRoleMutation = gql`
  mutation UpdateRole($data: RoleUpdateInput!, $where: RoleWhereUniqueInput!) {
    role {
      updateRole(data: $data, where: $where) {
        id
        key
        name
      }
    }
  }
`;
