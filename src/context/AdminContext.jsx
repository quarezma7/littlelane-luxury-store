import { createContext, useContext, useReducer, useEffect } from 'react';
import { USERS, PROMO_CODES, REVENUE_DATA } from '../data/seed';

const AdminContext = createContext(null);

function adminReducer(state, action) {
  switch (action.type) {
    // ── Users ──
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return { ...state, users: state.users.map(u => u.id === action.payload.id ? action.payload : u) };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(u => u.id !== action.payload) };

    // ── Promos ──
    case 'SET_PROMOS':
      return { ...state, promos: action.payload };
    case 'ADD_PROMO':
      return { ...state, promos: [...state.promos, action.payload] };
    case 'UPDATE_PROMO':
      return { ...state, promos: state.promos.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PROMO':
      return { ...state, promos: state.promos.filter(p => p.id !== action.payload) };

    // ── Reset ──
    case 'RESET_ALL':
      return defaultInitialState;

    default:
      return state;
  }
}

const defaultInitialState = {
  users: USERS,
  promos: PROMO_CODES,
  revenueData: REVENUE_DATA,
};

const getInitialState = () => {
  const saved = localStorage.getItem('littlelane_admin_data');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse admin data', e);
    }
  }
  return defaultInitialState;
};

export function AdminProvider({ children }) {
  const [state, rawDispatch] = useReducer(adminReducer, null, getInitialState);

  // Fetch initial global data from MongoDB
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const [usersRes, promosRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/promos')
        ]);
        if (usersRes.ok) {
          const users = await usersRes.json();
          if (users.length > 0) rawDispatch({ type: 'SET_USERS', payload: users });
        }
        if (promosRes.ok) {
          const promos = await promosRes.json();
          if (promos.length > 0) rawDispatch({ type: 'SET_PROMOS', payload: promos });
        }
      } catch (e) {
        console.error('Failed to fetch from MongoDB', e);
      }
    };
    fetchGlobalData();
  }, []);

  useEffect(() => {
    localStorage.setItem('littlelane_admin_data', JSON.stringify(state));
  }, [state]);

  const dispatch = async (action) => {
    rawDispatch(action);

    try {
      if (action.type === 'ADD_USER') {
        await fetch('/api/users', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.payload) });
      } else if (action.type === 'UPDATE_USER') {
        await fetch('/api/users', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.payload) });
      } else if (action.type === 'DELETE_USER') {
        await fetch(`/api/users?id=${action.payload}`, { method: 'DELETE' });
      } else if (action.type === 'ADD_PROMO') {
        await fetch('/api/promos', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.payload) });
      } else if (action.type === 'UPDATE_PROMO') {
        await fetch('/api/promos', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.payload) });
      } else if (action.type === 'DELETE_PROMO') {
        await fetch(`/api/promos?id=${action.payload}`, { method: 'DELETE' });
      }
    } catch (e) {
      console.error('DB Sync failed', e);
    }
  };

  return (
    <AdminContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
