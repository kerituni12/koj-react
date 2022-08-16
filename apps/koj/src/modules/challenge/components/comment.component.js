import moment from 'moment';
import ReactDOM from 'react-dom';
import rehypeRaw from 'rehype-raw';
import { css } from '@emotion/css';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import {
  Comment,
  Avatar,
  Button,
  List,
  Input,
  Empty,
  Spin,
  Tooltip,
} from 'antd';

import {
  UpCircleTwoTone,
  UpCircleOutlined,
  DownCircleTwoTone,
  DownCircleOutlined,
} from '@ant-design/icons';

import { ReadMore } from '@/components/read-more.component';
import ErrorFallback from '@/components/error-fallback.component';

import {
  commentCreateMutation,
  commentUnVoteMutation,
  commentVoteMutation,
} from '../graphql/comment.mutation';

import { getCommentById } from '../graphql/comment.query';
import { CommentContext } from '../context/comment.context';
import { LoginContext } from '../context/login.context';

const CommentList = ({ comments, setIsOpenCommentDrawer }) => {
  console.log('comment list render');
  const { t } = useTranslation();
  if (comments?.length) {
    return (
      <List
        dataSource={comments}
        itemLayout="vertical"
        renderItem={(comment) => (
          <KojComment comment={comment} voteCount={10} />
        )}
        style={{ flex: 1 }}
      />
    );
  }
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{
        height: 60,
      }}
      description={<span>{t('title.nodata')}</span>}
    >
      <Button type="primary" onClick={() => setIsOpenCommentDrawer(true)}>
        {t('action.create_new')}
      </Button>
    </Empty>
  );
};

const Editor = ({ onSubmit, submitting }) => {
  const [value, setValue] = useState('');
  const onChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <div className={commentEditorStyle}>
      <Input.TextArea rows={1} onChange={onChange} value={value} />
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={() => onSubmit(value)}
        type="primary"
      >
        Comment
      </Button>
    </div>
  );
};

