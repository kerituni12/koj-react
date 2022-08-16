import { gql } from '@apollo/client';

export const commentCreateMutation = gql`
  mutation Comment($data: CommentCreateInput!) {
    comment {
      create(data: $data) {
        _id
        # depth
        # content
        # parentId
        # challengeId

        # votes {
        #   vote
        #   userId
        # }

        # author {
        #   id
        #   name
        #   username
        # }
      }
    }
  }
`;

export const commentVoteMutation = gql`
  mutation Comment($data: CommentVoteInput!) {
    comment {
      vote(data: $data) {
        _id
        challengeId

        votes {
          userId
          vote
        }
      }
    }
  }
`;

export const commentUnVoteMutation = gql`
  mutation Comment($data: CommentVoteInput!) {
    comment {
      unVote(data: $data)
    }
  }
`;
