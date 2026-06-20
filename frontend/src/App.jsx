import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }     from './context/AuthContext';
import { CartProvider }     from './context/CartContext';
import { ToastProvider }    from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import Header       from './components/Header';
import HomePage     from './pages/HomePage';
import ShopPage     from './pages/ShopPage';
import PilotsPage   from './pages/PilotsPage';
import CartPage     from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage  from './pages/SuccessPage';
import AuthPage     from './pages/AuthPage';
import AccountPage  from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <Header />
              <Routes>
                <Route path="/"          element={<HomePage />} />
                <Route path="/shop"      element={<ShopPage />} />
                <Route path="/pilots"    element={<PilotsPage />} />
                <Route path="/cart"      element={<CartPage />} />
                <Route path="/checkout"  element={<CheckoutPage />} />
                <Route path="/success"   element={<SuccessPage />} />
                <Route path="/login"     element={<AuthPage />} />
                <Route path="/account"   element={<AccountPage />} />
                <Route path="/wishlist"  element={<WishlistPage />} />
              </Routes>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
