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
    key: 'user',
    label: 'User',
    icon: <UserOutlined />,
    permissions: 'user.read',
    children: [
      {
        key: 'user-create',
        label: <Link to="/dashboard/challenge/create">Create</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'user-list',
        label: <Link to="/dashboard/user/list">Create</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
    ],
  },
  {
    key: 'challenge',
    label: 'Changlle',
    icon: <CodeOutlined />,
    permissions: 'user.read',
    children: [
      {
        key: 'challenge-create',
        label: <Link to="/dashboard/challenge/create">Create</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'challenge-list',
        label: <Link to="/dashboard/challenge/list">List</Link>,
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
        label: <Link to="/dashboard/file-manager/create">Create</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'fileManager-list',
        label: <Link to="/dashboard/file-manager/list">List</Link>,
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
        label: <Link to="/dashboard/role/create">Create</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'role-list',
        label: <Link to="/dashboard/role/list">List</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'role-edit',
        label: <Link to="/dashboard/role/edit">Edit</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'role-x',
        label: <Link to="/dashboard/role/x">List</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
    ],
  },
  {
    key: 'rolex',
    label: 'Rolexx',
    icon: <TagsOutlined />,
    permissions: 'role.read',
    children: [
      {
        key: 'role-createx',
        label: <Link to="/d/role/create">Create</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'role-editx',
        label: <Link to="/d/role/edit">List</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
      {
        key: 'role-listx',
        label: <Link to="/d/role/list">List</Link>,
        icon: <PlusOutlined />,
        permissions: 'user.read',
      },
    ],
  },
  {
    key: 'course',
    label: <Link to="/d/role/list">List</Link>,
    icon: <BookOutlined />,
    permissions: 'course.read',
  },
  {
    key: 'policy',
    label: <Link to="/signin">Signin</Link>,
    icon: <LockOutlined />,
    permissions: 'policy.read',
  },
];

export const getSidebarChallengeViewItems = (t) => [
  {
    key: 'description',
    label: t('title.description'),
    icon: <FileTextOutlined />,
    permissions: 'user.read',
  },
  {
    key: 'rank',
    label: t('title.rank'),
    icon: <TrophyOutlined />,
    permissions: 'user.read',
  },
  {
    key: 'comment',
    label: t('title.comment'),
    icon: <MessageOutlined />,
    permissions: 'course.read',
  },
  {
    key: 'history',
    label: t('title.history'),
    icon: <HistoryOutlined />,
    permissions: 'policy.read',
  },
  {
    key: 'info',
    label: t('title.info'),
    icon: <InfoCircleOutlined />,
    permissions: 'policy.read',
  },
];
