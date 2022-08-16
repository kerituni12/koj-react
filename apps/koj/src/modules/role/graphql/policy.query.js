import { gql } from '@apollo/client';

export const getPolicyByRoleResource = gql`
  query Query($where: PolicyFindByRoleResourceInput!) {
    z_policyByRoleResource(where: $where) {
      id
      effect
      object
      action
      condition
      effectWith
    }
  }
`;
