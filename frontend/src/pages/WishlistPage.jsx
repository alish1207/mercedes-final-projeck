import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import styles from './WishlistPage.module.css';

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToast();

  const handleAdd = (product) => {
    addItem(product, product.sizes?.[0] || null);
    show(`${product.nameRu || product.name} добавлен в корзину`);
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Избранное {items.length > 0 && <span className={styles.count}>{items.length}</span>}</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p>Нет избранных товаров</p>
            <Link to="/" className="btn btn-teal" style={{ marginTop: 20 }}>В каталог</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map(product => (
              <div key={product._id} className={styles.card}>
                <div className={styles.imgWrap}>
                  <img src={product.image} alt={product.nameRu || product.name} loading="lazy" />
                  <button className={styles.removeBtn} onClick={() => toggle(product)} title="Убрать из избранного">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div className={styles.body}>
                  <p className={styles.name}>{product.nameRu || product.name}</p>
                  <p className={styles.price}>${product.price}</p>
                  <button className="btn btn-teal" style={{ width: '100%', marginTop: 8 }} onClick={() => handleAdd(product)}>
                    В корзину
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
