import React, { useMemo, useState } from 'react';
import { Table, Radio, Divider, Avatar, Select } from 'antd';
import { css } from '@emotion/react';
import { useBreakpoint } from '@koj-react/hooks';
const userStyle = css`
  display: flex;
  align-items: center;
  & div>p {
    margin
  }
`;

const columns = [
  {
    title: 'User',
    key: 'user',
    width: 150,
    ellipsis: true,
    render: (text, record) => {
      return (
        <>
          <Avatar src={record.avatar()} style={{ marginRight: 10 }} />
          {record.name}
        </>
      );
    },
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
    width: 150,
    ellipsis: true,
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
    width: 150,
    ellipsis: true,
    responsive: ['md', 'sm'],
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
    width: 150,
    responsive: ['md', 'sm'],
    ellipsis: true,
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
    width: 150,
    ellipsis: true,
    responsive: ['md', 'sm'],
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
    width: 150,
    responsive: ['md', 'sm'],
    ellipsis: true,
  },
  {
    width: 80,
    ellipsis: true,
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    responsive: ['sm'],
    // textWrap: 'word-break',
  },
  {
    title: 'Role',
    key: 'role',
    width: 200,
    dataIndex: 'roles',
    render: (roles) => <Role roles={roles} />,
  },
  {
    title: 'Group',
    key: 'group',
    width: 100,
    dataIndex: 'group',
    render: (text) => <a>{text}</a>,
    // ellipsis: true,
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    email: 'hello@gmail.comddfdfsfsdf',
    age: 32,
    address: 'New York No. 1 Lake Park',
    roles: ['admin', 'user'],
    avatar: function () {
      return `https://pixinvent.com/demo/vuexy-vuejs-laravel-admin-template/demo-1/images/avatars/${this.key}.png`;
    },
  },
  {
    key: '2',
    name: 'Jim Greendsfsdfsdfssdfsdfddsfsdf',
    email: 'hello@gmail.com',
    age: 42,
    address: 'London No. 1 Lake Park',
    roles: ['admin', 'editor'],
    avatar: function () {
      return `https://pixinvent.com/demo/vuexy-vuejs-laravel-admin-template/demo-1/images/avatars/${this.key}.png`;
    },
  },
  {
    key: '3',
    name: 'Joe Black',
    email: 'hello@gmail.com',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    roles: ['admin'],
    avatar: function () {
      return `https://pixinvent.com/demo/vuexy-vuejs-laravel-admin-template/demo-1/images/avatars/${this.key}.png`;
    },
  },
  {
    key: '4',
    name: 'Disabled User',
    email: 'hello@gmail.com',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
    roles: ['admin'],
    avatar: function () {
      return `https://pixinvent.com/demo/vuexy-vuejs-laravel-admin-template/demo-1/images/avatars/${this.key}.png`;
    },
  },
  {
    key: '11',
    name: 'John Brown',
    email: 'hello@gmail.com',
    age: 32,
    address: 'New York No. 1 Lake Park',
    roles: ['admin', 'user'],
    avatar: function () {
      return `https://pixinvent.com/demo/vuexy-vuejs-laravel-admin-template/demo-1/images/avatars/${this.key}.png`;
    },
  },
  {
    key: '12',
    name: 'Jim Green',
    email: 'hello@gmail.com',
    age: 42,
    address: 'London No. 1 Lake Park',
    roles: ['admin', 'editor'],
    avatar: function () {
      return `https://pixinvent.com/demo/vuexy-vuejs-laravel-admin-template/demo-1/images/avatars/${this.key}.png`;
    },
  },
  {
    key: '13',
    name: 'Joe Black',
    email: 'hello@gmail.com',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    roles: ['admin'],
    avatar: function () {
      return `https://pixinvent.com/demo/vuexy-vuejs-laravel-admin-template/demo-1/images/avatars/${this.key}.png`;
    },
  },
  {
    key: '14',
    name: 'Disabled User',
    email: 'hello@gmail.com',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
    roles: ['admin'],
    avatar: function () {
      return `https://pixinvent.com/demo/vuexy-vuejs-laravel-admin-template/demo-1/images/avatars/${this.key}.png`;
    },
  },
  {
    key: '111',
    name: 'John Brown',
    email: 'hello@gmail.com',
    age: 32,
    address: 'New York No. 1 Lake Park',
    roles: ['admin', 'user'],
    avatar: function () {
      return `https://pixinvent.com/demo/vuexy-vuejs-laravel-admin-template/demo-1/images/avatars/${this.key}.png`;
    },
  },
  {
    key: '112',
    name: 'Jim Green',
    email: 'hello@gmail.com',
    age: 42,
    address: 'London No. 1 Lake Park',
    roles: ['admin', 'editor'],
    avatar: function () {
      return `https://pixinvent.com/demo/vuexy-vuejs-laravel-admin-template/demo-1/images/avatars/${this.key}.png`;
    },
  },
  {
    key: '113',
    name: 'Joe Black',
    email: 'hello@gmail.com',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    roles: ['admin'],
    avatar: function () {
      return `https://pixinvent.com/demo/vuexy-vuejs-laravel-admin-template/demo-1/images/avatars/${this.key}.png`;
    },
  },
  {
    key: '114',
    name: 'Disabled User',
    email: 'hello@gmail.com',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
    roles: ['admin'],
    avatar: function () {
      return `https://pixinvent.com/demo/vuexy-vuejs-laravel-admin-template/demo-1/images/avatars/${this.key}.png`;
    },
  },
]; // rowSelection object indicates the need for row selection
const options = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
  { label: 'Editor', value: 'editor' },
];
const Role = ({ roles }) => {
  return (
    <>
      <Select
        mode="multiple"
        style={{
          width: '100%',
        }}
        defaultValue={roles}
        // defaultValue={options[0].id}
        options={options}
        onChange={(newValue) => {
          // setRole(newValue.id);
        }}
        placeholder="Select Item..."
        maxTagCount="responsive"
      />
    </>
  );
};
const rowSelection = {
  // onChange: (selectedRowKeys, selectedRows) => {
  //   console.log(
  //     `selectedRowKeys: ${selectedRowKeys}`,
  //     'selectedRows: ',
  //     selectedRows
  //   );
  // },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};

const RoleList = () => {
  console.log('role ;ist');

  const [selectionType, setSelectionType] = useState('checkbox');
  const screens = useBreakpoint();
  const scrollXValue = useMemo(
    () =>
      columns.reduce((previousValue, currentValue) => {
        if (!currentValue?.responsive?.includes(screens)) {
          return previousValue;
        }
        console.log(previousValue + currentValue.width || 100);
        return previousValue + currentValue.width || 100;
      }, 0),
    [screens]
  );
  return (
    <div>
      <Radio.Group
        onChange={({ target: { value } }) => {
          setSelectionType(value);
        }}
        value={selectionType}
        style={{ marginBottom: 10 }}
      >
        <Radio value="checkbox">Checkbox</Radio>
        <Radio value="radio">radio</Radio>
      </Radio.Group>
      <p>h</p>
      <p>h</p>
      <p>h</p>
      <p>h</p>

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        size="small"
        columns={columns}
        dataSource={data}
        scroll={{
          y: 450,
          x: scrollXValue,
        }}
      />
    </div>
  );
};

export default RoleList;
