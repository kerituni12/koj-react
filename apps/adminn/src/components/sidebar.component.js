import { Menu } from 'antd';

export default function SidebarMenu({ items, callback }) {
  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={items?.[0].key || ''}
      mode="inline"
      items={items}
      onClick={({ key }) => callback(key)}
    >
      {/* {getMenu(items)} */}
    </Menu>
  );
}
