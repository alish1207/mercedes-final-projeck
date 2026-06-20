const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Обязательная авторизация
const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Не авторизован' });
  }
  try {
    const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ error: 'Пользователь не найден' });
    next();
  } catch {
    res.status(401).json({ error: 'Токен недействителен' });
  }
};

// Опциональная авторизация (не блокирует запрос если нет токена)
const optionalAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return next();
  try {
    const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch {
    // токен невалиден — просто игнорируем
  }
  next();
};

// Проверка роли администратора
const adminMiddleware = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Не авторизован' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Доступ запрещён' });
  next();
};

module.exports = { authMiddleware, optionalAuth, adminMiddleware };
