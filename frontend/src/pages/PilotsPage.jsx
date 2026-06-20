import { useState, useEffect } from 'react';
import { api } from '../api';
import styles from './PilotsPage.module.css';

export default function PilotsPage() {
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPilots().then(setPilots).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <div className="spinner"/>
        </div>
      </div>
    </main>
  );

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eye}>СЕЗОН 2025</p>
          <h1 className={styles.title}>Пилоты команды</h1>
          <p className={styles.sub}>Mercedes-AMG Petronas F1 Team</p>
        </div>

        {/* Pilots */}
        <div className={styles.pilotsGrid}>
          {pilots.map(pilot => (
            <PilotCard key={pilot.id} pilot={pilot}/>
          ))}
        </div>
      </div>
    </main>
  );
}

function PilotCard({ pilot }) {
  const [tab, setTab] = useState('bio');
  const age = new Date().getFullYear() - new Date(pilot.born).getFullYear();

  return (
    <div className={styles.card}>
      {/* Left — photo */}
      <div className={styles.photoSide}>
        <img src={pilot.image} alt={pilot.name} className={styles.photo}/>
        <div className={styles.numOverlay}>
          <span className={styles.numSign}>#</span>
          <span className={styles.num}>{pilot.number}</span>
        </div>
        <div className={styles.flagBadge}>{pilot.flag} {pilot.nationality}</div>
      </div>

      {/* Right — info */}
      <div className={styles.infoSide}>
        <div className={styles.pilotMeta}>
          <span className={styles.car}>{pilot.car}</span>
        </div>
        <h2 className={styles.pilotName}>{pilot.nameRu}</h2>
        <p className={styles.pilotEn}>{pilot.name}</p>

        {/* Tabs */}
        <div className={styles.tabs}>
          {['bio','stats'].map(t => (
            <button key={t} className={tab === t ? styles.tabActive : styles.tab} onClick={() => setTab(t)}>
              {t === 'bio' ? 'Биография' : 'Статистика'}
            </button>
          ))}
        </div>

        {tab === 'bio' && (
          <div className={styles.bio}>
            <p>{pilot.bio}</p>
            <div className={styles.bioMeta}>
              <span>Возраст: <strong>{age} лет</strong></span>
              <span>Город: <strong>{pilot.hometown}</strong></span>
            </div>
          </div>
        )}

        {tab === 'stats' && (
          <div className={styles.stats}>
            {[
              ['Гонок', pilot.stats.races],
              ['Побед', pilot.stats.wins],
              ['Подиумов', pilot.stats.podiums],
              ['Поулов', pilot.stats.poles],
              ['Чемпионств', pilot.stats.championships],
            ].map(([label, val]) => (
              <div key={label} className={styles.stat}>
                <span className={styles.statVal}>{val}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.socials}>
          <a href={`https://instagram.com/${pilot.instagram}`} target="_blank" rel="noreferrer" className={styles.social}>
            Instagram
          </a>
          <a href={`https://twitter.com/${pilot.twitter}`} target="_blank" rel="noreferrer" className={styles.social}>
            Twitter / X
          </a>
        </div>
      </div>
    </div>
  );
}
