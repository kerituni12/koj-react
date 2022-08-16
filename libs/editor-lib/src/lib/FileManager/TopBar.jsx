import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  setSorting,
  filterSorting,
  setImagesSettings,
  listViewChange,
} from '../Redux/actions';
// import TopBarButtonGroups from './Elements/TopBarButtonGroups';
import TopBarButtonGroups from './Elements/TopBarButtonGroupAntd';

import {
  Col,
  Drawer,
  Row,
  Space,
  Button,
  Divider,
  Radio,
  Typography,
  Dropdown,
} from 'antd';

import {
  MenuUnfoldOutlined,
  MoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/css';

const { Title } = Typography;
const getMenu = (buttonParam, screenWidth) => {
  const buttons = buttonParam.filter((button) => !button.disable);
  const caculateButton = screenWidth - 80;

  const buttonRestCount = Math.floor(caculateButton / 41);
  const buttonsRest = buttons.splice(buttonRestCount - 1);

  return {
    buttonsRest,
    buttonsTopbar: buttons,
  };
};
function TopBar(props) {
  const {
    screenWidth,
    buttons,
    orderFiles,
    showImages,
    itemsView,
    showDrawer,
    isVisibleButtonDrawer,
  } = props;

  const [visible, setVisible] = useState(false);

  const { buttonsTopbar, buttonsRest } = getMenu(buttons.topbar, screenWidth);

  const restButton = () => {
    return (
      <div className={topbarDropdownStyle}>
        {buttonsRest.map((button, index) => (
          <Button onClick={button.onClick} key={index}>
            {button.icon && <span className={`${button.icon}`}></span>}
          </Button>
        ))}
      </div>
    );
  };
  const showDrawerSetting = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const options = {
    orderField: [
      {
        name: 'Name',
        value: 'name',
      },
      {
        name: 'Size',
        value: 'size',
      },
      {
        name: 'Create Date',
        value: 'date',
      },
    ],
    orderBy: [
      {
        name: 'Asc',
        value: 'asc',
      },
      {
        name: 'Desc',
        value: 'desc',
      },
    ],
    showThumb: [
      {
        name: 'Show Thumbs',
        value: 'thumbs',
      },
      { name: 'Show icon', value: 'icons' },
    ],
    view: [
      { name: 'List', value: 'list' },
      { name: 'Thumbnails', value: 'grid' },
    ],
  };

  const onChangeOrderField = (e) => {
    // console.log('radio checked', e.target.value);
    props.setSorting(orderFiles.orderBy, e.target.value);
    props.filterSorting();
  };
  const onChangeOrderBy = (e) => {
    // console.log('radio checked', e.target.value);
    props.setSorting(e.target.value, orderFiles.field);
    props.filterSorting();
  };
  const onChangeShowThumb = (e) => {
    props.setImagesSettings(e.target.value);
  };
  const onChangeView = (e) => {
    props.listViewChange(e.target.value);
  };
  return (
    <Row className={topbarStyle}>
      {isVisibleButtonDrawer && (
        <Button type="primary" onClick={showDrawer}>
          {React.createElement(MenuUnfoldOutlined)}
        </Button>
      )}

      <Col>
        <TopBarButtonGroups buttons={buttonsTopbar} />

        {buttonsRest && buttonsRest?.length !== 0 && (
          <Dropdown overlay={restButton} placement="bottomRight">
            <Button>
              <MoreOutlined />
            </Button>
          </Dropdown>
        )}
      </Col>

      <Col style={{ marginLeft: 'auto' }}>
        <Button onClick={showDrawerSetting}>
          <SettingOutlined />
        </Button>
        {visible && (
          <Drawer
            placement="right"
            onClose={onClose}
            visible={visible}
            getContainer={() => {
              if (typeof document === 'undefined') return null;
              return document.getElementById('file_manager_modal');
            }}
            extra={<span />}
            headerStyle={{ padding: '10px 5px' }}
            bodyStyle={{ padding: '12px' }}
            style={{ position: 'absolute' }}
          >
            <Title level={5}>Order Field</Title>
            <Radio.Group
              onChange={onChangeOrderField}
              defaultValue={orderFiles.field}
            >
              <Space direction="vertical">
                {options.orderField.map((option, index) => (
                  <Radio key={option.value} value={option.value}>
                    {option.name}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
            <Divider />
            <Title level={5}>Order By</Title>
            <Radio.Group
              onChange={onChangeOrderBy}
              defaultValue={orderFiles.orderBy}
            >
              <Space direction="vertical">
                {options.orderBy.map((option, index) => (
                  <Radio key={option.value} value={option.value}>
                    {option.name}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
            <Divider />
            <Title level={5}>Show Thumbs</Title>
            <Radio.Group onChange={onChangeShowThumb} defaultValue={showImages}>
              <Space direction="vertical">
                {options.showThumb.map((option, index) => (
                  <Radio key={option.value} value={option.value}>
                    {option.name}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
            <Divider />
            <Title level={5}>Views</Title>
            <Radio.Group onChange={onChangeView} defaultValue={itemsView}>
              <Space direction="vertical">
                {options.view.map((option, index) => (
                  <Radio key={option.value} value={option.value}>
                    {option.name}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Drawer>
        )}
      </Col>
    </Row>
  );
}

const mapStateToProps = (store) => ({
  store,
  selectedFiles: store.filemanager.selectedFiles,
  selectedFolder: store.filemanager.selectedFolder,
  bufferedItems: store.filemanager.bufferedItems,
  foldersList: store.filemanager.foldersList,
  filesList: store.filemanager.filesList,
  itemsView: store.filemanager.itemsView,
  showImages: store.filemanager.showImages,
  orderFiles: store.filemanager.orderFiles,
  history: store.filemanager.history,
  translations: store.dashboard.translations,
  lang: store.dashboard.lang,
});

const mapDispatchToProps = (dispatch) => ({
  setSorting: (orderBy, field) => dispatch(setSorting(orderBy, field)),
  filterSorting: () => dispatch(filterSorting()),
  setImagesSettings: (imagePreview) =>
    dispatch(setImagesSettings(imagePreview)),
  listViewChange: (type) => dispatch(listViewChange(type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
const topbarStyle = css`
  padding: 5px;
  background-color: rgb(249 250 252);
  & .ant-btn {
    padding: 4px 10px;
    margin-right: 4px;
  }
`;
const topbarDropdownStyle = css`
  & .ant-btn {
    padding: 4px 10px;
    margin-left: 4px;
  }
`;
