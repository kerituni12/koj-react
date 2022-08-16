import moment from 'moment';
import { nanoid } from 'nanoid';
import ReactDOM from 'react-dom';
import rehypeRaw from 'rehype-raw';
import { css } from '@emotion/css';
import { Empty, Spin, Tooltip } from 'antd';
import ReactMarkdown from 'react-markdown';
import React, { useContext, useEffect, useState } from 'react';
import { Comment, Avatar, Button, List, Input } from 'antd';

import { CommentContext } from '../context/comment.context';
import { ReadMore } from '@/components/read-more.component';

import Icon, {
  UpCircleTwoTone,
  UpCircleOutlined,
  DownCircleTwoTone,
  DownCircleOutlined,
} from '@ant-design/icons';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  commentCreateMutation,
  commentUnVoteMutation,
  commentVoteMutation,
} from '../graphql/comment.mutation';
import { toast } from 'react-toastify';
import { getCommentById } from '../graphql/comment.query';
import ErrorFallback from '@/components/error-fallback.component';
import { useTranslation } from 'react-i18next';

const TextArea = Input.TextArea;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

const CommentItem = ({ comment }) => {
  const [reply, setReply] = useState(false);
  const [state, setState] = useState({
    comments: comment.replies || [],
    submitting: false,
  });
  const [upvote, setUpvote] = useState(0);
  const [unvote, setUnvote] = useState(0);
  const [action, setAction] = useState(null);

  const addUpvote = () => {
    setUpvote(1);
    setUnvote(0);
    setAction('liked');
  };

  const addUnvote = () => {
    setUpvote(0);
    setUnvote(1);
    setAction('disliked');
  };
  const handleSubmit = (value) => {
    if (!value) {
      return;
    }

    setState((prevState) => ({
      ...prevState,
      submitting: true,
    }));

    setTimeout(() => {
      setState({
        submitting: false,
        comments: [
          {
            author: 'Han Solo',
            avatar:
              'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: value,
            datetime: moment().fromNow(),
          },
          ...comment.replies,
        ],
      });
      setReply(false);
    }, 1000);
  };
  return (
    <>
      <List.Item
        key={nanoid()}
        actions={[
          <>
            <Tooltip key="comment-basic-upvote" title="Upvote">
              <span onClick={addUpvote}>
                {action === 'liked' ? (
                  <UpCircleTwoTone />
                ) : (
                  <UpCircleOutlined />
                )}
              </span>
            </Tooltip>
            <span style={{ padding: '0 10px' }}>{unvote}</span>
            <Tooltip key="comment-basic-dislike" title="Unvote">
              <span onClick={addUnvote}>
                {action === 'disliked' ? (
                  <DownCircleTwoTone />
                ) : (
                  <DownCircleOutlined />
                )}
              </span>
            </Tooltip>
          </>,

          <span key="comment-basic-reply-to" onClick={() => setReply(true)}>
            Reply to
          </span>,
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar src={comment.avatar} />}
          // title="usernerm"
          description={'title'}
          style={{ alignItems: 'center' }}
        />
        <ReadMore lines={5}>
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            children={comment.content}
            className="custom-html-style"
          />
        </ReadMore>
        {(reply || comment.replies) && (
          <Comment
            avatar={
              <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
              />
            }
            content={
              <>
                <Editor onSubmit={handleSubmit} submitting={state.submitting} />
                {/* <Divider /> */}
              </>
            }
            className={antCommentEditorStyle}
          />
        )}
        {(comment.replies?.length || 0) > 0 && (
          <CommentList comments={comment.replies} />
        )}
      </List.Item>
    </>
  );
};

const CommentList = ({ comments, setIsOpenCommentDrawer }) => {
  const { t } = useTranslation();
  if (comments.length) {
    return (
      <List
        dataSource={comments}
        itemLayout="vertical"
        renderItem={(comment) => (
          <KojComment comment={comment} voteCount={10} />
        )}
        // renderItem={(item) => <KojComment item={item} />}
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
      <TextArea rows={1} onChange={onChange} value={value} />
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
  const [showMoreComment, setShowMoreComment] = useState(false);
  const { comments, setComments } = useContext(CommentContext);
  const [state, setState] = useState({
    replies: comment.replies || [],
    submitting: false,
  });
  const [upvote, setUpvote] = useState(0);
  const [unvote, setUnvote] = useState(0);

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
            setUnvote();
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
    try {
      await commentVoteGql({
        variables: {
          data: {
            commentId: comment._id,
            vote: vote === 'upvote' ? 1 : -1,
          },
        },
        onCompleted({ comment }) {
          ReactDOM.unstable_batchedUpdates(() => {
            if (vote === 'upvote') {
              setUnvote(0);
              setUpvote(1);
              return;
            }

            setUpvote(0);
            setUnvote(1);
          });
        },
      });
    } catch (error) {
      toast.error(error.message, { toastId: 'commentUnvote' });
    }
  };

  const submitReply = async (content) => {
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
            const newComments = [...comments];
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
              author: commentResult.create?.author?.name,
              avatar: 'https://joeschmoe.io/api/v1/random',
              content: content,
              datetime: moment().fromNow(),
              ...commentResult.create,
            };
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

  const handleSubmit = (value) => {
    if (!value) {
      return;
    }

    setState((prevState) => ({
      ...prevState,
      submitting: true,
    }));

    setTimeout(() => {
      ReactDOM.unstable_batchedUpdates(() => {
        setState({
          submitting: false,
          replies: [
            {
              author: 'Han Solo',
              avatar:
                'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              content: value,
              datetime: moment().fromNow(),
            },
            ...comment.replies,
          ],
        });
        setReply(false);
        setShowMoreComment(true);
      });
    }, 1000);
  };

  const toggleShowMoreComment = () => {
    setShowMoreComment((state) => !state);
  };
  const toggleUpvote = () => {
    if (!upvote) {
      voteComment('upvote');
      return;
    }
    unVoteComment();
  };
  const toggleUnvote = () => {
    if (!unvote) {
      voteComment('unvote');
      return;
    }
    unVoteComment();
    setUpvote(0);
    setUnvote((state) => !state);
  };
  return (
    <Comment
      className={commentStyle}
      actions={[
        <>
          <Tooltip key="comment-basic-upvote" title="Upvote">
            <span onClick={toggleUpvote}>
              {upvote ? <UpCircleTwoTone /> : <UpCircleOutlined />}
            </span>
          </Tooltip>
          <span>{voteCount - unvote + upvote}</span>
          <Tooltip key="comment-basic-addUnvote" title="Unvote">
            <span onClick={toggleUnvote}>
              {unvote ? <DownCircleTwoTone /> : <DownCircleOutlined />}
            </span>
          </Tooltip>
        </>,

        (comment.depth || 0) < 2 && (
          <span
            key="comment-basic-reply"
            onClick={() => setReply((state) => !state)}
          >
            Reply
          </span>
        ),
        (comment.replies?.length || 0) > 0 && (
          <span
            key="comment-basic-show-replys"
            onClick={() => toggleShowMoreComment()}
          >
            Show {} {(comment.replies?.length || 0) > 1 ? 'replies' : 'reply'}
          </span>
        ),
      ]}
      author={<a>Han Solo</a>}
      avatar={
        <Avatar
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          alt="Han Solo"
        />
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
      {showMoreComment && (comment.replies?.length || 0) > 0 && (
        <CommentList comments={comment.replies} />
      )}
    </Comment>
  );
}

export function CommentPane({ setIsOpenCommentDrawer, challengeId }) {
  const { comments, setComments } = useContext(CommentContext);

  const [getCommentByIdGql, { loading, error }] = useLazyQuery(getCommentById);

  useEffect(() => {
    getCommentByIdGql({
      variables: {
        where: {
          challengeId,
        },
      },
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-first',
      onCompleted({ comments }) {
        console.log('completed');
        ReactDOM.unstable_batchedUpdates(() => setComments(comments));
      },
    });
  }, []);

  if (error) {
    return <ErrorFallback error={error} />;
  }
  if (loading) {
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
      {comments.length && (
        <div className={commentFloatBtnStyle}>
          <Button onClick={() => setIsOpenCommentDrawer(true)}>
            Create Dissuss
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
