import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space, Upload } from 'antd';
import { toast } from 'react-toastify';
import { pathWithoutDomain } from '../../Utils';

const KojUpload = ({
  currentFolder,
  handleReload,
  uploadFile,
  handleCancel,
  uploadBox,
  uploading,
}) => {
  const [fileList, setFileList] = useState([]);

  const handleUpload = () => {
    var formData = new FormData();
    formData.append('path', pathWithoutDomain(currentFolder));
    fileList.forEach((file, index) => {
      formData.append('files', file, file.name);
    });
    uploadFile(formData).then((result) => {
      handleReload();
      canelUpload();
    });
  };

  const canelUpload = async () => {
    await setFileList([]);
    handleCancel();
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList((fileList) => {
        if (fileList.length >= 5) {
          toast.error('vuot qua gioi han', { toastId: 'uploadFileLimit' });
          return fileList;
        }
        return [...fileList, file];
      });
      return false;
    },
    fileList,
    multiple: true,
  };

  return (
    <Modal
      title={null}
      footer={null}
      visible={uploadBox}
      closable={false}
      onCancel={canelUpload}
    >
      <Upload.Dragger {...props} maxCount={5} multiple>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </Upload.Dragger>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{
            marginTop: 16,
          }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
        <Button
          type="primary"
          danger
          onClick={canelUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{
            marginTop: 16,
          }}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default KojUpload;
