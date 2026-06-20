// Rate limiter без внешних зависимостей (in-memory)
// Для продакшена замените на express-rate-limit + Redis

const store = new Map(); // ip -> { count, resetAt }

const createLimiter = ({ windowMs, max, message }) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({ error: message, retryAfter });
    }

    entry.count++;
    next();
  };
};

// Строгий лимит для авторизации: 10 попыток / 15 минут
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Слишком много попыток. Попробуйте через 15 минут.',
});

// Общий лимит для API: 100 запросов / минуту
const apiLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Слишком много запросов. Попробуйте позже.',
});

// Очистка устаревших записей каждые 10 минут
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(ip);
  }
}, 10 * 60 * 1000);

module.exports = { authLimiter, apiLimiter };
