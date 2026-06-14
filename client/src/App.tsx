import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { api } from './api/client';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Companies } from './pages/Companies';
import { CompanyDetail } from './pages/CompanyDetail';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';

export default function App() {
  // Pre-warm the backend on load so a sleeping free-tier instance is waking up
  // while the user reads the login page — keeps the first real request snappy.
  useEffect(() => {
    api.get('/health').catch(() => {});
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
