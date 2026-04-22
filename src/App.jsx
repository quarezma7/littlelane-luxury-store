import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/ui/Toast';
import AuthModal from './features/auth/AuthModal';
import CartDrawer from './features/cart/CartDrawer';
import StorePage from './pages/store/StorePage';
import WishlistPage from './pages/store/WishlistPage';
import CheckoutPage from './pages/store/CheckoutPage';
import AdminLayout from './pages/admin/AdminLayout';
import OverviewPage from './pages/admin/OverviewPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import UsersPage from './pages/admin/UsersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import PromotionsPage from './pages/admin/PromotionsPage';
import SettingsPage from './pages/admin/SettingsPage';
import './styles/globals.css';

function StoreLayout({ children }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      <main style={{ flex:1 }}>{children}</main>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </div>
  );
}

export default function App() {
  const { toasts, removeToast } = useApp();
  return (
    <>
      <Routes>
        {/* Store Routes */}
        <Route path="/" element={<StoreLayout><StorePage /></StoreLayout>} />
        <Route path="/wishlist" element={<StoreLayout><WishlistPage /></StoreLayout>} />
        <Route path="/checkout" element={<StoreLayout><CheckoutPage /></StoreLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview"   element={<OverviewPage />} />
          <Route path="products"   element={<ProductsPage />} />
          <Route path="orders"     element={<OrdersPage />} />
          <Route path="users"      element={<UsersPage />} />
          <Route path="analytics"  element={<AnalyticsPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="settings"   element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
