import { BrowserRouter, Route, Routes } from 'react-router';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './components/dashboard/Dashboard';
import { HomePage } from './components/home-page/HomePage';
import { Login } from './components/login/Login';
import { Register } from './components/register/Register';
import App from './App';

export const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
          }
      />
      <Route
        path='/app'
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
          }
      />{' '}
      {/* Remove this */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  </BrowserRouter>
);