export function KojComment({ comment, voteCount = 0 }) {
  const [reply, setReply] = useState(false);
  const {
    avatar,
    firstname,
    lastname,
    id: userId,
  } = useSelector(({ user }) => user.user);
  const [showMoreComment, setShowMoreComment] = useState(false);
  const { comments, setComments } = useContext(CommentContext);
  const { setIsLoginRequired } = useContext(LoginContext);

  const [state, setState] = useState({
    replies: comment.replies || [],
    submitting: false,
  });
  const [upvote, setUpvote] = useState(comment.currentVote || 0);

  const [getCommentByIdGql] = useLazyQuery(getCommentById, {
    fetchPolicy: 'cache-and-network',
  });
  const [commentVoteGql] = useMutation(commentVoteMutation, {
    ignoreResults: true,
  });
  const [commentUnVoteGql] = useMutation(commentUnVoteMutation, {
    ignoreResults: true,
  });
  const [commentCreateGql] = useMutation(commentCreateMutation, {
    ignoreResults: true,
  });

  const unVoteComment = async () => {
    try {
      await commentUnVoteGql({
        variables: {
          data: {
            commentId: comment._id,
          },
        },
        onCompleted({ comment }) {
          if (comment.unVote) {
            ReactDOM.unstable_batchedUpdates(() => {
              setUpvote(0);
            });
          } else {
            toast.error('unVote not success');
          }
        },
      });
    } catch (error) {
      toast.error(error.message, { toastId: 'commentUnvote' });
    }
  };

  const voteComment = async (vote) => {
    if (!userId) {
      setIsLoginRequired(true);
      return;
    }
    try {
      await commentVoteGql({
        variables: {
          data: {
            commentId: comment._id,
            vote: vote === 'upvote' ? 1 : -1,
          },
        },
        onCompleted() {
          ReactDOM.unstable_batchedUpdates(() => {
            if (vote === 'upvote') {
              setUpvote(1);
              return;
            }

            setUpvote(-1);
          });
        },
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: comment.component.js ~ line 165 ~ voteComment ~ error',
        error
      );
      toast.error(error.message, { toastId: 'commentUnvote' });
    }
  };

  const submitReply = async (content) => {
    if (!userId) {
      setIsLoginRequired(true);
      return;
    }

    try {
      const depth = comment.depth + 1;
      await commentCreateGql({
        variables: {
          data: {
            depth,
            content: content,
            parentId: comment._id,
          },
        },
        onCompleted({ comment: commentResult }) {
          if (commentResult.create?._id) {
            const newComments = structuredClone(comments);
            let parrentComment;

            while (
              (parrentComment?.depth || 0) !== depth &&
              comment.depth !== 0
            ) {
              const temp = (parrentComment?.replies || newComments).find(
                (comment$) => comment$._id === comment?.parentId
              );

              if (!temp) break;
              parrentComment = temp;
            }
            let currentComment = (parrentComment?.replies || newComments).find(
              (comment$) => comment$._id === comment._id
            );

            const reply = {
              depth,
              // avatar,
              content,
              votePoint: 0,
              datetime: moment().fromNow(),
              author: { name: `${firstname} ${lastname}`, avatar },
              ...commentResult.create,
            };
            currentComment.replyCount = comment.replyCount || 0 + 1;
            currentComment.replies = currentComment.replies || [];
            currentComment.replies.unshift(reply);

            ReactDOM.unstable_batchedUpdates(() => {
              setState({
                submitting: false,
              });
              setComments(newComments);
              setReply(false);
              setShowMoreComment(true);
            });
          }
        },
      });
    } catch (error) {
      toast.error(error.message, { toastId: 'submitComment' });
    }
  };

  const toggleShowMoreComment = () => {
    const where = { parentId: comment._id };

    if (userId) where.userId = userId;

    if (comment.replies === undefined) {
      getCommentByIdGql({
        variables: { where },
        onCompleted({ comments: commentsResult }) {
          const newComments = structuredClone(comments);
          let currentComment = newComments.find(
            (comment$) => comment$._id === comment._id
          );

          currentComment.replies = commentsResult;

          ReactDOM.unstable_batchedUpdates(() => {
            setState({
              submitting: false,
            });
            setComments(newComments);
            setReply(false);
            setShowMoreComment(true);
          });
        },
      });
      return;
    }
    setShowMoreComment((state) => !state);
  };

  const toggleShowReply = () => {
    if (comment.replies === undefined) {
      const where = { parentId: comment._id };

      if (userId) where.userId = userId;

      getCommentByIdGql({
        variables: { where },
        onCompleted({ comments: commentsResult }) {
          const newComments = structuredClone(comments);
          let currentComment = newComments.find(
            (comment$) => comment$._id === comment._id
          );

          currentComment.replies = commentsResult;

          ReactDOM.unstable_batchedUpdates(() => {
            setState({
              submitting: false,
            });
            setComments(newComments);
            setReply((state) => !state);
            setShowMoreComment(true);
          });
        },
      });
      return;
    }
    ReactDOM.unstable_batchedUpdates(() => {
      setReply((state) => !state);
      setShowMoreComment(!reply);
    });
  };

  const toggleUpvote = (voteType) => {
    if (upvote !== 1 && voteType === 'upvote') {
      voteComment('upvote');
      return;
    }
    if (upvote !== -1 && voteType === 'unvote') {
      voteComment('unvote');
      return;
    }
    unVoteComment();
  };

  useEffect(() => {
    setUpvote(comment.currentVote || 0);
  }, [comment.currentVote]);

  return (
    <Comment
      className={commentStyle}
      actions={[
        <>
          <Tooltip key="comment-basic-upvote" title="Upvote">
            <span onClick={() => toggleUpvote('upvote')}>
              {upvote == 1 ? <UpCircleTwoTone /> : <UpCircleOutlined />}
            </span>
          </Tooltip>
          <span>
            {/* Case client point count and case fetch point count form server */}
            {comment.currentVote
              ? comment.votePoint
              : (comment.votePoint || 0) + upvote}
          </span>
          <Tooltip key="comment-basic-addUnvote" title="Unvote">
            <span onClick={() => toggleUpvote('unvote')}>
              {upvote == -1 ? <DownCircleTwoTone /> : <DownCircleOutlined />}
            </span>
          </Tooltip>
        </>,

        (comment.depth || 0) < 2 && (
          <span key="comment-basic-reply" onClick={() => toggleShowReply()}>
            Reply
          </span>
        ),
        (comment.replyCount || 0) > 0 && (
          <span
            key="comment-basic-show-replys"
            onClick={() => toggleShowMoreComment()}
          >
            Show {comment.replyCount}{' '}
            {(comment.replyCount || 0) > 1 ? 'replies' : 'reply'}
          </span>
        ),
      ]}
      author={<a>{comment.author?.name}</a>}
      avatar={
        <Avatar src={comment.author?.avatar} alt={comment.author?.name} />
      }
      content={
        <ReadMore lines={5}>
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            children={comment.content}
            className="custom-html-style"
          />
        </ReadMore>
      }
    >
      {reply && <Editor onSubmit={submitReply} submitting={state.submitting} />}
      {showMoreComment && (comment.replyCount || 0) > 0 && (
        <CommentList comments={comment.replies} />
      )}
    </Comment>
  );
}

/*
  To avoid duplicate setState() must init comments in context with undefined
  After that set comments is [] in comment pane
  Only fetch and setState() for comments when comment is undefined
*/
export function CommentPane({ setIsOpenCommentDrawer, challengeId }) {
  const { t } = useTranslation();
  const { id: userId } = useSelector(({ user }) => user.user);
  const { comments, setComments } = useContext(CommentContext);
  const [getCommentByIdGql, { loading, error }] = useLazyQuery(getCommentById, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    // if (comments === undefined)
    const where = { challengeId };

    if (userId) where.userId = userId;

    getCommentByIdGql({
      variables: { where },
      onCompleted({ comments }) {
        setComments(comments);
      },
    });
  }, []);

  if (error) {
    return <ErrorFallback error={error} />;
  }
  if (loading || comments === undefined) {
    return (
      <div className="center-screen">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className={challengeCommentStyle}>
      <div>
        <CommentList
          comments={comments}
          setIsOpenCommentDrawer={setIsOpenCommentDrawer}
        />
      </div>
      {comments?.length && (
        <div className={commentFloatBtnStyle}>
          <Button onClick={() => setIsOpenCommentDrawer(true)}>
            {t('create_new')}
          </Button>
        </div>
      )}
    </div>
  );
}

const challengeCommentStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const commentFloatBtnStyle = css`
  position: sticky;
  // display: flex;
  // justify-content: flex-end;
  bottom: 5px;
  margin-left: auto;
`;
const addCommnetButtonStyle = css`
  margin-top: 10px;
  justify-content: end;
  display: flex;
`;
const antCommentEditorStyle = css`
  & .ant-comment-inner {
    padding-bottom: 0;
  }
`;

const commentStyle = css`
  & .ant-comment-content-detail p {
    white-space: normal;
  }
  & .ant-comment-actions {
    margin-top: 0;
  }
  & .ant-comment-inner {
    padding: 8px 0;
  }
`;
const commentEditorStyle = css`
  display: flex;
  gap: 8px;
  align-items: center;
`;
