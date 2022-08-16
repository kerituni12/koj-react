import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '@/modules/user/user.slice';
import { authSuccess } from '@/modules/auth/auth.slice';
import { sidebarItems } from '@/configs/sidebar.config';

function getMenu(items) {
  return items.map((item) => {
    if (!item.children)
      return (
        <Menu.Item style={{ marginTop: 0 }} key={item.key} icon={item.icon}>
          {item.element ? item.element : item.label}
        </Menu.Item>
      );

    return (
      <SubMenu key={item.key} icon={<TeamOutlined />} title={item.label}>
        {getMenu(item.children)}
      </SubMenu>
    );
  });
}
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

// export default function SidebarMenu({ collapsed, onCollapse }) {
//   const location = useLocation();
//   const dispatch = useDispatch();

//   return (
//     <PerfectScrollbar>
//       <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
//         <Menu.Item style={{ marginTop: 0 }} key="1" icon={<PieChartOutlined />}>
//           <p
//             onClick={() => {
//               console.log('click');
//               // dispatch(
//               //   setUser({
//               //     name: { name: 'hieu' },
//               //     permissions: new Set([Math.random()]),
//               //   })
//               // );
//               dispatch(authSuccess(Math.random()));
//             }}
//           >
//             hello
//           </p>
//         </Menu.Item>
//         <Menu.Item key="2" icon={<DesktopOutlined />}>
//           <Link to="/dashboard/user/create"> User create</Link>
//         </Menu.Item>
//         <Menu.Item key="3" icon={<DesktopOutlined />}>
//           <Link to="/dashboard/user/list"> User list</Link>
//         </Menu.Item>
//         <Menu.Item key="33" icon={<DesktopOutlined />}>
//           <Link
//             to={`/signin${'?from=' + encodeURIComponent(location.pathname)}`}
//           >
//             Login
//           </Link>
//         </Menu.Item>
//         <SubMenu key="sub2e" icon={<TeamOutlined />} title="Role">
//           <Menu.Item key="66">
//             <Link to="/dashboard/role/list"> Role list</Link>
//           </Menu.Item>
//           <Menu.Item key="67">
//             <Link to="/dashboard/role/add"> Role add</Link>
//           </Menu.Item>
//           <Menu.Item key="677">
//             <Link to="/dashboard/role/edit"> Role edit</Link>
//           </Menu.Item>
//           <Menu.Item key="58">Team 2</Menu.Item>
//         </SubMenu>
//         <SubMenu key="sub2" icon={<TeamOutlined />} title="Role">
//           <Menu.Item key="6s6">
//             <Link to="/dashboard/role/list"> Role list</Link>
//           </Menu.Item>
//           <Menu.Item key="6s7">
//             <Link to="/dashboard/role/add"> Role add</Link>
//           </Menu.Item>
//           <Menu.Item key="5s8">Team 2</Menu.Item>
//         </SubMenu>
//         <SubMenu key="role" icon={<TeamOutlined />} title="Role">
//           <Menu.Item key="6">Team 1</Menu.Item>
//           <Menu.Item key="8">Team 2</Menu.Item>
//         </SubMenu>
//         <Menu.Item key="9" icon={<FileOutlined />}>
//           Files
//         </Menu.Item>
//         <Menu.Item key="3x" icon={<DesktopOutlined />}>
//           <Link to="/dashboard/user/list"> User list</Link>
//         </Menu.Item>
//       </Menu>
//     </PerfectScrollbar>
//   );
// }
