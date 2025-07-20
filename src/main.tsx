import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { Router } from "./Router.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { ModalProvider } from "./providers/ModalProvider.tsx";
import { Modal } from "./components/common/modal/Modal.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiContext } from "./context/api.context.ts";
import { ApiClient } from "./api/api.ts";

const queryClient = new QueryClient(); // TODO: move to app after removing all the junk

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApiContext.Provider value={new ApiClient()}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <ModalProvider>
              <Modal />
              <Router />
            </ModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ApiContext.Provider>
  </StrictMode>
);
