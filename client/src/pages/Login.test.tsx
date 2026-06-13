import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { AuthProvider } from '../context/AuthContext';
import { Login } from './Login';

function renderLogin() {
  return render(
    <AntApp>
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    </AntApp>
  );
}

describe('Login page', () => {
  it('renders the portal title and login/register tabs', () => {
    renderLogin();
    expect(screen.getByText('ETE Portal')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Register' })).toBeInTheDocument();
  });

  it('shows the demo account hint on the login tab', () => {
    renderLogin();
    expect(screen.getByText(/Demo account/i)).toBeInTheDocument();
  });
});
