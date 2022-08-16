import { useMemo } from 'react';
import { css } from '@emotion/css';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import ErrorFallback from '@/components/error-fallback.component';
import Icon, { DownOutlined } from '@ant-design/icons';

import {
  Col,
  Row,
  Tag,
  Menu,
  Spin,
  Input,
  Table,
  Space,
  Button,
  Dropdown,
  Carousel,
} from 'antd';

import {
  AILogo,
  GitLogo,
  AllLogo,
  UiUxLogo,
  BigDataLogo,
  FrontendLogo,
  DatabaseLogo,
  AlgorithmLogo,
  ChecklistLogo,
  MigrationLogo,
} from '@/components/type-svg.component';

import { getChallengeList } from '../graphql/challenge.query';
import { TagDropdown } from '../components/tag-dropdown.component';
import { TypeCarousel } from '../components/type-carousel.component';
import { getDifficultyColorTag } from '../components/description-view.component';

import './challenge.css';
import { buttonStyle } from '../styles/button.style';
import 'react-alice-carousel/lib/alice-carousel.css';
import { BlockQuote } from '@/components/block-quote.component';

export const iconsType = [
  { id: '1', type: 'algorithm', icon: AlgorithmLogo },
  { id: '2', type: 'ai', icon: AILogo },
  { id: '3', type: 'bigData', icon: BigDataLogo },
  { id: '4', type: 'all', icon: AllLogo },
  { id: '5', type: 'checklist', icon: ChecklistLogo },
  { id: '6', type: 'database', icon: DatabaseLogo },
  { id: '7', type: 'frontend', icon: FrontendLogo },
  { id: '8', type: 'git', icon: GitLogo },
  { id: '9', type: 'migration', icon: MigrationLogo },
  { id: '10', type: 'uiUx', icon: UiUxLogo },
];

const iconsTypeMap = new Map(iconsType.map((icon) => [icon.id, icon.icon]));

const { Search } = Input;

function getColumnConfigs(t) {
  return [
    {
      title: t('title.type'),
      dataIndex: 'categoryId',
      key: 'type',
      width: 50,
      align: 'center',
      render: (type) => (
        <Icon
          style={{ fontSize: 16 }}
          component={iconsTypeMap.get(type?.toString()) || AllLogo}
        />
      ),
    },
    {
      title: t('title.title'),
      dataIndex: 'title',
      key: 'title',
      // width: '50%',
      render: (text, record) => <Link to={`${record.slug}`}> {text} </Link>,
    },
    {
      title: t('title.difficulty'),
      key: 'difficulty',
      dataIndex: 'difficulty',
      width: '15%',
      ellipsis: true,
      align: 'center',
      render: (difficulty) => (
        <Tag color={getDifficultyColorTag(difficulty)} className="difficulty">
          {t(`title.${difficulty}`)}
        </Tag>
      ),
    },
    {
      title: t('title.acceptance'),
      dataIndex: 'acceptance',
      key: 'acceptance',
      width: '15%',
      align: 'center',
      ellipsis: true,
      render: (text) => <a>{text}</a>,
    },
  ];
}

function DifficultyMenu() {
  const { t } = useTranslation();

  return (
    <Menu
      items={[
        {
          label: t('title.easy'),
          key: 'easy',
        },
        {
          label: t('title.medium'),
          key: 'medium',
        },
        {
          label: t('title.hard'),
          key: 'hard',
        },
      ]}
    />
  );
}

export default function ChallengeList() {
  const { t } = useTranslation();
  const columns = useMemo(() => getColumnConfigs(t), [t]);
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
    <Row justify="center" gutter={16} className={wrapperStyle}>
      <Col md={14} xs={22}>
        <TypeCarousel />
        <div className={wrapperChallengeStyle}>
          <div className={filterStyle}>
            <Dropdown overlay={<DifficultyMenu />}>
              <Button className={buttonStyle}>
                <Space>
                  {t('title.difficulty')}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <div onClick={(e) => e?.stopPropagation()}>
              <TagDropdown />
            </div>
          </div>
          {/* <Search
            placeholder="input search text"
            //   onSearch={onSearch}
            style={{
              width: 200,
            }}
          />
          <Button>Hello</Button> */}
        </div>
        <Table
          size="middle"
          columns={columns}
          dataSource={data.challenges}
          className={tableStyle}
          scroll={{
            y: 400,
          }}
          rowKey={(record) => record.id}
        />
        ;
      </Col>

      <Col md={6} xs={22}>
        <Carousel autoplay>
          <BlockQuote
            author="Kent Beck"
            content="Make it work, make it right, make it fast"
          />

          <BlockQuote
            author="Linus Torvalds"
            content="Talk is cheap. Show me the code"
          />

          <BlockQuote
            author="Abraham Lincoln"
            content="The best way to predict your future is to create it"
          />
        </Carousel>
      </Col>
    </Row>
  );
}

const typeListWrapper = css`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const moreButtonStyle = css`
  width: 120px;
  height: 76px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: rgba(19, 180, 255, 0.08);
  border-radius: 5px;
`;

const wrapperStyle = css`
  padding: 10px 0;
`;

const contentStyle = css`
  height: 160px;
  color: #fff;
  line-height: 160px;
  text-align: center;
  background: #364d79;
`;

const tableStyle = css`
  & .ant-table-thead > tr > th {
    background: transparent;
  }
`;

const wrapperChallengeStyle = css`
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
`;

const searchWrapperStyle = css`
  display: flex;
  flex: auto;
`;

const filterStyle = css`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
