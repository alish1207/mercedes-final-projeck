require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();

// Подключение к БД
connectDB();

// Stripe webhook нужен raw body — монтируется ДО express.json()
app.use('/api/payment/webhook', require('./routes/payment'));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10kb' })); // ограничиваем размер body

// Роуты
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/payment',  require('./routes/payment'));
app.use('/api/pilots',   require('./routes/pilots'));

// Хелсчек
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Обработка несуществующих маршрутов
app.use('*', (req, res) => res.status(404).json({ error: `Маршрут ${req.originalUrl} не найден` }));

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен: http://localhost:${PORT}`));
