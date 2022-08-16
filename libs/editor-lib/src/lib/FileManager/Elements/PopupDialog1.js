import { Input, Modal } from 'antd';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { useState } from 'react';
function html(html, opts = {}) {
  return parse(DOMPurify.sanitize(html));
}
export default function PopupDialog(props) {
  const {
    open,
    title,
    description,
    handleClose,
    handleSubmit,
    disableFooter,
    nameInputSets,
  } = props;

  const nameValue =
    typeof nameInputSets.value !== undefined ? nameInputSets.value : '';
  const [renameText, setRenameText] = useState(nameValue);
  const handleNameChange = (event) => {
    setRenameText(event.target.value);
    props.nameInputSets.callBack(event.target.value);
  };

  const inputProps = description && { style: { marginTop: 20 } };

  return (
    <Modal
      title={title}
      visible={open}
      onOk={handleSubmit}
      onCancel={handleClose}
      footer={disableFooter && null}
    >
      {html(description)}

      {nameInputSets.value && (
        <div {...inputProps}>
          <Input onChange={handleNameChange} value={renameText} />
        </div>
      )}
    </Modal>
  );
}
