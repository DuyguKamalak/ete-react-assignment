import { useState } from 'react';
import { Card, Form, Input, Button, Tabs, Typography, App as AntApp } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
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
  const { message } = AntApp.useApp();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: Credentials) => {
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(values.username, values.password);
        message.success('Welcome back!');
      } else {
        await register(values.username, values.password);
        message.success('Account created successfully!');
      }
      navigate('/');
    } catch (error) {
      message.error(getErrorMessage(error, 'Authentication failed'));
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
      <Form.Item
        name="username"
        rules={[{ required: true, min: 3, message: 'Username must be at least 3 characters' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" autoComplete="username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" block loading={loading}>
          {mode === 'login' ? 'Log in' : 'Create account'}
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
          ETE Portal
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: 'center' }}>
          Company &amp; Product Management
        </Typography.Paragraph>
        <Tabs
          activeKey={mode}
          onChange={(k) => setMode(k as Mode)}
          centered
          items={[
            { key: 'login', label: 'Login', children: form },
            { key: 'register', label: 'Register', children: form },
          ]}
        />
        {mode === 'login' && (
          <Typography.Paragraph type="secondary" style={{ textAlign: 'center', fontSize: 12 }}>
            Demo account — <b>admin</b> / <b>admin123</b>
          </Typography.Paragraph>
        )}
      </Card>
    </div>
  );
}
