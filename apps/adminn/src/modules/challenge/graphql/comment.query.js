import { gql } from '@apollo/client';

export const getCommentById = gql`
  query Comments($where: CommentWhereInput!) {
    comments(where: $where) {
      _id
      author {
        id
        username
        name
      }
      challengeId
      content
      depth
      parentId
      votes {
        userId
        vote
      }
    }
  }
`;
