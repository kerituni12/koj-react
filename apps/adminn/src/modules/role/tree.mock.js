import {
  BookOutlined,
  LockOutlined,
  TeamOutlined,
  UserOutlined,
  TagsOutlined,
} from '@ant-design/icons';

export const tree = [
  {
    title: 'Koj',
    key: '0',
    children: [
      {
        title: 'koj 1-0',
        key: '0-1',
      },
      {
        title: 'koj 1-1',
        key: '0-2',
      },
      {
        title: 'koj 1-2',
        key: '0-3',
      },
    ],
  },
];

export const resources = [
  {
    key: 'user',
    label: 'User',
    icon: <UserOutlined />,
    permissions: 'user.read',
  },
  {
    key: 'group',
    label: 'Group',
    icon: <TeamOutlined />,
    permissions: 'group.read',
  },
  {
    key: 'role',
    label: 'Role',
    icon: <TagsOutlined />,
    permissions: 'role.read',
  },
  {
    key: 'course',
    label: 'Course',
    icon: <BookOutlined />,
    permissions: 'course.read',
  },
  {
    key: 'policy',
    label: 'Policy',
    icon: <LockOutlined />,
    permissions: 'policy.read',
  },
];
