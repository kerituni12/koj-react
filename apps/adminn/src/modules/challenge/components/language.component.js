import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  Select,
  Row,
  Col,
  Drawer,
  Space,
  Typography,
  InputNumber,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { css } from '@emotion/css';
import {
  defaultLanguageOptions,
  defaultLanguages,
} from '../configs/languages.config';
import { useTranslation } from 'react-i18next';
const EditableContext = React.createContext(null);

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  track,
  handleSave,
  setEditingKey,
  ...restProps
}) => {
  let Cell;

  switch (dataIndex) {
    case 'id':
      Cell = (
        <Form.Item
          {...record}
          name={[record.name, dataIndex]}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please input ${dataIndex}!`,
            },
          ]}
          // className={inputDisabledStyle}
        >
          <Select
            style={{ width: '100%' }}
            disabled={!editable}
            showArrow={false}
            options={defaultLanguageOptions}
          />

          {/* <Input disabled={!editable} /> */}
        </Form.Item>
      );
      break;

    case 'timeout':
      Cell = (
        <Form.Item
          {...record}
          name={[record.name, dataIndex]}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please input ${dataIndex}`,
            },
          ]}
          // className={inputDisabledStyle}
        >
          <InputNumber
            disabled={!editable}
            min={0}
            max={4}
            type="number"
            style={{ width: '100%' }}
          />
        </Form.Item>
      );
      break;
    case 'description':
      Cell = (
        <Form.Item
          {...record}
          name={[record.name, dataIndex]}
          style={{
            margin: 0,
          }}
        >
          <Input rows={1} disabled={!editable} />
        </Form.Item>
      );
      break;
    default:
      children;
  }

  return <td {...restProps}>{track ? Cell : children}</td>;
};

let removeFormItem, moveFromItem;

