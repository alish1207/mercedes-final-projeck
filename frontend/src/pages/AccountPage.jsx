import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import styles from './AccountPage.module.css';

const STATUS_LABELS = {
  pending: 'Ожидает', paid: 'Оплачен', confirmed: 'Подтверждён',
  shipped: 'Отправлен', delivered: 'Доставлен', cancelled: 'Отменён',
};
const STATUS_COLORS = {
  pending: '#f59e0b', paid: '#22c55e', confirmed: '#00d2be',
  shipped: '#3b82f6', delivered: '#22c55e', cancelled: '#ef4444',
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.myOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [user]);

  const handleLogout = () => { logout(); navigate('/'); };

  if (!user) return null;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Profile header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarLarge}>{user.name[0].toUpperCase()}</div>
          <div>
            <h1 className={styles.name}>{user.name}</h1>
            <p className={styles.email}>{user.email}</p>
            <p className={styles.since}>Участник с {new Date(user.createdAt).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })}</p>
          </div>
          <button className={`btn btn-ghost ${styles.logoutBtn}`} onClick={handleLogout}>Выйти</button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={tab === 'orders' ? styles.tabActive : styles.tab} onClick={() => setTab('orders')}>
            История заказов {orders.length > 0 && <span className={styles.count}>{orders.length}</span>}
          </button>
        </div>

        {/* Orders */}
        {tab === 'orders' && (
          <div className={styles.orders}>
            {loadingOrders && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                <div className="spinner"/>
              </div>
            )}
            {!loadingOrders && orders.length === 0 && (
              <div className={styles.emptyOrders}>
                <p>У вас пока нет заказов.</p>
                <button className="btn btn-teal" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
                  Перейти в каталог
                </button>
              </div>
            )}
            {orders.map(order => (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <p className={styles.orderId}>Заказ #{order._id.slice(-8).toUpperCase()}</p>
                    <p className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <span className={styles.status} style={{ color: STATUS_COLORS[order.status], borderColor: STATUS_COLORS[order.status] }}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <div className={styles.orderItems}>
                  {order.items.map((item, i) => (
                    <div key={i} className={styles.orderItem}>
                      {item.image && <img src={item.image} alt={item.name}/>}
                      <div>
                        <p className={styles.orderItemName}>{item.name}</p>
                        <p className={styles.orderItemMeta}>{item.quantity} × ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.orderTotal}>
                  Итого: <strong>${order.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
