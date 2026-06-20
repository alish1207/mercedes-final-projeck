import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        show('Добро пожаловать!');
      } else {
        await register(form.name, form.email, form.password);
        show('Аккаунт создан!');
      }
      navigate('/');
    } catch (e) {
      show(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoAmg}>AMG</span>
          <span className={styles.logoF1}>F1 STORE</span>
        </Link>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={mode === 'login' ? styles.tabActive : styles.tab} onClick={() => setMode('login')}>Войти</button>
          <button className={mode === 'register' ? styles.tabActive : styles.tab} onClick={() => setMode('register')}>Регистрация</button>
        </div>

        <div className={styles.fields} onKeyDown={handleKey}>
          {mode === 'register' && (
            <div className={styles.field}>
              <label>Имя</label>
              <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Ваше имя"/>
            </div>
          )}
          <div className={styles.field}>
            <label>Email</label>
            <input className="input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com"/>
          </div>
          <div className={styles.field}>
            <label>Пароль</label>
            <input className="input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••"/>
          </div>
        </div>

        <button className={`btn btn-teal ${styles.submitBtn}`} onClick={handleSubmit} disabled={loading}>
          {loading ? <span className="spinner" style={{width:18,height:18,borderWidth:2}}/> : null}
          {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
        </button>

        <p className={styles.hint}>
          {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button className={styles.switchBtn} onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </main>
  );
}
