import { Layout, Menu, Breadcrumb } from 'antd';

import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function Dashboard(props) {
  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        // width="48px"
        collapsedWidth={48}
      >
        <div
          className="logos"
          style={{ height: '48px', backgroundColor: '#fff' }}
        />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          // inlineIndent={16}
        >
          <Menu.Item
            style={{ marginTop: 0 }}
            key="1"
            icon={<PieChartOutlined />}
          >
            Option 1
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <SubMenu key="sub6" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />}>
            Files
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ height: '48px', backgroundColor: '#fff' }} />
        <Content style={{ margin: '5px' }}>
          <div style={{ padding: 5, minHeight: 'calc(100vh - 102px)' }}>
            Bill is a cat.
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
