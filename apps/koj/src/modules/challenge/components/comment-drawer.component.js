import moment from 'moment';
import DOMPurify from 'dompurify';
import rehypeRaw from 'rehype-raw';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { Button, Drawer, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import MdEditor from 'react-markdown-editor-lite';
import { useContext, useRef, useState } from 'react';

import { LoginContext } from '../context/login.context';
import { CommentContext } from '../context/comment.context';
import { commentCreateMutation } from '../graphql/comment.mutation';

export function renderHTML(content) {
  return <ReactMarkdown rehypePlugins={[rehypeRaw]} children={content} />;
}

export function CommentDrawer({
  setIsOpenCommentDrawer,
  isOpenCommentDrawer,
  challengeId,
}) {
  let mdEditor = useRef();
  const { t } = useTranslation();
  const { setIsLoginRequired } = useContext(LoginContext);
  const {
    avatar,
    firstname,
    lastname,
    id: userId,
  } = useSelector(({ user }) => user.user);

  const [state, setState] = useState({ value: '' });
  const { comments, setComments } = useContext(CommentContext);
  const [commentCreateGql] = useMutation(commentCreateMutation, {
    ignoreResults: true,
  });

  const handleEditorChange = (it, event) => {
    setState({
      value: it.text,
    });
  };

  const submitComment = async (content) => {
    if (!userId) {
      setIsLoginRequired(true);
      return;
    }
    try {
      await commentCreateGql({
        variables: {
          data: {
            content,
            challengeId,
            depth: 0,
          },
        },
        onCompleted({ comment: commentResult }) {
          if (commentResult.create?._id) {
            const newComment = {
              content,
              depth: 0,
              votePoint: 0,
              author: {
                name: `${firstname} ${lastname}`,
                avatar,
              },
              datetime: moment().fromNow(),
              ...commentResult.create,
            };
            setComments([...comments, newComment]);
          }
        },
      });
    } catch (error) {
      toast.error(error.message, { toastId: 'submitComment' });
    }
  };

  return (
    <Drawer
      placement="right"
      onClose={() => {
        setIsOpenCommentDrawer(false);
      }}
      visible={isOpenCommentDrawer}
      getContainer={false}
      style={{ position: 'absolute' }}
      width="100%"
      extra={
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setIsOpenCommentDrawer(false);
            }}
          >
            {t('action.cancel')}
          </Button>

          <Button
            type="primary"
            onClick={() => {
              const content = DOMPurify.sanitize(mdEditor.current.getMdValue());
              submitComment(content);
            }}
          >
            {t('action.create')}
          </Button>
        </Space>
      }
    >
      <MdEditor
        ref={(node) => (mdEditor.current = node || undefined)}
        value={state.value}
        style={{ height: '500px', width: '100%' }}
        renderHTML={renderHTML}
        onChange={handleEditorChange}
      />
    </Drawer>
  );
}
