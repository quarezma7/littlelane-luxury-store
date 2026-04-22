import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { StoreProvider } from './context/StoreContext';
import { AdminProvider } from './context/AdminContext';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <AdminProvider>
          <StoreProvider>
            <App />
          </StoreProvider>
        </AdminProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
