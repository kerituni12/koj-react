import moment from 'moment';
import DOMPurify from 'dompurify';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import { Button, Drawer, Space } from 'antd';
import { useContext, useRef, useState } from 'react';
import MdEditor, { Plugins } from 'react-markdown-editor-lite';

import { CommentContext } from '../context/comment.context';
import { useMutation } from '@apollo/client';
import { commentCreateMutation } from '../graphql/comment.mutation';
import { toast } from 'react-toastify';

export function renderHTML(content) {
  return <ReactMarkdown rehypePlugins={[rehypeRaw]} children={content} />;
}

export function CommentDrawer({
  setIsOpenCommentDrawer,
  isOpenCommentDrawer,
  challengeId,
}) {
  let mdEditor = useRef();

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
              depth: 0,
              content: content,
              author: commentResult.create?.author?.name,
              avatar: 'https://joeschmoe.io/api/v1/random',
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
              const content = DOMPurify.sanitize(mdEditor.current.getMdValue());
              submitComment(content);
            }}
          >
            Cancel
          </Button>

          <Button type="primary">Submit</Button>
        </Space>
      }
    >
      <ReactMarkdown children={`### Just a link: https://reactjs.com.`} />
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
