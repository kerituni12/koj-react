import { gql } from '@apollo/client';

export const policyResultFragment = gql`
  fragment PolicyResult on Policy {
    id
    effect
    object
    action
    condition
    effectWith
  }
`;

export const addPolicyMutation = gql`
  mutation CreatePolicy($data: PolicyCreateInput!) {
    policy {
      createPolicy(data: $data) {
        ...PolicyResult
      }
    }
  }
  ${policyResultFragment}
`;

export const removePolicyMutation = gql`
  mutation RemovePolicy($where: PolicyWhereUniqueInput!) {
    policy {
      removePolicy(where: $where) {
        ...PolicyResult
      }
    }
  }
  ${policyResultFragment}
`;
