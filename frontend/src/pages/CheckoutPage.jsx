import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:    user?.name || '',
    email:   user?.email || '',
    phone:   '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [payMode, setPayMode] = useState('cod');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email) { show('Заполните имя и email', 'error'); return; }
    if (!form.address) { show('Укажите адрес доставки', 'error'); return; }
    setLoading(true);
    try {
      const orderItems = items.map(i => ({
        productId: i._id,
        name:      i.nameRu || i.name,
        price:     i.price,
        quantity:  i.quantity,
        image:     i.image,
        size:      i.size || null,
      }));

      const { orderId, total: confirmedTotal } = await api.placeOrder({
        items:    orderItems,
        customer: form,
        // userId не передаём — бэкенд читает из JWT-токена автоматически
      });

      if (payMode === 'stripe') {
        try {
          // Новый бэкенд принимает только orderId, сумму берёт из БД
          const { clientSecret } = await api.createPaymentIntent({ orderId });
          clearCart();
          navigate('/success', { state: { orderId, total: confirmedTotal || total, stripe: true, clientSecret } });
          return;
        } catch {
          show('Stripe не настроен. Оформляем как оплата при получении.', 'error');
        }
      }

      clearCart();
      show('Заказ оформлен!');
      navigate('/success', { state: { orderId, total: confirmedTotal || total } });
    } catch (e) {
      show(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return (
    <main className={styles.page}>
      <div className={styles.container} style={{ textAlign: 'center', paddingTop: 100 }}>
        <p style={{ color: 'var(--muted)' }}>Корзина пуста</p>
        <Link to="/shop" className="btn btn-teal" style={{ display: 'inline-block', marginTop: 20 }}>В магазин</Link>
      </div>
    </main>
  );

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Оформление заказа</h1>
        <div className={styles.layout}>
          {/* Form */}
          <div className={styles.form}>
            <h3 className={styles.sectionTitle}>Данные покупателя</h3>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Имя *</label>
                <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Алишер"/>
              </div>
              <div className={styles.field}>
                <label>Email *</label>
                <input className="input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com"/>
              </div>
            </div>
            <div className={styles.field}>
              <label>Телефон</label>
              <input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder="+998 90 000 00 00"/>
            </div>
            <div className={styles.field}>
              <label>Адрес доставки *</label>
              <textarea className="input" name="address" value={form.address} onChange={handleChange} rows={2} placeholder="Ташкент, ул. Навои, д. 1"/>
            </div>

            <h3 className={styles.sectionTitle} style={{ marginTop: 16 }}>Способ оплаты</h3>
            <div className={styles.payMethods}>
              <label className={payMode === 'cod' ? styles.payActive : styles.payOption}>
                <input type="radio" value="cod" checked={payMode === 'cod'} onChange={() => setPayMode('cod')}/>
                <span className={styles.payIcon}>💵</span>
                <div>
                  <p className={styles.payLabel}>При получении</p>
                  <p className={styles.payHint}>Наличные или карта курьеру</p>
                </div>
              </label>
              <label className={payMode === 'stripe' ? styles.payActive : styles.payOption}>
                <input type="radio" value="stripe" checked={payMode === 'stripe'} onChange={() => setPayMode('stripe')}/>
                <span className={styles.payIcon}>💳</span>
                <div>
                  <p className={styles.payLabel}>Картой онлайн (Stripe)</p>
                  <p className={styles.payHint}>Требует настройки STRIPE_SECRET_KEY</p>
                </div>
              </label>
            </div>

            <button
              className={`btn btn-teal ${styles.submitBtn}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading && <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}/>}
              Подтвердить — ${total}
            </button>
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <h3 className={styles.sectionTitle}>Ваш заказ</h3>
            {items.map(i => (
              <div key={i._key} className={styles.orderItem}>
                <img src={i.image} alt={i.nameRu || i.name}/>
                <div className={styles.orderInfo}>
                  <p>{i.nameRu || i.name}</p>
                  {i.size && <p className={styles.orderSize}>{i.size}</p>}
                  <p className={styles.orderMeta}>{i.quantity} × ${i.price}</p>
                </div>
                <span>${i.price * i.quantity}</span>
              </div>
            ))}
            <div className={styles.totalLine}>
              <span>Итого</span><span>${total}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
