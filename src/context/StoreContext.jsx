import { createContext, useContext, useReducer } from 'react';
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

const initialState = {
  products: PRODUCTS,
  cart: [],
  wishlist: [],
  orders: ORDERS,
  cartOpen: false,
  promoCode: null,
  discount: 0,
};

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

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
