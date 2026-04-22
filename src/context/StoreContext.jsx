import { createContext, useContext, useReducer, useEffect } from 'react';
import { PRODUCTS, ORDERS } from '../data/seed';

const StoreContext = createContext(null);

function storeReducer(state, action) {
  switch (action.type) {
    // ── Products ──
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };

    // ── Cart ──
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.productId === action.payload.productId && i.size === action.payload.size);
      if (existing) {
        return { ...state, cart: state.cart.map(i =>
          i.productId === action.payload.productId && i.size === action.payload.size
            ? { ...i, qty: i.qty + (action.payload.qty || 1) }
            : i
        )};
      }
      return { ...state, cart: [...state.cart, { ...action.payload, qty: action.payload.qty || 1 }] };
    }
    case 'UPDATE_CART_QTY':
      return { ...state, cart: state.cart.map(i =>
        i.productId === action.payload.productId && i.size === action.payload.size
          ? { ...i, qty: action.payload.qty }
          : i
      ).filter(i => i.qty > 0) };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => !(i.productId === action.payload.productId && i.size === action.payload.size)) };
    case 'CLEAR_CART':
      return { ...state, cart: [], promoCode: null, discount: 0 };
    case 'APPLY_PROMO':
      return { ...state, promoCode: action.payload.code, discount: action.payload.discount };
    case 'REMOVE_PROMO':
      return { ...state, promoCode: null, discount: 0 };

    // ── Wishlist ──
    case 'ADD_TO_WISHLIST':
      if (state.wishlist.find(i => i.productId === action.payload.productId)) return state;
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(i => i.productId !== action.payload) };
    case 'CLEAR_WISHLIST':
      return { ...state, wishlist: [] };

    // ── Orders ──
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER':
      return { ...state, orders: state.orders.map(o => o.id === action.payload.id ? action.payload : o) };

    // ── Drawer ──
    case 'TOGGLE_CART_DRAWER':
      return { ...state, cartOpen: !state.cartOpen };
    case 'CLOSE_CART_DRAWER':
      return { ...state, cartOpen: false };

    default:
      return state;
  }
}

const defaultInitialState = {
  products: PRODUCTS,
  cart: [],
  wishlist: [],
  orders: ORDERS,
  cartOpen: false,
  promoCode: null,
  discount: 0,
};

const getInitialState = () => {
  const saved = localStorage.getItem('littlelane_store_data');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Ensure UI state like cartOpen defaults to false on load
      return { ...parsed, cartOpen: false };
    } catch (e) {
      console.error('Failed to parse store data', e);
    }
  }
  return defaultInitialState;
};

export function StoreProvider({ children }) {
  const [state, rawDispatch] = useReducer(storeReducer, null, getInitialState);

  // Fetch initial global data from MongoDB
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const [prodRes, ordRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders')
        ]);
        if (prodRes.ok) {
          const products = await prodRes.json();
          if (products.length > 0) rawDispatch({ type: 'SET_PRODUCTS', payload: products });
        }
        if (ordRes.ok) {
          const orders = await ordRes.json();
          // Assuming we add SET_ORDERS to reducer
          if (orders.length > 0) rawDispatch({ type: 'SET_ORDERS', payload: orders });
        }
      } catch (e) {
        console.error('Failed to fetch from MongoDB', e);
      }
    };
    fetchGlobalData();
  }, []);

  // Save session state (cart, wishlist) to localStorage
  useEffect(() => {
    localStorage.setItem('littlelane_store_data', JSON.stringify(state));
  }, [state]);

  const dispatch = async (action) => {
    rawDispatch(action); // Optimistic UI update

    try {
      if (action.type === 'ADD_PRODUCT') {
        await fetch('/api/products', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.payload) });
      } else if (action.type === 'UPDATE_PRODUCT') {
        await fetch('/api/products', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.payload) });
      } else if (action.type === 'DELETE_PRODUCT') {
        await fetch(`/api/products?id=${action.payload}`, { method: 'DELETE' });
      } else if (action.type === 'ADD_ORDER') {
        await fetch('/api/orders', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.payload) });
      } else if (action.type === 'UPDATE_ORDER') {
        await fetch('/api/orders', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.payload) });
      }
    } catch (e) {
      console.error('DB Sync failed', e);
    }
  };

  const cartTotal = state.cart.reduce((sum, item) => {
    const product = state.products.find(p => p.id === item.productId);
    if (!product) return sum;
    const effectivePrice = product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;
    return sum + effectivePrice * item.qty;
  }, 0);

  const cartCount = state.cart.reduce((sum, i) => sum + i.qty, 0);
  const wishlistCount = state.wishlist.length;
  const discountedTotal = cartTotal * (1 - state.discount / 100);

  return (
    <StoreContext.Provider value={{ state, dispatch, cartTotal, cartCount, wishlistCount, discountedTotal }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
