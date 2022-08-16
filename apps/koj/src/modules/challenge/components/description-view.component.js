import { css } from '@emotion/css';
import { Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { html } from '@/utils/format-search';

export function getDifficultyColorTag(difficulty) {
  if (difficulty === 'easy') return 'green';
  if (difficulty === 'medium') return 'orange';
  if (difficulty === 'hard') return 'red';
  return 'default';
}

function DescriptionView({ challenge }) {
  const { t } = useTranslation();
  return (
    <>
      <div className={titleStyle}>
        <Typography.Title level={3}>{challenge.title}</Typography.Title>
        <div className={statusBarStyle}>
          <Tag
            color={getDifficultyColorTag(challenge.difficulty)}
            className="difficulty"
          >
            {t(`title.${challenge.difficulty}`)}
          </Tag>
          <div className="like">{challenge.like}</div>
        </div>
      </div>
      <div className={contentStyle}>{html(challenge.description)}</div>
    </>
  );
}

const statusBarStyle = css`
  display: flex;
`;
const contentStyle = css`
  padding: 10px 0;
`;
const titleStyle = css`
  padding-bottom: 10px;
  border-bottom: 1px solid #cbc8c8;
`;

export default DescriptionView;
