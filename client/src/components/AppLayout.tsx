import { useState } from 'react';
import { Layout, Menu, Button, Typography, Grid, Drawer, Segmented, theme as antdTheme } from 'antd';
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
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { setLanguage } from '../i18n';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const navKeys = [
  { key: '/', icon: <DashboardOutlined />, label: 'nav.dashboard' },
  { key: '/companies', icon: <BankOutlined />, label: 'nav.companies' },
  { key: '/products', icon: <AppstoreOutlined />, label: 'nav.products' },
];

function Brand({ short }: { short?: boolean }) {
  const { mode } = useThemeMode();
  const { t } = useTranslation();
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
      {short ? 'ETE' : t('common.appName')}
    </div>
  );
}

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { mode, toggle } = useThemeMode();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    token: { colorBgContainer },
  } = antdTheme.useToken();

  const isMobile = screens.lg === false;
  const items = navKeys.map((i) => ({ key: i.key, icon: i.icon, label: t(i.label) }));
  const currentTitle = navKeys.find((i) => i.key === location.pathname);

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
      {!isMobile && (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme={mode}>
          <Brand short={collapsed} />
          {navMenu()}
        </Sider>
      )}

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
              {currentTitle ? t(currentTitle.label) : t('common.appName')}
            </Typography.Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Segmented
              size="small"
              value={i18n.language === 'tr' ? 'tr' : 'en'}
              onChange={(val) => setLanguage(val as 'en' | 'tr')}
              options={[
                { label: 'EN', value: 'en' },
                { label: 'TR', value: 'tr' },
              ]}
            />
            <Button
              type="text"
              icon={mode === 'dark' ? <BulbFilled /> : <BulbOutlined />}
              onClick={toggle}
              aria-label="Toggle theme"
            />
            {!isMobile && <Typography.Text type="secondary">{user?.username}</Typography.Text>}
            <Button icon={<LogoutOutlined />} onClick={logout} aria-label={t('common.logout')}>
              {!isMobile && t('common.logout')}
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
