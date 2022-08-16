import { gql } from '@apollo/client';
import { challengeBaseFragment } from './challenge-base.fragment';

export const addChallengeMutation = gql`
  mutation Challenge($data: ChallengeCreateInput!) {
    challenge {
      createChallenge(data: $data) {
        ...ChallengeBase
      }
    }
  }
  ${challengeBaseFragment}
`;

export const editChallengeMutation = gql`
  mutation UpdateChallenge(
    $data: ChallengeUpdateInput!
    $where: KChallengeWhereUniqueInput!
  ) {
    challenge {
      updateChallenge(data: $data, where: $where) {
        ...ChallengeBase
      }
    }
  }
  ${challengeBaseFragment}
`;

export const submitChallengeMutation = gql`
  mutation SubmitChallenge($data: ChallengeSubmitInput!) {
    challenge {
      submitChallenge(data: $data) {
        result {
          errorMessage
          expectedOutput
          message
          hidden
          log
          memory
          output
          result
          time
        }
        error
      }
    }
  }
`;

export const runTestChallengeMutation = gql`
  mutation SubmitChallenge($data: ChallengeSubmitInput!) {
    challenge {
      submitChallenge(data: $data) {
        error
        result {
          errorMessage
          expectedOutput
          message
          hidden
          log
          memory
          output
          result
          time
        }
        info {
          score
          testcaseCount
          testcasePassCount
          totalScore
        }
      }
    }
  }
`;
