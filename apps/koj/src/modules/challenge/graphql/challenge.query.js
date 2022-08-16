import { gql } from '@apollo/client';
import { challengeBaseFragment } from './challenge-base.fragment';

export const getChallengeList = gql`
  query Challenges {
    challenges {
      id
      slug
      title
      status
      audience
      createdAt
      categoryId
      difficulty
      createdByName
      createdByUsername

      # hint
      # rate
      # likes
      # dislikes
      # examples
      # contestId
      # updatedAt
      # isFavorited
      # codeSnippets
      # commentCount
      # contributors
      # officalSolutionCount
      # highlightSolutionCount
    }
  }
`;

export const getChallengeById = gql`
  query Challenge($where: KChallengeWhereUniqueInput!) {
    challenge: challenge_public(where: $where) {
      ...ChallengeBase
    }
  }
  ${challengeBaseFragment}
`;

export const getChallengeByIdPrivate = gql`
  query Challenge($where: KChallengeWhereUniqueInput!) {
    challenge(where: $where) {
      ...ChallengeBase
    }
  }
  ${challengeBaseFragment}
`;
