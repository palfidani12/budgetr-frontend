import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import { Login } from "./components/login/Login";
import { Register } from "./components/register/Register";
import { HomePage } from "./components/home-page/HomePage";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Router = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            } 
          /> {/* Remove this */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
