import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { Router } from "./Router.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
