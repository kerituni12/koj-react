import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { Emitter } from '@koj-react/emitter';

const KojModal = ({ isOpen, children, handleCancel }) => {
  return (
    <Modal
      title="File Manager"
      visible={isOpen}
      onCancel={handleCancel}
      width="95%"
      footer={null}
      style={{ top: 10 }}
      bodyStyle={{ padding: 0 }}
    >
      {children}
    </Modal>
  );
};
export default KojModal;
