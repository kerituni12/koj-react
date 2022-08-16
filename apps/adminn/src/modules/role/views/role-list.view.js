import React, { useMemo, useState } from 'react';
import { Table, Radio, Divider, Avatar, Select, Spin } from 'antd';
import { css } from '@emotion/react';
import { useBreakpoint } from '@koj-react/hooks';
import { useQuery } from '@apollo/client';
import { getRoleList } from '../graphql/role.query';
import ErrorFallback from '@/components/error-fallback.component';
import { Link, Navigate } from 'react-router-dom';
const userStyle = css`
  display: flex;
  align-items: center;
  & div>p {
    margin
  }
`;

const columns = [
  {
    title: 'Name',
    key: 'name',
    width: 150,
    dataIndex: 'name',
    ellipsis: true,
    render: (text, record) => (
      <Link
        to="../edit"
        state={{
          role: {
            id: record.id,
            name: record.name,
            key: record.key,
          },
        }}
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Key',
    key: 'key',
    hidden: true,
    dataIndex: 'key',
    width: 80,
    ellipsis: true,
  },

  {
    title: 'Created By',
    key: 'createdByName',
    width: 200,
    dataIndex: 'createdByName',
    render: (text) => <a>{text}</a>,
    // ellipsis: true,
  },
];

const RoleList = () => {
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

  const { data, loading, error } = useQuery(getRoleList);
  if (error) {
    return <ErrorFallback error={error} />;
  }
  if (loading) {
    return (
      <div className="center-screen">
        <Spin size="large" />
      </div>
    );
  }

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

      <Table
        size="small"
        columns={columns}
        dataSource={data.roles}
        scroll={{
          y: 350,
          x: scrollXValue,
        }}
      />
    </div>
  );
};

export default RoleList;
