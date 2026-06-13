import { useState } from 'react';
import { Layout, Menu, Button, Typography, Grid, theme as antdTheme } from 'antd';
import {
  DashboardOutlined,
  BankOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const items = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/companies', icon: <BankOutlined />, label: 'Companies' },
  { key: '/products', icon: <AppstoreOutlined />, label: 'Products' },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggle } = useThemeMode();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = antdTheme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={screens.xs ? 0 : 80}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme={mode}
      >
        <div
          style={{
            height: 48,
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: collapsed ? 18 : 20,
            color: mode === 'dark' ? '#fff' : undefined,
          }}
        >
          {collapsed ? 'ETE' : 'ETE Portal'}
        </div>
        <Menu
          theme={mode}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography.Text strong>
            {items.find((i) => i.key === location.pathname)?.label ?? 'ETE Portal'}
          </Typography.Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              type="text"
              icon={mode === 'dark' ? <BulbFilled /> : <BulbOutlined />}
              onClick={toggle}
              aria-label="Toggle theme"
            />
            <Typography.Text type="secondary">{user?.username}</Typography.Text>
            <Button icon={<LogoutOutlined />} onClick={logout}>
              Logout
            </Button>
          </div>
        </Header>
        <Content style={{ margin: 16 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
