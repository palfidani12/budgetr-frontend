import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiClient } from './api/api.ts';
import { Modal } from './components/common/modal/Modal.tsx';
import { ApiContext } from './context/api.context.ts';
import { AuthProvider } from './providers/AuthProvider.tsx';
import { ModalProvider } from './providers/ModalProvider.tsx';
import { ThemeProvider } from './providers/ThemeProvider.tsx';
import { Router } from './Router.tsx';
import './index.css';

const queryClient = new QueryClient(); // TODO: move to app after removing all the junk

createRoot(document.getElementById('root')!).render(
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
  </StrictMode>,
);
