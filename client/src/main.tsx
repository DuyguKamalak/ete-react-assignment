import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme as antdTheme, App as AntApp } from 'antd';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeModeProvider, useThemeMode } from './context/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

function ThemedApp() {
  const { mode } = useThemeMode();
  return (
    <ConfigProvider
      theme={{
        algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: { colorPrimary: '#1677ff' },
      }}
    >
      <AntApp>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <ThemedApp />
      </ThemeModeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
