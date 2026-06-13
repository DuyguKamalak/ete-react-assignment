import { useState } from 'react';
import { Layout, Menu, Button, Typography, Grid, Drawer, theme as antdTheme } from 'antd';
import {
  DashboardOutlined,
  BankOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  BulbOutlined,
  BulbFilled,
  MenuOutlined,
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

function Brand({ short }: { short?: boolean }) {
  const { mode } = useThemeMode();
  return (
    <div
      style={{
        height: 48,
        margin: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: short ? 18 : 20,
        color: mode === 'dark' ? '#fff' : undefined,
      }}
    >
      {short ? 'ETE' : 'ETE Portal'}
    </div>
  );
}

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggle } = useThemeMode();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    token: { colorBgContainer },
  } = antdTheme.useToken();

  // `screens.lg` is undefined until the first measurement; treat that as desktop.
  const isMobile = screens.lg === false;

  const navMenu = (onNavigate?: () => void) => (
    <Menu
      theme={mode}
      mode="inline"
      selectedKeys={[location.pathname]}
      items={items}
      onClick={({ key }) => {
        navigate(key);
        onNavigate?.();
      }}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop: inline collapsible sidebar */}
      {!isMobile && (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme={mode}>
          <Brand short={collapsed} />
          {navMenu()}
        </Sider>
      )}

      {/* Mobile: navigation lives in an overlay drawer so it never squeezes content */}
      {isMobile && (
        <Drawer
          placement="left"
          width={240}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          styles={{ body: { padding: 0 }, header: { display: 'none' } }}
        >
          <Brand />
          {navMenu(() => setDrawerOpen(false))}
        </Drawer>
      )}

      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              />
            )}
            <Typography.Text strong ellipsis>
              {items.find((i) => i.key === location.pathname)?.label ?? 'ETE Portal'}
            </Typography.Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Button
              type="text"
              icon={mode === 'dark' ? <BulbFilled /> : <BulbOutlined />}
              onClick={toggle}
              aria-label="Toggle theme"
            />
            {!isMobile && <Typography.Text type="secondary">{user?.username}</Typography.Text>}
            <Button
              icon={<LogoutOutlined />}
              onClick={logout}
              aria-label="Logout"
            >
              {!isMobile && 'Logout'}
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
