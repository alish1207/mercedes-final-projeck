import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useState } from 'react';
import styles from './ProductCard.module.css';

export function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={`${styles.imgWrap} skeleton`} />
      <div className={styles.body}>
        <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 18, width: '80%', marginBottom: 16 }} />
        <div className={styles.footer}>
          <div className="skeleton" style={{ height: 24, width: 60 }} />
          <div className="skeleton" style={{ height: 36, width: 100, borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addItem, items } = useCart();
  const { toggle, isWished } = useWishlist();
  const { show } = useToast();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);

  const inCart = items.some(i => i._id === product._id && i.size === selectedSize);
  const wished = isWished(product._id);

  const handleAdd = () => {
    addItem(product, selectedSize);
    show(`${product.nameRu || product.name} добавлен в корзину`);
  };

  const handleWish = (e) => {
    e.stopPropagation();
    toggle(product);
    show(wished
      ? `${product.nameRu || product.name} убран из избранного`
      : `${product.nameRu || product.name} добавлен в избранное`
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        <img src={product.image} alt={product.nameRu || product.name} loading="lazy" />
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        {!product.inStock && <div className={styles.outOfStock}>Нет в наличии</div>}
        {/* Кнопка вишлиста */}
        <button
          className={`${styles.wishBtn} ${wished ? styles.wishActive : ''}`}
          onClick={handleWish}
          title={wished ? 'Убрать из избранного' : 'В избранное'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div className={styles.body}>
        <p className={styles.category}>{catLabel(product.category)}</p>
        <h3 className={styles.name}>{product.nameRu || product.name}</h3>

        {product.sizes?.length > 0 && (
          <div className={styles.sizes}>
            {product.sizes.map(s => (
              <button
                key={s}
                className={selectedSize === s ? styles.sizeActive : styles.size}
                onClick={() => setSelectedSize(s)}
              >{s}</button>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.price}>${product.price}</span>
          <button
            className={inCart ? styles.btnAdded : styles.btnAdd}
            onClick={handleAdd}
            disabled={!product.inStock}
          >
            {!product.inStock ? 'Нет' : inCart ? '✓ В корзине' : 'В корзину'}
          </button>
        </div>
      </div>
    </div>
  );
}

const catLabel = (c) => ({ clothing: 'Одежда', accessories: 'Аксессуары', collectibles: 'Коллекционное' }[c] || c);