function Language({ form, languages, setLanguages }) {
  const { t } = useTranslation();
  const [editingKey, setEditingKey] = useState(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isEdittingFromCreate, setIsEdittingFromCreate] = useState(false);

  const languageOptions = useMemo(() => {
    const languageSet = new Set((languages || []).map(({ id }) => id));
    if (editingKey !== null) {
      const formResult = form.getFieldValue();
      const { id } = formResult.languages[editingKey];
      languageSet.delete(id);
    }

    return defaultLanguageOptions.filter(
      (language) => !languageSet.has(language.value)
    );
  }, [languages, editingKey]);

  function getFormItemNameField(languages, field) {
    if (editingKey !== null && isOpenDrawer) {
      return [editingKey, field];
    }

    if (isOpenDrawer) {
      return [languages.length || 0, field];
    }

    return undefined;
  }

  function closeDrawer() {
    setIsOpenDrawer(false);
    setEditingKey(null);
    setIsEdittingFromCreate(false);
  }

  function moveItemToTop(index) {
    moveFromItem(index, 0);
  }

  function handleSearch() {
    console.log('search');
  }

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const $columns = [
    {
      title: t('title.name'),
      dataIndex: 'id',
      width: '30%',
      track: true,
    },
    {
      title: `${t('title.timeout')}(s)`,
      dataIndex: 'timeout',
      align: 'center',
      width: '20%',
      track: true,
    },
    {
      title: t('title.description'),
      dataIndex: 'description',
      align: 'center',
      width: '30%',
      track: true,
    },
    {
      align: 'center',
      render: (_, record) => (
        <Space size={'middle'}>
          <Typography.Link
            onClick={() => {
              setEditingKey(record.name);
              setIsOpenDrawer(true);
            }}
          >
            <EditOutlined />
          </Typography.Link>
          <Popconfirm
            title={t('statement.sure_to_delete')}
            onConfirm={() => {
              removeFormItem(record.name);
              setLanguages(form.getFieldValue().languages);
            }}
          >
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const columns = $columns.map((col) => {
    if (!col.track) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        track: col.track,
      }),
    };
  });

  return (
    <Form.List name="languages">
      {(languages, { remove, move }) => {
        let tempResult;

        if (!isEdittingFromCreate) {
          const formResult = form.getFieldValue();
          if (formResult.languages?.length) {
            tempResult = { ...formResult.languages[editingKey] };
          }
        }

        moveFromItem = move;
        removeFormItem = remove;

        return (
          <div>
            <div className={languageActionStyle}>
              <Input.Search
                placeholder="input search text"
                onSearch={handleSearch}
                style={{ width: 200 }}
                size="smalls"
              />
              <Button
                onClick={() => {
                  setIsOpenDrawer(true);
                  setIsEdittingFromCreate(true);
                }}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                {t('action.add')}
              </Button>
            </div>
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              className={tableStyle}
              bordered
              dataSource={languages}
              columns={columns}
              size="middle"
              pagination={false}
            />
            <Drawer
              // title={isEdittingFromCreate ? 'Add language' : 'Edit Language'}
              placement="right"
              onClose={() => {
                const formResultField = form.getFieldValue();

                if (formResultField.languages?.length > languages.length) {
                  remove(languages.length);
                }

                !isEdittingFromCreate &&
                  form.setFields([
                    {
                      name: ['languages', editingKey],
                      value: tempResult,
                    },
                  ]);

                closeDrawer();
              }}
              visible={isOpenDrawer}
              bodyStyle={{ paddingBottom: 80 }}
              getContainer={false}
              style={{ position: 'absolute' }}
              extra={
                <Space>
                  <Button
                    onClick={() => {
                      const formResultField = form.getFieldValue();

                      // Form field increase whenever change form.item but ui languages only update after re-render
                      // So we can delete the last item if has change value in form.item to keep ui work well

                      // Chi can update form.item useForm hook se tu dong tao 1 item moi va add vao mang result hien co va thay doi truc tiep array result trong form.list
                      // => dieu nay lam cho khi chung ta dong drawer
                      // nhung khong thuc hien submit create language thi no van duoc tao => chung ta can xoa item duoc tu dong tao nay truoc khi update ui de dam bao
                      // ui hien thi chinh xac thong tin
                      if (
                        formResultField.languages?.length > languages.length
                      ) {
                        remove(languages.length);
                      }

                      !isEdittingFromCreate &&
                        form.setFields([
                          {
                            name: ['languages', editingKey],
                            value: tempResult,
                          },
                        ]);

                      closeDrawer();
                    }}
                  >
                    {t('action.cancel')}
                  </Button>

                  <Button
                    onClick={() => {
                      closeDrawer();
                      moveItemToTop(languages.length);
                      console.log(form.getFieldValue().languages);
                      setLanguages(form.getFieldValue().languages);
                    }}
                    type="primary"
                  >
                    {t('action.submit')}
                  </Button>
                </Space>
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={getFormItemNameField(languages, 'id')}
                    label={t('title.name')}
                    rules={[
                      {
                        required: true,
                        message: t('statement.please_choose_options'),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t('statement.please_choose_options')}
                      options={languageOptions}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={getFormItemNameField(languages, 'timeout')}
                    label={t('title.time')}
                    rules={[
                      {
                        required: true,
                        message: t('statement.please_enter_time'),
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={4}
                      type="number"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name={getFormItemNameField(languages, 'description')}
                    label={t('title.description')}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder={t('statement.please_enter_description')}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Drawer>
          </div>
        );
      }}
    </Form.List>
  );
}

const languageActionStyle = css`
  display: flex;
  justify-content: space-between;
`;

const inputDisabledStyle = css`
  &
    .ant-select-disabled.ant-select:not(.ant-select-customize-input)
    .ant-select-selector {
    color: inherit;
  }
`;

const tableStyle = css`
  &
    .ant-select-disabled.ant-select:not(.ant-select-customize-input)
    .ant-select-selector {
    color: inherit;
  }
  & .ant-input-number-disabled {
    color: inherit;
  }
  & .ant-input[disabled] {
    color: inherit;
  }
`;
export default Language;
