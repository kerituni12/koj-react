import { DownOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Button, Dropdown, Menu, Space, Tag } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useMemo, useState } from 'react';
import { topicTagOptions } from '../configs/topic-tags.config';

const tagMenuStyle = css`
  padding: 10px;
  max-width: 350px;
  box-shadow: 0px 1px 3px rgb(0 0 0 / 4%), 0px 6px 16px rgb(0 0 0 / 12%);
  background-color: #fff;
`;
const tagsStyle = css`
  padding-top: 10px;
  max-height: 250px;
  overflow: auto;
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
              show more
            </a>
          ) : (
            <a className={showMoreStyle} onClick={() => setIsCollapse(true)}>
              show less
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
      <Button>
        <Space>
          Difficulty
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
