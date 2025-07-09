import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import { Login } from "./components/login/Login";
import { Register } from "./components/register/Register";
import { HomePage } from "./components/home-page/HomePage";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<App />} /> {/* Remove this */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};
