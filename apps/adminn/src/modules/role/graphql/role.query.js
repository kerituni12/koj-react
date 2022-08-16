import { gql } from '@apollo/client';

export const getRoleList = gql`
  query Roles {
    roles {
      id
      name
      key
      description
    }
  }
`;

export const getRoleById = gql`
  query Role($where: RoleWhereUniqueInput!) {
    role(where: $where) {
      id
      name
      key
      description
    }
  }
`;
