import { gql } from '@apollo/client';

export const challengeBaseFragment = gql`
  fragment ChallengeBase on Challenge {
    id
    slug
    title
    types
    output
    inputs
    status
    structs
    audience
    createdAt
    languages
    solutions
    testcases
    categoryId
    difficulty
    companyTags
    description
    functionName
    createdByName
    languages
    createdByUsername
    topicTags {
      id
    }
  }
`;
