import { gql } from '@apollo/client';

export const getSubmissionByUser = gql`
  query Submissions_by_user(
    $where: SubmissionWhereInput
    $orderBy: [SubmissionOrderByWithRelationInput!]
  ) {
    submissions: submissions_by_user(where: $where, orderBy: $orderBy) {
      id
      info
      result
      content
      createdAt
      challengeId
      languageId
    }
  }
`;

export const getSubmissionRank = gql`
  query Submissions_rank($where: SubmissionStatisticWhereInput) {
    ranks: submissions_rank(where: $where) {
      challengeId
      createdByUsername
      id
      info
      languageId
      lastSubmitTime
      score
      submitCount
    }
  }
`;
