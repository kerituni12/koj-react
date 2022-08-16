import { Menu } from 'antd';

export default function SidebarMenu({ items, callback, selectedKeys }) {
  return (
    <Menu
      theme="dark"
      mode="inline"
      items={items}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={items?.[0].key || ''}
      onClick={({ key }) => callback(key)}
    />
  );
}
