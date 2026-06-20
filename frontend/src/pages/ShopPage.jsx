import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import styles from './ShopPage.module.css';

const CATS = [
  { value: '', label: 'Все' },
  { value: 'clothing', label: 'Одежда' },
  { value: 'accessories', label: 'Аксессуары' },
  { value: 'collectibles', label: 'Коллекционное' },
];

const SORTS = [
  { value: '', label: 'Новинки' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc', label: 'Цена ↓' },
];

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  // Фильтры по цене и размеру (применяются на клиенте)
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true); setError(null);
    const params = {};
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (query) params.search = query;
    api.getProducts(params)
      .then(data => {
        // Поддержка старого API (массив) и нового (с пагинацией)
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [category, sort, query]);

  const handleSearch = (e) => { e.preventDefault(); setQuery(search); };

  const toggleSize = (s) => setSelectedSizes(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );

  // Клиентская фильтрация по цене и размеру
  const filtered = products.filter(p => {
    if (p.price < priceMin || p.price > priceMax) return false;
    if (selectedSizes.length > 0) {
      if (!p.sizes?.length) return false;
      if (!selectedSizes.some(s => p.sizes.includes(s))) return false;
    }
    return true;
  });

  const hasActiveFilters = selectedSizes.length > 0 || priceMin > 0 || priceMax < 1000;

  const resetFilters = () => {
    setPriceMin(0); setPriceMax(1000); setSelectedSizes([]);
  };

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eye}>SEASON 2025 · W16</p>
          <h1 className={styles.heroTitle}>
            Mercedes<span className={styles.teal}>-AMG</span><br/>Official Merch
          </h1>
          <p className={styles.heroSub}>Официальная экипировка команды. Будь частью Silver Arrow.</p>
        </div>
        <div className={styles.heroLine} aria-hidden/>
      </section>

      {/* Catalog */}
      <section className={styles.catalog}>
        <div className={styles.container}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                className={`input ${styles.searchInput}`}
                placeholder="Поиск товаров…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className={styles.searchBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </form>

            <select className={`input ${styles.sortSelect}`} value={sort} onChange={e => setSort(e.target.value)}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>

            <button
              className={`${styles.filterToggle} ${hasActiveFilters ? styles.filterToggleActive : ''}`}
              onClick={() => setShowFilters(v => !v)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Фильтры {hasActiveFilters && <span className={styles.filterDot}/>}
            </button>
          </div>

          {/* Панель фильтров */}
          {showFilters && (
            <div className={styles.filtersPanel}>
              <div className={styles.filterGroup}>
                <p className={styles.filterLabel}>Цена: ${priceMin} — ${priceMax}</p>
                <div className={styles.rangeRow}>
                  <span className={styles.rangeHint}>$0</span>
                  <input type="range" min="0" max="1000" step="10" value={priceMin}
                    onChange={e => setPriceMin(Math.min(Number(e.target.value), priceMax - 10))}
                    className={styles.range}
                  />
                  <input type="range" min="0" max="1000" step="10" value={priceMax}
                    onChange={e => setPriceMax(Math.max(Number(e.target.value), priceMin + 10))}
                    className={styles.range}
                  />
                  <span className={styles.rangeHint}>$1000</span>
                </div>
              </div>

              <div className={styles.filterGroup}>
                <p className={styles.filterLabel}>Размер</p>
                <div className={styles.sizePicker}>
                  {ALL_SIZES.map(s => (
                    <button
                      key={s}
                      className={selectedSizes.includes(s) ? styles.sizeActive : styles.size}
                      onClick={() => toggleSize(s)}
                    >{s}</button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button className={styles.resetBtn} onClick={resetFilters}>Сбросить фильтры</button>
              )}
            </div>
          )}

          {/* Категории */}
          <div className={styles.filters}>
            {CATS.map(c => (
              <button
                key={c.value}
                className={category === c.value ? styles.filterActive : styles.filter}
                onClick={() => setCategory(c.value)}
              >{c.label}</button>
            ))}
          </div>

          {/* Результат */}
          {error && (
            <div className={styles.state}>
              <p style={{ color: 'var(--error)' }}>⚠ {error}</p>
              <p style={{ fontSize: 13, marginTop: 8, color: 'var(--muted)' }}>
                Запустите backend: <code>cd backend && npm run dev</code>
              </p>
            </div>
          )}

          {loading && (
            <div className={styles.grid}>
              {Array(6).fill(0).map((_, i) => <ProductCardSkeleton key={i}/>)}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className={styles.state}>
              <p>{products.length > 0 ? 'Нет товаров с такими фильтрами.' : 'Товары не найдены.'}</p>
              {hasActiveFilters && (
                <button className={styles.resetBtn} style={{ margin: '16px auto 0' }} onClick={resetFilters}>
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <p className={styles.count}>{filtered.length} товаров</p>
              <div className={styles.grid}>
                {filtered.map(p => <ProductCard key={p._id} product={p}/>)}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
