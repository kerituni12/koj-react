import ErrorFallback from '@/components/error-fallback.component';
import { useQuery } from '@apollo/client';
import { css } from '@emotion/css';
import { Input, Table, Tag, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { getDifficultyColorTag } from '../components/description-view.component';
import { getChallengeList } from '../graphql/challenge.query';
const columns = [
  {
    title: 'STT',
    key: 'stt',
    // width: '50%',
    render: (text, record, index) => index,
  },
  {
    title: 'Language',
    dataIndex: 'language',
    key: 'language',
  },
  {
    title: 'Result',
    dataIndex: 'result',
    key: 'result',
  },
  {
    title: 'Point',
    key: 'point',
    dataIndex: 'point',
    width: '10%',
    align: 'center',
    render: (difficulty) => (
      <Tag color={getDifficultyColorTag(difficulty)} className="difficulty">
        {difficulty}
      </Tag>
    ),
  },
  {
    title: 'Time Execute',
    key: 'timeExecute',
    dataIndex: 'timeExecute',
    width: '10%',
    align: 'center',
  },
  {
    title: 'Submit Time',
    key: 'submitTime',
    dataIndex: 'submitTime',
  },
];

export default function ChallengeHistory() {
  //   const { data, loading, error } = useQuery(getChallengeList);
  //   if (error) {
  //     return <ErrorFallback error={error} />;
  //   }
  //   if (loading) {
  //     return (
  //       <div className="center-screen">
  //         <Spin size="large" />
  //       </div>
  //     );
  //   }

  return (
    <Table
      size="middle"
      columns={columns}
      dataSource={[]}
      className={tableStyle}
      scroll={{
        y: '90%',
      }}
      rowKey={(record) => record.id}
    />
  );
}

const tableStyle = css`
  & .ant-table-thead > tr > th {
    background: transparent;
  }
`;
