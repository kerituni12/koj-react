import { isEditPage } from '@/utils/common';
import { titleCase } from '@/utils/string';
import {
  CloseOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/css';
import {
  Button,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { useLocation } from 'react-router-dom';
import { TypeEnum } from '../configs/constant.config';
import { paramTypeOptions } from '../configs/input-type.config';
import { tabPaneStyle } from '../styles/challenge.style';

function genTypeOptionsFromStruct(struct = []) {
  const options = [];
  struct.forEach((object) => {
    options.push({
      label: `Object{${titleCase(object.name)}}`,
      value: `OBJECT{${object.name}}`,
    });
    options.push({
      label: `Array[Object{${titleCase(object.name)}}]`,
      value: `ARRAY[OBJECT{${object.name}}]`,
    });
  });
  return options;
}

function ChallengeInput({ form, customType, setCustomType, structs }) {
  const location = useLocation();
  const scrollRef = useRef();
  const isRemoveRef = useRef();
  const structsForm = Form.useWatch('structs', form);

  const typeOptions = useMemo(() => {
    const typeOptions = [...paramTypeOptions];
    typeOptions.unshift(...genTypeOptionsFromStruct(structsForm || structs));
    return typeOptions.map((option) => {
      return (
        <Select.Option
          key={option.value}
          value={option.value}
          label={option.label}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {option.label}
        </Select.Option>
      );
    });
  }, [customType, structsForm]);

  function addCustomType(type) {
    const newType = {
      label: titleCase(type),
      value: type.toUpperCase(),
    };
    setCustomType([newType, ...customType]);
  }

  function removeCustomType(type) {
    setCustomType(customType.filter((type$) => type$.value !== type));
  }

  function scrollToBottom() {
    const curr = scrollRef.current;
    console.log(
      '🚀 ~ file: input.component.js ~ line 86 ~ scrollToBottom ~ curr',
      curr
    );

    if (curr) {
      setTimeout(() => {
        const element = document.getElementById('input-bottom');
        element.scrollIntoView();
      }, 250);
    }
  }

  return (
    <PerfectScrollbar containerRef={(el) => (scrollRef.current = el)}>
      <Content className={tabPaneStyle}>
        <Collapse className={collapseStyle} accordion defaultActiveKey={['1']}>
          <Collapse.Panel header="Dau ra" key="1">
            <Row>
              <Col span={24}>
                <Form.Item name="output">
                  <Select
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                    onSelect={(value, option) => {
                      if (isRemoveRef.current?.isRemove) {
                        if (isRemoveRef.current.value === value) {
                          form.setFieldsValue({ output: '' });
                        } else {
                          form.setFieldsValue({
                            output: isRemoveRef.current.value,
                          });
                        }
                        isRemoveRef.current = { isRemove: false };
                      }
                    }}
                    dropdownRender={(menu) => (
                      <TypeSelectDropDown
                        menu={menu}
                        addCustomType={addCustomType}
                        removeCustomType={removeCustomType}
                      />
                    )}
                  >
                    {customType.map((option) => (
                      <Select.Option
                        key={option.value}
                        value={option.value}
                        label={option.label}
                        title={option.label}
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <div className={selectTypeStyle}>
                          <div className="label">{option.label}</div>

                          <CloseOutlined
                            onClick={(event) => {
                              // event.stopPropagation();
                              console.log('click');
                              isRemoveRef.current = {
                                isRemove: true,
                                value: form.getFieldValue('output'),
                              };
                              removeCustomType(option.value);
                            }}
                          />
                        </div>
                      </Select.Option>
                    ))}
                    {typeOptions}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Collapse.Panel>
          <Collapse.Panel header="Dau vao" key="2">
            <Form.List name="inputs">
              {(inputs, { add, remove }) => {
                return (
                  <>
                    {inputs.length === 0 && (
                      <Col span={24}>
                        <div className={headerStyle}>
                          <b>Đầu vào</b>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={() => {
                              add(
                                {
                                  name: `input${inputs.length + 1}`,
                                  type: TypeEnum.INTEGER,
                                },
                                0
                              );
                              scrollToBottom();
                            }}
                            style={{ padding: '4px 0' }}
                          >
                            Thêm đầu vào
                          </Button>
                        </div>
                      </Col>
                    )}
                    {inputs.map((input, index) => (
                      <Row
                        gutter={16}
                        key={input.name}
                        style={{ paddingBottom: 13 }}
                      >
                        <Col span={24}>
                          <div className={headerStyle}>
                            <b>Đầu vào {Number(input.name + 1)}</b>
                            <Space>
                              <Button
                                type="link"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                  add({
                                    name: `input${inputs.length + 1}`,
                                    type: TypeEnum.INTEGER,
                                  });
                                  scrollToBottom();
                                }}
                                style={{ padding: '4px 0' }}
                              >
                                Thêm đầu vào
                              </Button>

                              <Button
                                type="link"
                                icon={<DeleteOutlined />}
                                danger
                                onClick={() => remove(input.name)}
                              />
                            </Space>
                          </div>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            label="Tên tham số"
                            name={[input.name, 'name']}
                            required
                            tooltip="This is a required field"
                          >
                            <Input placeholder="input placeholder" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Kiểu dữ liệu"
                            name={[input.name, 'type']}
                            tooltip={{
                              title: 'Tooltip with customize icon',
                              icon: <InfoCircleOutlined />,
                            }}
                          >
                            <Select
                              style={{ width: '100%' }}
                              optionLabelProp="label"
                              onSelect={(value, option) => {
                                if (isRemoveRef.current?.isRemove) {
                                  form.setFields([
                                    {
                                      name: ['inputs', input.name, 'type'],
                                      value:
                                        isRemoveRef.current.value === value
                                          ? ''
                                          : isRemoveRef.current.value,
                                    },
                                  ]);

                                  isRemoveRef.current = { isRemove: false };
                                }
                              }}
                              dropdownRender={(menu) => (
                                <TypeSelectDropDown
                                  menu={menu}
                                  addCustomType={addCustomType}
                                  removeCustomType={removeCustomType}
                                />
                              )}
                            >
                              {customType.map((option) => (
                                <Select.Option
                                  key={option.value}
                                  value={option.value}
                                  label={option.label}
                                  title={option.label}
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  <div className={selectTypeStyle}>
                                    <div className="label">{option.label}</div>

                                    <CloseOutlined
                                      onClick={(e) => {
                                        console.log('click');
                                        console.log(
                                          'form type',
                                          form.getFieldValue([
                                            'inputs',
                                            input.name,
                                            'type',
                                          ])
                                        );
                                        isRemoveRef.current = {
                                          isRemove: true,
                                          value: form.getFieldValue([
                                            'inputs',
                                            input.name,
                                            'type',
                                          ]),
                                        };
                                        removeCustomType(option.value);
                                      }}
                                    />
                                  </div>
                                </Select.Option>
                              ))}
                              {typeOptions}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                  </>
                );
              }}
            </Form.List>
          </Collapse.Panel>
          <Collapse.Panel header="Object Struct" key="3">
            <Form.List name="structs">
              {(structs, { add, remove }) => {
                return (
                  <>
                    {structs.length === 0 && (
                      <Col span={24}>
                        <div className={headerStyle}>
                          <b>Doi tuong</b>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={() => {
                              add(
                                {
                                  name: `struct${structs.length + 1}`,
                                },
                                0
                              );
                              scrollToBottom();
                            }}
                            style={{ padding: '4px 0' }}
                          >
                            Thêm doi tuong
                          </Button>
                        </div>
                      </Col>
                    )}
                    {structs.map((struct, index) => {
                      const formListProps = {
                        name: [struct.name, 'fields'],
                      };
                      if (!isEditPage(location.pathname)) {
                        formListProps.initialValue = [
                          { name: 'property1', type: TypeEnum.INTEGER },
                        ];
                      }

                      return (
                        <Row
                          gutter={16}
                          key={struct.name}
                          style={{ paddingBottom: 13 }}
                        >
                          <Col span={24}>
                            <div className={headerStyle}>
                              <b>
                                Doi tuong {Number(structs.length - struct.name)}
                              </b>
                              <Space>
                                <Button
                                  type="link"
                                  icon={<PlusOutlined />}
                                  onClick={() => {
                                    add(
                                      {
                                        name: `struct${structs.length + 1}`,
                                      },
                                      0
                                    );
                                    scrollToBottom();
                                  }}
                                  style={{ padding: '4px 0' }}
                                >
                                  Thêm đầu vào
                                </Button>

                                <Button
                                  type="link"
                                  icon={<DeleteOutlined />}
                                  danger
                                  onClick={() => remove(struct.name)}
                                />
                              </Space>
                            </div>
                          </Col>

                          <Col span={12}>
                            <Form.Item
                              label="Tên doi tuong"
                              name={[struct.name, 'name']}
                              rules={[
                                {
                                  required: true,
                                  message: 'field is required',
                                },
                              ]}
                              required
                            >
                              <Input placeholder="input placeholder" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="Comment"
                              name={[struct.name, 'comment']}
                            >
                              <Input placeholder="comment" />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Collapse
                              className={collapseStyle}
                              defaultActiveKey={['1']}
                              expandIconPosition="right"
                            >
                              <Collapse.Panel
                                header="Cấu hình cho thuoc tinh"
                                key="1"
                              >
                                {}
                                <Form.List {...formListProps}>
                                  {(fields, { add, remove }) => {
                                    return (
                                      <Row gutter={16}>
                                        <Col span={24}>
                                          <Row gutter={16}>
                                            <Col
                                              span={10}
                                              style={{ paddingBottom: 10 }}
                                            >
                                              Ten tham so
                                            </Col>
                                            <Col
                                              span={12}
                                              style={{ paddingBottom: 10 }}
                                            >
                                              Kieu du lieu
                                            </Col>
                                            <Col span={2}>
                                              <Button
                                                type="link"
                                                shape="circle"
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                  add(
                                                    {
                                                      name: `property${
                                                        fields.length + 1
                                                      }`,
                                                      type: TypeEnum.INTEGER,
                                                    },
                                                    0
                                                  );
                                                }}
                                                icon={<PlusOutlined />}
                                              />
                                            </Col>
                                          </Row>
                                        </Col>

                                        {fields.map((field, index) => (
                                          <Fragment key={field.name}>
                                            <Col span={10}>
                                              <Form.Item
                                                name={[field.name, 'name']}
                                                required
                                                tooltip="This is a required field"
                                              >
                                                <Input placeholder="input placeholder" />
                                              </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                              <Form.Item
                                                name={[field.name, 'type']}
                                                tooltip={{
                                                  title:
                                                    'Tooltip with customize icon',
                                                  icon: <InfoCircleOutlined />,
                                                }}
                                              >
                                                <Select
                                                  style={{ width: '100%' }}
                                                  optionLabelProp="label"
                                                  onSelect={(value, option) => {
                                                    if (
                                                      isRemoveRef.current
                                                        ?.isRemove
                                                    ) {
                                                      form.setFields([
                                                        {
                                                          name: [
                                                            struct.name,
                                                            'fields',
                                                            field.name,
                                                            'type',
                                                          ],
                                                          value:
                                                            isRemoveRef.current
                                                              .value === value
                                                              ? ''
                                                              : isRemoveRef
                                                                  .current
                                                                  .value,
                                                        },
                                                      ]);

                                                      isRemoveRef.current = {
                                                        isRemove: false,
                                                      };
                                                    }
                                                  }}
                                                  dropdownRender={(menu) => (
                                                    <TypeSelectDropDown
                                                      menu={menu}
                                                      addCustomType={
                                                        addCustomType
                                                      }
                                                      removeCustomType={
                                                        removeCustomType
                                                      }
                                                    />
                                                  )}
                                                >
                                                  {customType.map((option) => (
                                                    <Select.Option
                                                      key={option.value}
                                                      value={option.value}
                                                      label={option.label}
                                                      title={option.label}
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                      }}
                                                    >
                                                      <div
                                                        className={
                                                          selectTypeStyle
                                                        }
                                                      >
                                                        <div className="label">
                                                          {option.label}
                                                        </div>

                                                        <CloseOutlined
                                                          onClick={(e) => {
                                                            console.log(
                                                              'click'
                                                            );
                                                            console.log(
                                                              'form type',
                                                              form.getFieldValue(
                                                                [
                                                                  struct.name,
                                                                  'fields',
                                                                  field.name,
                                                                  'type',
                                                                ]
                                                              )
                                                            );
                                                            isRemoveRef.current =
                                                              {
                                                                isRemove: true,
                                                                value:
                                                                  form.getFieldValue(
                                                                    [
                                                                      struct.name,
                                                                      'fields',
                                                                      field.name,
                                                                      'type',
                                                                    ]
                                                                  ),
                                                              };
                                                            removeCustomType(
                                                              option.value
                                                            );
                                                          }}
                                                        />
                                                      </div>
                                                    </Select.Option>
                                                  ))}
                                                  {typeOptions}
                                                </Select>
                                              </Form.Item>
                                            </Col>
                                            <Col span={2}>
                                              {fields.length > 1 && (
                                                <Button
                                                  type="text"
                                                  icon={<DeleteOutlined />}
                                                  danger
                                                  onClick={() =>
                                                    remove(field.name)
                                                  }
                                                />
                                              )}
                                            </Col>
                                          </Fragment>
                                        ))}
                                      </Row>
                                    );
                                  }}
                                </Form.List>
                              </Collapse.Panel>
                            </Collapse>
                          </Col>
                        </Row>
                      );
                    })}
                  </>
                );
              }}
            </Form.List>
          </Collapse.Panel>
          <span id="input-bottom"></span>
        </Collapse>
      </Content>
    </PerfectScrollbar>
  );
}

function TypeSelectDropDown({ menu, addCustomType, removeCustomType }) {
  const inputRef = useRef(null);
  return (
    <>
      {menu}
      <Divider
        style={{
          margin: '8px 0',
        }}
      />
      <div className={selectAddItemStyle}>
        <Input
          ref={inputRef}
          placeholder="Please enter item"
          style={{ width: '100%' }}
        />
        <Typography.Link
          onClick={() => {
            console.log('add item', inputRef.current.input.value);
            addCustomType(inputRef.current.input.value);
          }}
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          <PlusOutlined /> Add item
        </Typography.Link>
        <Button
          onClick={() =>
            removeCustomType(inputRef.current.input.value.toUpperCase())
          }
        >
          <PlusOutlined />
        </Button>
      </div>
    </>
  );
}
const headerStyle = css`
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
`;

const collapseStyle = css`
  & > .ant-collapse-item > .ant-collapse-header {
    padding: 5px 10px;
  }
`;

const selectAddItemStyle = css`
  padding: 0 8px 4px;
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const selectTypeStyle = css`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  & .label {
    flex: auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
export default ChallengeInput;
