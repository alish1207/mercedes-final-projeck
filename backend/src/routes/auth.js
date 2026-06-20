const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
});

// POST /api/auth/register
router.post('/register', authLimiter, validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ error: 'Email уже используется' });
    const user = await User.create({ name: name.trim(), email, password });
    res.status(201).json({ token: sign(user._id), user: user.toPublic() });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    // Единое сообщение об ошибке — не раскрываем, есть ли пользователь
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    res.json({ token: sign(user._id), user: user.toPublic() });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user.toPublic ? req.user.toPublic() : req.user });
});

// PUT /api/auth/me — обновление профиля
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const update = {};
    if (name && name.trim().length >= 2) update.name = name.trim();
    if (avatar !== undefined) update.avatar = avatar;
    if (!Object.keys(update).length)
      return res.status(400).json({ error: 'Нет данных для обновления' });
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json({ user: user.toPublic() });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT /api/auth/me/password — смена пароля
router.put('/me/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: 'Укажите текущий и новый пароль' });
    if (newPassword.length < 6)
      return res.status(400).json({ error: 'Новый пароль должен быть минимум 6 символов' });

    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ error: 'Неверный текущий пароль' });

    user.password = newPassword;
    await user.save(); // сработает pre-save хук и захеширует
    res.json({ message: 'Пароль успешно изменён' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
