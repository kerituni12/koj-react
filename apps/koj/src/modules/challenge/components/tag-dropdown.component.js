import { css } from '@emotion/css';
import { useMemo, useState } from 'react';
import Search from 'antd/lib/input/Search';
import { useTranslation } from 'react-i18next';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space, Tag } from 'antd';

import { buttonStyle } from '../styles/button.style';
import { topicTagOptions } from '../configs/topic-tags.config';

const tagMenuStyle = css`
  padding: 10px;
  max-width: 350px;
  background-color: #fff;
  box-shadow: 0px 1px 3px rgb(0 0 0 / 4%), 0px 6px 16px rgb(0 0 0 / 12%);
`;
const tagsStyle = css`
  overflow: auto;
  padding-top: 10px;
  max-height: 250px;
  & .ant-tag {
    margin-bottom: 8px;
  }
`;
const showMoreStyle = css`
  display: block;
  text-align: center;
`;

function renderTopicTags(topicTags, isCollapse, callback) {
  if (topicTags.length < 10 || !isCollapse) {
    return topicTagOptions.map((tag) => (
      <Tag key={tag.id} onClick={callback}>
        {tag.name}
      </Tag>
    ));
  }
  return topicTags.slice(0, 20).map((tag) => (
    <Tag key={tag.id} onClick={callback}>
      {tag.name}
    </Tag>
  ));
}

export function TagDropdown() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [isCollapse, setIsCollapse] = useState(true);

  const handleMenuClick = (e) => {
    setVisible(false);
  };

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const menu = useMemo(() => (
    <div className={tagMenuStyle}>
      <Search
        placeholder="input search text"
        //   onSearch={onSearch}
        style={{
          width: '100%',
        }}
      />
      <div className={tagsStyle}>
        {renderTopicTags(topicTagOptions, isCollapse, handleMenuClick)}
        {topicTagOptions.length > 20 ? (
          isCollapse ? (
            <a className={showMoreStyle} onClick={() => setIsCollapse(false)}>
              {t('title.show_more')}
            </a>
          ) : (
            <a className={showMoreStyle} onClick={() => setIsCollapse(true)}>
              {t('title.show_less')}
            </a>
          )
        ) : null}
      </div>
    </div>
  ));

  return (
    <Dropdown
      overlay={menu}
      onVisibleChange={handleVisibleChange}
      visible={visible}
    >
      <Button className={buttonStyle}>
        <Space>
          {t('title.tag')}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
