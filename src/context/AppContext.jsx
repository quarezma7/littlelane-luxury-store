import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { STORE_SETTINGS } from '../data/seed';

const AppContext = createContext(null);

let toastId = 0;

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('littlelane_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [toasts, setToasts] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settings, setSettings] = useState(STORE_SETTINGS);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('littlelane_user', JSON.stringify(user));
    setAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('littlelane_user');
    addToast('Logged out successfully', 'info');
  };

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
    addToast('Settings saved', 'success');
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      currentUser, login, logout,
      toasts, addToast, removeToast,
      authModalOpen, setAuthModalOpen,
      settings, updateSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
