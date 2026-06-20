import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import styles from './Header.module.css';

export default function Header() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const { count: wishCount } = useWishlist();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const handleLogout = () => { logout(); setUserOpen(false); navigate('/'); };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoAmg}>AMG</span>
          <span className={styles.logoF1}>F1 STORE</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          <Link to="/shop"   className={pathname === '/shop'   ? styles.active : ''}>Каталог</Link>
          <Link to="/pilots" className={pathname === '/pilots' ? styles.active : ''}>Пилоты</Link>

          {/* Wishlist */}
          <Link to="/wishlist" className={styles.iconBtn} title="Избранное">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishCount > 0 && <span className={styles.badge}>{wishCount}</span>}
          </Link>

          {/* Cart */}
          <Link to="/cart" className={styles.iconBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span className={styles.badge}>{count}</span>}
          </Link>

          {/* User */}
          {user ? (
            <div className={styles.userWrap}>
              <button className={styles.userBtn} onClick={() => setUserOpen(v => !v)}>
                <span className={styles.avatar}>{user.name[0].toUpperCase()}</span>
                <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 4l4 4 4-4"/></svg>
              </button>
              {userOpen && (
                <div className={styles.dropdown}>
                  <Link to="/account" onClick={() => setUserOpen(false)}>Личный кабинет</Link>
                  <button onClick={handleLogout}>Выйти</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={`btn btn-ghost ${styles.loginBtn}`}>Войти</Link>
          )}
        </nav>

        {/* Mobile burger */}
        <button className={styles.burger} onClick={() => setMenuOpen(v => !v)}>
          <span className={menuOpen ? styles.burgerOpen : ''}/>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu} onClick={() => setMenuOpen(false)}>
          <Link to="/shop">Каталог</Link>
          <Link to="/pilots">Пилоты</Link>
          <Link to="/wishlist">Избранное {wishCount > 0 && `(${wishCount})`}</Link>
          <Link to="/cart">Корзина {count > 0 && `(${count})`}</Link>
          {user ? (
            <>
              <Link to="/account">Личный кабинет</Link>
              <button onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <Link to="/login">Войти</Link>
          )}
        </div>
      )}
    </header>
  );
}
