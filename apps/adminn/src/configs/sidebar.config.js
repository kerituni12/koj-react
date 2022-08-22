import {
  BookOutlined,
  CodeOutlined,
  FileTextOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  LockOutlined,
  MessageOutlined,
  PlusOutlined,
  TagsOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const sidebarItems = [
  {
    key: 'challenge',
    label: 'Changlle',
    icon: <CodeOutlined />,
    permissions: 'user.read',
    children: [
      {
        key: 'challenge-create',
        label: <Link to="/challenge/create">Create</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'challenge-list',
        label: <Link to="/challenge/list">List</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
    ],
  },
  {
    key: 'user',
    label: 'User',
    icon: <UserOutlined />,
    permissions: 'user.read',
    children: [
      {
        key: 'user-create',
        label: <Link to="/challenge/create">Create</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'user-list',
        label: <Link to="/user/list">Create</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
    ],
  },
  {
    key: 'role',
    label: 'Role',
    icon: <TeamOutlined />,
    permissions: 'group.read',
    children: [
      {
        key: 'role-create',
        label: <Link to="/role/create">Create</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'role-list',
        label: <Link to="/role/list">List</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'role-edit',
        label: <Link to="/role/edit">Edit</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'role-x',
        label: <Link to="/role/x">List</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
    ],
  },
  {
    key: 'fileManager',
    label: 'File Manager',
    icon: <CodeOutlined />,
    permissions: 'user.read',
    children: [
      {
        key: 'fileManager-create',
        label: <Link to="/file-manager/create">Create</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'fileManager-list',
        label: <Link to="/file-manager/list">List</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
    ],
  },
  // {
  //   key: 'course',
  //   label: <Link to="/d/role/list">List</Link>,
  //   icon: <BookOutlined />,
  //   permissions: 'course.read',
  // },
  {
    key: 'policy',
    label: <Link to="/signin">Signin</Link>,
    icon: <LockOutlined />,
    permissions: 'policy.read',
  },
];

export const sidebarChallengeViewItems = [
  {
    key: 'description',
    label: 'Description',
    icon: <FileTextOutlined />,
    permissions: 'user.read',
  },
  {
    key: 'rank',
    label: 'Rank',
    icon: <TrophyOutlined />,
    permissions: 'user.read',
  },
  {
    key: 'comment',
    label: 'Comment',
    icon: <MessageOutlined />,
    permissions: 'course.read',
  },
  {
    key: 'history',
    label: 'History',
    icon: <HistoryOutlined />,
    permissions: 'policy.read',
  },
  {
    key: 'info',
    label: 'Info',
    icon: <InfoCircleOutlined />,
    permissions: 'policy.read',
  },
];
