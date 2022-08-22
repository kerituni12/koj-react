import KojLayout from '@/components/layout.component';
import { DownOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import {
  Col,
  Row,
  Select,
  Input,
  Table,
  Tag,
  Dropdown,
  Button,
  Space,
  Menu,
  Carousel,
} from 'antd';
import { getDifficultyColorTag } from '../components/description-view.component';
import { TagDropdown } from '../components/tag-dropdown.component';

const { Search } = Input;

const columns = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 50,
    align: 'center',
    render: (text) => <PlusCircleOutlined />,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    // width: '50%',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Difficulty',
    key: 'difficulty',
    dataIndex: 'difficulty',
    width: '10%',
    align: 'center',
    render: (difficulty) => (
      <Tag color={getDifficultyColorTag(difficulty)} className="difficulty">
        {difficulty}
      </Tag>
    ),
  },
  {
    title: 'Acceptance',
    dataIndex: 'acceptance',
    key: 'acceptance',
    width: '15%',
    align: 'center',
    ellipsis: true,
    render: (text) => <a>{text}</a>,
  },
];
const data = [
  {
    key: '1',
    type: 'alogrithm',
    title: 'John Brown',
    difficulty: 'easy',
    acceptance: 20,
  },
  {
    key: '2',
    type: 'alogrithm',
    title: 'Jim Green',
    difficulty: 'hard',
    acceptance: 20,
  },
  {
    key: '3',
    type: 'alogrithm',
    title: 'Joe Black',
    difficulty: 'medium',
    acceptance: 20,
  },
  {
    key: '1',
    type: 'alogrithm',
    title: 'John Brown',
    difficulty: 'easy',
    acceptance: 20,
  },
  {
    key: '2',
    type: 'alogrithm',
    title: 'Jim Green',
    difficulty: 'hard',
    acceptance: 20,
  },
  {
    key: '3',
    type: 'alogrithm',
    title: 'Joe Black',
    difficulty: 'medium',
    acceptance: 20,
  },
  {
    key: '1',
    type: 'alogrithm',
    title: 'John Brown',
    difficulty: 'easy',
    acceptance: 20,
  },
  {
    key: '2',
    type: 'alogrithm',
    title: 'Jim Green',
    difficulty: 'hard',
    acceptance: 20,
  },
  {
    key: '3',
    type: 'alogrithm',
    title: 'Joe Black',
    difficulty: 'medium',
    acceptance: 20,
  },
  {
    key: '1',
    type: 'alogrithm',
    title: 'John Brown',
    difficulty: 'easy',
    acceptance: 20,
  },
  {
    key: '2',
    type: 'alogrithm',
    title: 'Jim Green',
    difficulty: 'hard',
    acceptance: 20,
  },
  {
    key: '3',
    type: 'alogrithm',
    title: 'Joe Black',
    difficulty: 'medium',
    acceptance: 20,
  },
  {
    key: '1',
    type: 'alogrithm',
    title: 'John Brown',
    difficulty: 'easy',
    acceptance: 20,
  },
  {
    key: '2',
    type: 'alogrithm',
    title: 'Jim Green',
    difficulty: 'hard',
    acceptance: 20,
  },
  {
    key: '3',
    type: 'alogrithm',
    title: 'Joe Black',
    difficulty: 'medium',
    acceptance: 20,
  },
];

const difficultyMenu = (
  <Menu
    // onClick={handleMenuClick}
    items={[
      {
        label: 'Easy',
        key: 'easy',
        // icon: <UserOutlined />,
      },
      {
        label: 'Difficulty',
        key: 'difficulty',
        // icon: <UserOutlined />,
      },
      {
        label: 'Hard',
        key: 'hard',
        // icon: <UserOutlined />,
      },
    ]}
  />
);

const colors = [
  '#4465ae',
  '#e80070',
  '#7a00e5',
  '#ef8037',
  '#ffb314',
  '#00c5d6',
  '#3e2773',
  '#f23e16',
  '#50c82a',
  '#fb5f19',
  '#7249b5',
  '#21a6dc',
  '#2e39a3',
  '#3d9eff',
  '#f21600',
  '#00e49c',
  '#a800e2',
  '#ef00d7',
];

const typeList = [
  { title: 'Algorithm', description: 'problems', color: '#3d9eff' },
  { title: 'Algorithm', description: 'problems', color: '#f21600' },
  { title: 'Algorithm', description: 'problems', color: '#00e49c' },
  { title: 'Algorithm', description: 'problems', color: '#a800e2' },
  { title: 'Algorithm', description: 'problems', color: '#ef00d7' },
];

export default function ChallengeSet() {
  return (
    <KojLayout>
      <Row gutter={16} className={wrapperStyle}>
        <Col span={2} />
        <Col span={14}>
          <div className={typeListWrapper}>
            {typeList.map(({ color, title, description }, index) => (
              <TypeList key={index} color={color}>
                <p className="title">{title}</p>
                <span>{description}</span>
              </TypeList>
            ))}
            <div className={moreButtonStyle}>
              <a>More</a>
            </div>
          </div>
          <div className={wrapperChallengeStyle}>
            <div className={filterStyle}>
              <Dropdown overlay={difficultyMenu}>
                <Button className={buttonStyle}>
                  <Space>
                    Difficulty
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
              <Dropdown overlay={difficultyMenu}>
                <Button className={buttonStyle}>
                  <Space>
                    Difficulty
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
              <div onClick={(e) => e?.stopPropagation()}>
                <TagDropdown />
              </div>
            </div>
            <Search
              placeholder="input search text"
              //   onSearch={onSearch}
              style={{
                width: 200,
              }}
            />
            <Button>Hello</Button>
          </div>
          <Table
            size="small"
            columns={columns}
            dataSource={data}
            className={tableStyle}
            scroll={{
              y: 400,
            }}
          />
          ;
        </Col>
        <Col span={6}>
          <Carousel autoplay>
            <div>
              <h3 className={contentStyle}>1</h3>
            </div>
            <div>
              <h3 className={contentStyle}>2</h3>
            </div>
            <div>
              <h3 className={contentStyle}>3</h3>
            </div>
            <div>
              <h3 className={contentStyle}>4</h3>
            </div>
          </Carousel>
        </Col>
        <Col span={2} />
      </Row>
    </KojLayout>
  );
}

const TypeList = styled.div`
  background-color: ${(props) => props.color || '#2E3192'};
  color: #fff;
  width: 120px;
  height: 76px;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
`;

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
const buttonStyle = css`
  // border: 1px;
  // border-radius: 4px;

  // & :hover {
  //   background-color: #000a201a;
  // }
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
