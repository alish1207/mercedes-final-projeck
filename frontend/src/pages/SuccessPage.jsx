import { useLocation, Link } from 'react-router-dom';
import styles from './SuccessPage.module.css';

export default function SuccessPage() {
  const { state } = useLocation();
  const { orderId, total } = state || {};

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.check}>✓</div>
        <h1 className={styles.title}>Заказ оформлен!</h1>
        {orderId && <p className={styles.id}>№ {String(orderId).slice(-8).toUpperCase()}</p>}
        {total  && <p className={styles.total}>Сумма: <strong>${total}</strong></p>}
        <p className={styles.note}>Мы свяжемся с тобой для оформления доставки 📦</p>
        <p className={styles.thanks}>Спасибо, что выбрал Mercedes-AMG ⭐</p>
        <div className={styles.actions}>
          <Link to="/account" className="btn btn-ghost">Мои заказы</Link>
          <Link to="/shop" className="btn btn-teal">В магазин</Link>
        </div>
      </div>
    </main>
  );
}
