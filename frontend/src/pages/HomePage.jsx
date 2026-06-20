import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts({ limit: 4, sort: '' })
      .then(data => {
        const list = Array.isArray(data) ? data : data.products || [];
        setFeatured(list.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Mercedes-AMG Petronas F1 · Season 2025</p>
          <h1 className={styles.heroTitle}>
            Silver Arrow<br/><span className={styles.teal}>Official Store</span>
          </h1>
          <p className={styles.heroSub}>
            Официальная экипировка команды. Одевайся как чемпион.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/shop" className="btn btn-teal">Смотреть каталог</Link>
            <Link to="/pilots" className="btn btn-ghost">Наши пилоты</Link>
          </div>
        </div>
        <div className={styles.heroVisual} aria-hidden>
          <div className={styles.heroNumber}>63</div>
          <div className={styles.heroNumber2}>12</div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className={styles.container}>
          {[
            { value: '16', label: 'Конструкторских титулов' },
            { value: 'W16', label: 'Болид сезона 2025' },
            { value: '2', label: 'Пилота мирового класса' },
            { value: '100%', label: 'Официальная продукция' },
          ].map(s => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statVal}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Новинки</h2>
            <Link to="/shop" className={styles.seeAll}>Весь каталог →</Link>
          </div>
          <div className={styles.grid}>
            {loading
              ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i}/>)
              : featured.map(p => <ProductCard key={p._id} product={p}/>)
            }
          </div>
        </div>
      </section>

      {/* Pilots banner */}
      <section className={styles.pilotsBanner}>
        <div className={styles.container}>
          <div className={styles.bannerInner}>
            <div>
              <p className={styles.bannerEye}>Season 2025</p>
              <h2 className={styles.bannerTitle}>Познакомься с пилотами</h2>
              <p className={styles.bannerSub}>Джордж Расселл и Андреа Ким Антонелли — будущее Mercedes F1.</p>
              <Link to="/pilots" className="btn btn-teal" style={{ marginTop: 24, display: 'inline-flex' }}>
                Пилоты команды
              </Link>
            </div>
            <div className={styles.bannerNumbers} aria-hidden>
              <span className={styles.bannerNum}>#63</span>
              <span className={styles.bannerNum}>#12</span>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
