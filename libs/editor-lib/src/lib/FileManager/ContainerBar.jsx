import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { uploadFile, pasteFiles } from '../Redux/actions';
import InfoBoxes from './Elements/InfoBoxes';
import Dropzone from './Elements/Dropzone';

import ViewItems from './ViewItems';
import { css } from '@emotion/css';
import React, { memo, useEffect } from 'react';
import { Table } from 'antd';
import KojUpload from './Elements/Upload';

function ContainerBar(props) {
  const {
    messages,
    operations,
    isloading,
    uploadBox,
    selectedFolder,
    uploadFile,
  } = props;

  const handleAddSelected = (value) => {
    operations.handleAddSelected(value);
  };

  useEffect(() => {
    console.log('mount');
    console.log(props.filesList);

    return () => {
      console.log('unmoutn');
    };
  }, []);

  return (
    <div>
      <div className={messageBoxStyle}>
        {messages.map((alert, index) => (
          <InfoBoxes key={index} alert={alert} />
        ))}
      </div>

      {
        // <Dropzone
        //   currentFolder={props.selectedFolder}
        //   handleReload={operations.handleReload}
        //   uploadFile={props.uploadFile}
        //   handleCancel={operations.handleUpload}
        // />
        <KojUpload
          currentFolder={selectedFolder}
          handleReload={operations.handleReload}
          uploadBox={uploadBox}
          handleCancel={operations.handleUpload}
          uploadFile={uploadFile}
          uploading={isloading}
        />
      }

      <DragDropContext onDragEnd={operations.handleDragEnd}>
        <ViewItems
          isloading={isloading}
          handleSetMainFolder={operations.handleSetMainFolder}
          handlePreview={operations.handlePreview}
          handleClickPopup={operations.handleOpenPopup}
          handleClosePopup={operations.handleClosePopup}
          addSelect={handleAddSelected}
        />
      </DragDropContext>
    </div>
  );
}

const mapStateToProps = (store) => ({
  store,
  selectedFiles: store.filemanager.selectedFiles,
  selectedFolder: store.filemanager.selectedFolder,
  bufferedItems: store.filemanager.bufferedItems,
  foldersList: store.filemanager.foldersList,
  showImages: store.filemanager.showImages,
  itemsView: store.filemanager.itemsView,
  filesList: store.filemanager.filesList,
  translations: store.dashboard.translations,
  lang: store.dashboard.lang,
});

const mapDispatchToProps = (dispatch) => ({
  uploadFile: (files, path) => dispatch(uploadFile(files, path)),
  pasteFiles: (files, type, destination) =>
    dispatch(pasteFiles(files, type, destination)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContainerBar);

const messageBoxStyle = css`
  z-index: 66;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  float: right;
`;
