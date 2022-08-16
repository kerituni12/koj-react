import { html } from '@/utils/format-search';
import { css } from '@emotion/css';
import { Tag, Typography } from 'antd';
import { Divider as KojDivider } from '@/components/divider.component';

export function getDifficultyColorTag(difficulty) {
  if (difficulty === 'easy') return 'green';
  if (difficulty === 'medium') return 'orange';
  if (difficulty === 'har') return 'red';
  return 'default';
}
function DescriptionView({ challenge }) {
  return (
    <>
      <div className={titleStyle}>
        <Typography.Title level={3}>{challenge.title}</Typography.Title>
        <div className={statusBarStyle}>
          <Tag
            color={getDifficultyColorTag(challenge.difficulty)}
            className="difficulty"
          >
            {challenge.difficulty}
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
