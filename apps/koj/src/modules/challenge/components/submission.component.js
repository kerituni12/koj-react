import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Spin, Table } from 'antd';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import ErrorFallback from '@/components/error-fallback.component';

import { defaultLanguages } from '../configs/languages.config';
import { getSubmissionByUser } from '../graphql/submission.query';

const getSubmissionColumns = (t) => [
  {
    title: t('title.stt'),
    key: 'stt',
    width: '10%',
    render: (text, record, index) => index,
  },

  {
    title: t('title.language'),
    dataIndex: 'languageId',
    key: 'language',
    width: '20%',
    align: 'center',
    ellipsis: true,
    render: (languageId) =>
      defaultLanguages.find((language) => language.id === languageId).name ||
      '',
  },

  {
    title: t('title.testcase'),
    dataIndex: 'info',
    width: '15%',
    key: 'testcase',
    align: 'center',
    render: (info) => {
      return info?.testcasePassCount !== undefined
        ? `${info?.testcasePassCount}/${info?.testcaseCount}`
        : '0/0';
    },
  },
  {
    title: t('title.score'),
    dataIndex: 'info',
    width: '15%',
    key: 'score',
    align: 'center',
    render: (info) => {
      return info?.score || 0;
    },
  },
  {
    title: t('title.time'),
    dataIndex: 'createdAt',
    key: 'time',
    align: 'center',
    render: (time) => {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];

export function Submission({ challenge }) {
  const { t } = useTranslation();
  const columns = useMemo(() => getSubmissionColumns(t), [t]);
  const { data, loading, error } = useQuery(getSubmissionByUser, {
    variables: {
      where: {
        challengeId: Number(challenge.id),
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    },
    fetchPolicy: 'cache-and-network',
  });

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
    <Table
      size="small"
      columns={columns}
      dataSource={data.submissions}
      pagination={false}
      rowKey={(record) => record.id}
    />
  );
}
