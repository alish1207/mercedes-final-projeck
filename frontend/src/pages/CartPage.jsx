import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCart();

  if (items.length === 0) return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛒</span>
          <h2>Корзина пуста</h2>
          <p>Добавьте товары из каталога</p>
          <Link to="/shop" className="btn btn-teal" style={{ marginTop: 24 }}>В каталог</Link>
        </div>
      </div>
    </main>
  );

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Корзина</h1>
        <div className={styles.layout}>
          <div className={styles.items}>
            {items.map(item => (
              <div key={item._key} className={styles.item}>
                <img src={item.image} alt={item.nameRu || item.name}/>
                <div className={styles.info}>
                  <p className={styles.itemName}>{item.nameRu || item.name}</p>
                  {item.size && <p className={styles.itemSize}>Размер: {item.size}</p>}
                  <p className={styles.itemPrice}>${item.price}</p>
                </div>
                <div className={styles.qty}>
                  <button onClick={() => updateQty(item._key, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item._key, item.quantity + 1)}>+</button>
                </div>
                <p className={styles.lineTotal}>${item.price * item.quantity}</p>
                <button className={styles.remove} onClick={() => removeItem(item._key)}>✕</button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h3>Итого</h3>
            <div className={styles.row}>
              <span>Товаров</span>
              <span>{items.reduce((s,i) => s + i.quantity, 0)} шт.</span>
            </div>
            <div className={`${styles.row} ${styles.totalRow}`}>
              <span>Сумма</span>
              <span>${total}</span>
            </div>
            <Link to="/checkout" className="btn btn-teal" style={{ display: 'block', textAlign: 'center', marginTop: 24, width: '100%' }}>
              Оформить заказ
            </Link>
            <Link to="/shop" style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 13, color: "var(--muted)" }}>
              ← Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
