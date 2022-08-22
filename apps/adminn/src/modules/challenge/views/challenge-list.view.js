import React, { useMemo, useState } from 'react';
import { Table, Radio, Divider, Avatar, Select, Spin } from 'antd';
import { css } from '@emotion/react';
import { useBreakpoint } from '@koj-react/hooks';
import { useQuery } from '@apollo/client';
import { getChallengeList } from '../graphql/challenge.query';
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
    title: 'Title',
    key: 'title',
    width: 150,
    dataIndex: 'title',
    ellipsis: true,
    render: (text, record) => (
      <Link
        to={`../edit/${record.slug}`}
        state={{
          challenge: {
            id: record.id,
            slug: record.slug,
          },
        }}
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    hidden: true,
    dataIndex: 'status',
    width: 80,
    ellipsis: true,
  },
  {
    title: 'Difficulty',
    key: 'difficulty',
    hidden: true,
    dataIndex: 'difficulty',
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

const ChallengeList = () => {
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

  const { data, loading, error } = useQuery(getChallengeList);
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
      <Table
        size="small"
        columns={columns}
        dataSource={data.challenges}
        scroll={{
          y: 350,
          x: scrollXValue,
        }}
        rowKey={(record) => record.id}
      />
    </div>
  );
};

export default ChallengeList;
