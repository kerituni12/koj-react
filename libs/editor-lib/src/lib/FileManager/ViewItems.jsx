import React, { useContext, useEffect, useRef, useState } from 'react';
// import { css } from '@linaria/core';
import { css, cx } from '@emotion/css';

import { connect } from 'react-redux';
import { Box, Checkbox, Tooltip } from '@material-ui/core';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';

import { toAbsoluteUrl, convertDate, formatBytes } from '../Utils/Utils';
import mainconfig from '../Data/Config';
import useStyles from './Elements/Styles';
import config from './Elements/config.json';
import { Empty } from 'antd';
import { Table as TableAnt } from 'antd';
import { useDoubleClick } from '../useDoubleClick';

const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return (inst) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

function ViewItems(props) {
  const {
    isloading,
    handleClickPopup,
    handleClosePopup,
    addSelect,
    selectedFiles,
    bufferedItems,
    showImages,
  } = props;
  const classes = useStyles();
  const hybridClick = useDoubleClick(
    (event, data) => {
      if (data.type === 'folder') props.handleSetMainFolder(data.path);
      else if (data.type === 'image')
        handleClickPopup({
          disableFooter: true,
          title: `File: ${data.name}`,
          description: `<img style="width: 100%" src="${mainconfig.serverPath}${data.path}" />`,
          handleClose: handleClosePopup,
          nameInputSets: {},
        });
    },
    (event, data) => addSelect(data)
  );
  const getThumb = (item) => {
    try {
      if (
        showImages === 'thumbs' &&
        config.imageFiles.includes(item.extension)
      ) {
        return `${mainconfig.serverPath}${item.path}`;
      } else {
        if (item.type === 'folder') return toAbsoluteUrl(config.icons.folder);
        return typeof config.icons[item.extension] !== 'undefined'
          ? toAbsoluteUrl(config.icons[item.extension])
          : toAbsoluteUrl(config.icons.broken);
      }
    } catch (error) {
      return toAbsoluteUrl(config.icons.broken);
    }
  };

  const DroppableTableBody = ({ columnId, ...props }) => {
    return (
      <Droppable
        droppableId={columnId}
        // isDropDisabled={columnId === 'todo'}
      >
        {(provided, snapshot) => (
          <tbody
            ref={provided.innerRef}
            {...props}
            {...provided.droppableProps}
          ></tbody>
        )}
      </Droppable>
    );
  };

  const DraggableTableRow = ({ index, record, columnId, tasks, ...props }) => {
    if (!tasks.length) {
      return (
        <tr className="ant-table-placeholder row-item" {...props}>
          <td colSpan={24} className="ant-table-cell">
            <div className="ant-empty ant-empty-normal">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          </td>
        </tr>
      );
    }

    if (record.type !== 'folder') {
      return (
        <Draggable
          key={props['data-row-key']}
          draggableId={props['data-row-key'].toString()}
          index={index}
        >
          {(provideddrag, snapshot) => {
            return (
              <>
                <tr
                  ref={mergeRefs(provideddrag.innerRef)}
                  {...props}
                  {...provideddrag.draggableProps}
                  {...provideddrag.dragHandleProps}
                  className={`${props.className} ${
                    snapshot.isDragging
                      ? css`
                          display: table;
                          background: #e6f7ff;
                        `
                      : ``
                  }`}
                ></tr>
                {/* {provided.placeholder} */}
              </>
            );
          }}
        </Draggable>
      );
    }

    return (
      <Draggable
        key={props['data-row-key']}
        draggableId={props['data-row-key'].toString()}
        index={index}
      >
        {(provideddrag, snapshotdrag) => {
          return (
            <Droppable
              droppableId={props['data-row-key'].toString()}
              // isCombineEnabled
            >
              {(provided, snapshot) => {
                return (
                  <>
                    <tr
                      ref={mergeRefs(provided.innerRef, provideddrag.innerRef)}
                      {...props}
                      // onClick={(e) => hybridClick(e, record)}
                      {...provideddrag.draggableProps}
                      {...provideddrag.dragHandleProps}
                      {...provided.droppableProps}
                      className={`${props.className} ${
                        snapshotdrag.isDragging
                          ? css`
                              display: table;
                              background: #4285f4;
                            `
                          : ''
                      }`}
                    ></tr>
                    {/* {provided.placeholder} */}
                  </>
                );
              }}
            </Droppable>
          );
        }}
      </Draggable>
    );
  };

  const ListViewAnt = React.useMemo(() => {
    return (
      <TableAnt
        sticky
        size="small"
        loading={isloading}
        // // scroll={{ y: window.innerHeight - 200 }}
        rowSelection={{
          selectedRowKeys: selectedFiles.map((f) => f.id),
          columnWidth: 0, // Set the width to 0
          renderCell: () => '', // Render nothing inside
        }}
        rowKey="id"
        dataSource={props.filesList}
        columns={[
          {
            title: '',
            align: 'center',
            dataIndex: ['path', 'extension'],
            // dataIndex: 'name',
            width: 100,
            ellipsis: true,
            // colSpan: 0,
            render: (text, record, index) => {
              return (
                <img
                  style={{
                    width: '50px',
                    maxHeight: '30px',
                  }}
                  src={getThumb(record)}
                  alt=""
                />
              );
            },
            key: 'r',
          },
          {
            title: 'Name',
            dataIndex: 'name',
            ellipsis: true,
            // width: 300,
            key: 'name',
          },
          {
            title: 'Sise',
            dataIndex: 'size',
            width: 100,
            responsive: ['md'],
            key: 'size',
            render(size) {
              return formatBytes(size);
            },
          },
          {
            title: 'Date',
            dataIndex: 'created',
            key: 'date',
            ellipsis: true,
            responsive: ['md'],
            render(date) {
              return convertDate(date);
            },
          },
        ]}
        components={{
          body: {
            wrapper: (val) =>
              DroppableTableBody({
                columnId: 'file',
                ...val,
              }),
            row: (val) =>
              DraggableTableRow({
                tasks: props.filesList,
                ...val,
              }),
          },
        }}
        // Set props on per row (td)
        onRow={(record, index) => ({
          index,
          record,
          onClick: (e) => {
            hybridClick(e, record);
          },
        })}
        onCell={(record, index) => ({
          index,
          record,
        })}
        pagination={false}
      />
      // <TableAnt sticky columns={columns} dataSource={data} />
    );
  }, [isloading, props.filesList, selectedFiles]);

  const checkIsSelected = (item) => {
    return selectedFiles.find((item$) => (item$.name = item.name));
  };

  const isCuted = (item) => {
    if (bufferedItems.type === 'cut') {
      return (
        bufferedItems.files.filter((file) => file.id === item.id).length > 0
      );
    }
    return false;
  };

  function getStyle(style, snapshot) {
    if (!snapshot.isDraggingOver) {
      return style;
    }
    return {
      ...style,
      background: '#f00 !important',
    };
  }

  const FileItem = ({ item, index }) => {
    let fileCuted = isCuted(item);
    let isSelected = checkIsSelected(item);

    return (
      <Draggable
        draggableId={item.id}
        index={index}
        isDragDisabled={item.private}
      >
        {(provided, snapshot) => (
          <div
            className={clsx(itemFileStyle, {
              selected: isSelected,
              notDragging: !snapshot.isDragging,
              fileCuted: fileCuted,
            })}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={(e) => hybridClick(e, item)}
          >
            {(item.private && (
              <span className={`icon-lock ${classes.locked}`} />
            )) || (
              <Checkbox
                className={classes.checkbox}
                checked={isSelected}
                onChange={() => addSelect(item)}
                value={item.id}
              />
            )}
            <span className={classes.extension}>{item.extension}</span>

            <div className={classes.infoBox}>
              <img src={getThumb(item)} alt="" />
            </div>
            <Tooltip title={item.name}>
              <div className={classes.itemTitle}>
                <span>{item.name}</span>
              </div>
            </Tooltip>
          </div>
        )}
      </Draggable>
    );
  };

  const FolderItem = ({ item, index }) => {
    let fileCuted = isCuted(item);
    let isSelected = checkIsSelected(item);
    return (
      <Draggable
        index={index}
        draggableId={item.id}
        isDragDisabled={item.private}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={clsx(itemFileStyle, {
              selected: isSelected,
              notDragging: !snapshot.isDragging,
              fileCuted: fileCuted,
            })}
            // onDoubleClick={() => props.handleSetMainFolder(item.path)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={(e) => hybridClick(e, item)}
          >
            <Droppable
              droppableId={item.id}
              type="CONTAINERITEM"
              isCombineEnabled
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={getStyle(provided.droppableProps.style, snapshot)}
                >
                  {(item.private && (
                    <span className={`icon-lock ${classes.locked}`} />
                  )) || (
                    <Checkbox
                      className={classes.checkbox}
                      checked={isSelected}
                      onChange={() => addSelect(item)}
                      value={item.id}
                    />
                  )}
                  <div className={classes.infoBox}>
                    <img
                      src={
                        snapshot.isDraggingOver
                          ? toAbsoluteUrl(config.icons.folderopen)
                          : toAbsoluteUrl(config.icons.folder)
                      }
                      alt=""
                    />
                  </div>
                  <Tooltip
                    title={
                      <>
                        <b>Name :</b> {item.name} <br />
                        <b>Created :</b> {convertDate(item.created)}
                      </>
                    }
                  >
                    <div className={classes.itemTitle}>
                      <span>{item.name}</span>
                    </div>
                  </Tooltip>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
    );
  };

  const GridView = () => {
    return (
      <div className={classes.itemsList}>
        <Droppable
          droppableId="mainDroppablContainer"
          type="CONTAINERITEM"
          isCombineEnabled
        >
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {props.filesList.map(
                (item, index) =>
                  item.type === 'folder' && (
                    <FolderItem key={index} index={index} item={item} />
                  )
              )}

              {props.filesList.map(
                (item, index) =>
                  item.type !== 'folder' && (
                    <FileItem key={index} index={index} item={item} />
                  )
              )}

              {/* {provided.placeholder} */}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return props.itemsView === 'grid' ? <GridView /> : ListViewAnt;
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

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ViewItems);

const itemFileStyle = css`
  margin: 5px;
  padding: 10px;
  width: 100px;
  position: relative;
  border-radius: 5px;
  vertical-align: top;
  display: inline-block;
  max-height: 100px;
  &.fileCuted {
    opacity: 0.5;
  }
  &.notDragging {
    transform: translate(0px, 0px) !important;
  }
  // &:hover,
  // &.selectmode {
  //   background: #f1f1f1;
  //   & .MuiCheckbox-root {
  //     display: block !important;
  //   }
  // }
  &.selected {
    background: #e6f7fe;
    &.MuiCheckbox-root {
      display: block !important;
    }
  }
`;
