import { createContext, useContext, useReducer } from 'react';
import { USERS, PROMO_CODES, REVENUE_DATA } from '../data/seed';

const AdminContext = createContext(null);

function adminReducer(state, action) {
  switch (action.type) {
    // ── Users ──
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return { ...state, users: state.users.map(u => u.id === action.payload.id ? action.payload : u) };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(u => u.id !== action.payload) };

    // ── Promos ──
    case 'ADD_PROMO':
      return { ...state, promos: [...state.promos, action.payload] };
    case 'UPDATE_PROMO':
      return { ...state, promos: state.promos.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PROMO':
      return { ...state, promos: state.promos.filter(p => p.id !== action.payload) };

    // ── Reset ──
    case 'RESET_ALL':
      return initialState;

    default:
      return state;
  }
}

const initialState = {
  users: USERS,
  promos: PROMO_CODES,
  revenueData: REVENUE_DATA,
};

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);
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
