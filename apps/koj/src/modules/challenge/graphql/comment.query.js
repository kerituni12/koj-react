import { gql } from '@apollo/client';

export const getCommentById = gql`
  query Comments($where: CommentWhereInput!) {
    comments(where: $where) {
      _id
      depth
      content
      parentId
      votePoint
      replyCount
      currentVote
      challengeId
      author {
        id
        name
        avatar
        username
      }
      votes {
        userId
        vote
      }
    }
  }
`;
