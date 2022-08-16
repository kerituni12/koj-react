import dayjs from 'dayjs';
import { Spin, Table } from 'antd';
import { useQuery } from '@apollo/client';

import ErrorFallback from '@/components/error-fallback.component';

import { defaultLanguages } from '../configs/languages.config';
import { getSubmissionRank } from '../graphql/submission.query';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

const getSubmissionRankColumns = (t) => [
  {
    title: t('title.stt'),
    key: 'stt',
    width: '10%',
    render: (text, record, index) => index,
  },
  {
    title: t('title.name'),
    dataIndex: 'createdByUsername',
    ellipsis: true,
    width: '25%',
    key: 'name',
  },
  {
    title: t('title.language'),
    dataIndex: 'languageId',
    key: 'language',
    width: '20%',
    align: 'center',
    ellipsis: true,
    render: (languageId) => {
      return (
        defaultLanguages.find((language) => language.id === languageId).name ||
        ''
      );
    },
  },
  {
    title: t('title.score'),
    dataIndex: 'score',
    width: '15%',
    align: 'center',
  },
  {
    title: t('title.time'),
    dataIndex: 'lastSubmitTime',
    key: 'time',
    align: 'center',
    render: (time) => {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];

export function SubmissionRank({ challenge }) {
  const { t } = useTranslation();
  const columns = useMemo(() => getSubmissionRankColumns(t), [t]);

  const { data, loading, error } = useQuery(getSubmissionRank, {
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
      dataSource={data.ranks}
      pagination={false}
      rowKey={(record) => record.id}
    />
  );
}
