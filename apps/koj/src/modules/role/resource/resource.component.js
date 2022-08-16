import { Menu } from 'antd';

export function Resource({ resources, setCurrentResource, currentResource }) {
  return (
    <Menu defaultSelectedKeys={currentResource} mode="inline">
      {resources.map((resource) => {
        return (
          <Menu.Item
            style={{ marginTop: 0 }}
            key={resource.key}
            icon={resource.icon}
            onClick={() => setCurrentResource(resource.key)}
          >
            <b>{resource.label}</b>
          </Menu.Item>
        );
      })}
    </Menu>
  );
}
