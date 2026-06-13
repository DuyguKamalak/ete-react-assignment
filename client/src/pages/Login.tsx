import { useState } from 'react';
import { Card, Form, Input, Button, Tabs, Typography, App as AntApp } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';

type Mode = 'login' | 'register';
interface Credentials {
  username: string;
  password: string;
}

export function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { message } = AntApp.useApp();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: Credentials) => {
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(values.username, values.password);
        message.success(t('login.welcome'));
      } else {
        await register(values.username, values.password);
        message.success(t('login.created'));
      }
      navigate('/');
    } catch (error) {
      message.error(getErrorMessage(error, t('login.failed')));
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
      <Form.Item
        name="username"
        rules={[{ required: true, min: 3, message: t('login.usernameRule') }]}
      >
        <Input prefix={<UserOutlined />} placeholder={t('login.username')} autoComplete="username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, min: 6, message: t('login.passwordRule') }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={t('login.password')}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" block loading={loading}>
          {mode === 'login' ? t('login.loginBtn') : t('login.registerBtn')}
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'linear-gradient(135deg, #1677ff22, #52c41a22)',
      }}
    >
      <Card style={{ width: 400, maxWidth: '100%' }}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 4 }}>
          {t('common.appName')}
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: 'center' }}>
          {t('login.subtitle')}
        </Typography.Paragraph>
        <Tabs
          activeKey={mode}
          onChange={(k) => setMode(k as Mode)}
          centered
          items={[
            { key: 'login', label: t('login.login'), children: form },
            { key: 'register', label: t('login.register'), children: form },
          ]}
        />
        {mode === 'login' && (
          <Typography.Paragraph type="secondary" style={{ textAlign: 'center', fontSize: 12 }}>
            <Trans i18nKey="login.demoHint" />
          </Typography.Paragraph>
        )}
      </Card>
    </div>
  );
}
