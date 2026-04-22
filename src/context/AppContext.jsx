import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { STORE_SETTINGS } from '../data/seed';

const AppContext = createContext(null);

let toastId = 0;

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('littlelane_theme');
    return saved ? saved : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('littlelane_theme', theme);
  }, [theme]);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('littlelane_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [toasts, setToasts] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('littlelane_settings');
    return saved ? JSON.parse(saved) : STORE_SETTINGS;
  });

  // Global Simulated Email / Notification State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('littlelane_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('littlelane_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('littlelane_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((title, message, targetUserId = null, isEmail = true) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const date = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    setNotifications(prev => [{ id, title, message, targetUserId, isEmail, date, read: false }, ...prev]);
  }, []);

  const markNotificationsRead = useCallback((userId = null) => {
    setNotifications(prev => prev.map(n => {
      // If admin marking read, mark all read. If user marking read, mark only theirs read.
      if (!userId || n.targetUserId === userId || n.targetUserId === null) {
        return { ...n, read: true };
      }
      return n;
    }));
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
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
      notifications, addNotification, markNotificationsRead,
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
