import { FC, useState, useEffect } from 'react';
import { Tabs, Dropdown, Badge, Spin, List, Avatar, Tag, Tooltip } from 'antd';
import { ReactComponent as NoticeSvg } from '@/assets/images/header/notice.svg';
import { BellOutlined, LoadingOutlined } from '@ant-design/icons';
// import { getNoticeList } from '@/api/layout.api';
import { useSelector } from 'react-redux';
import { css } from '@emotion/css';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { TabPane } = Tabs;
const EventStatus = {
  todo: 'rgba(255,255,255,0.65)',
  urgent: '#f5222d',
  doing: '#faad14',
  processing: '#1890ff',
};
const HeaderNoticeComponent = () => {
  const [visible, setVisible] = useState(false);
  const [noticeList, setNoticeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { noticeCount } = useSelector((state) => state.user);

  const noticeListFilter = (type) => {
    return noticeList.filter((notice) => notice.type === type);
  };

  // loads the notices belonging to logged in user
  // and sets loading flag in-process
  const getNotice = async () => {
    setLoading(true);
    // const { status, result } = await getNoticeList();

    setLoading(false);
    // status && setNoticeList(result);
  };

  useEffect(() => {
    getNotice();
  }, []);

  const tabs = (
    <div>
      <Spin tip="Loading..." indicator={antIcon} spinning={loading}>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={`Notifications(${noticeListFilter('notification').length})`}
            key="1"
          >
            <List
              dataSource={noticeListFilter('notification')}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a href={item.title}>{item.title}</a>}
                    description={item.datetime}
                  />
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane
            tab={`Message(${noticeListFilter('message').length})`}
            key="2"
          >
            <List
              dataSource={noticeListFilter('message')}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a href={item.title}>{item.title}</a>}
                    description={
                      <div className="notice-description">
                        <div className="notice-description-content">
                          {item.description}
                        </div>
                        <div className="notice-description-datetime">
                          {item.datetime}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab={`Todo(${noticeListFilter('event').length})`} key="3">
            <List
              dataSource={noticeListFilter('event')}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div className="notice-title">
                        <div className="notice-title-content">{item.title}</div>
                        <Tag color={EventStatus[item.status]}>{item.extra}</Tag>
                      </div>
                    }
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );

  return (
    <Dropdown
      overlay={tabs}
      overlayClassName={notificationsStyle}
      placement="bottomRight"
      trigger={['click']}
      visible={visible}
      onVisibleChange={(v) => setVisible(v)}
      overlayStyle={{
        width: 336,
        boxShadow:
          'box-shadow: 0 6px 16px -8px rgb(0 0 0 / 8%), 0 9px 28px 0 rgb(0 0 0 / 5%), 0 12px 48px 16px rgb(0 0 0 / 3%)',
        padding: 8,
        borderRadius: 2,
      }}
    >
      <Tooltip title="Notifications">
        <Badge
          style={{ color: '#fff' }}
          count={noticeCount}
          overflowCount={999}
        >
          <BellOutlined style={{ fontSize: '16px', color: '#fff' }} />
        </Badge>
      </Tooltip>
    </Dropdown>
  );
};

const notificationsStyle = css`
  background-color: #fff;
`;
export default HeaderNoticeComponent;
