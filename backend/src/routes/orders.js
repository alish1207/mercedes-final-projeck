const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authMiddleware, optionalAuth, adminMiddleware } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validate');

// POST /api/orders — создать заказ (авторизация опциональна — гости тоже могут)
router.post('/', optionalAuth, validateOrder, async (req, res) => {
  try {
    const { items, customer } = req.body;

    // Проверяем цены товаров в БД — нельзя доверять ценам из запроса
    const productIds = items.map(i => i.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    const verifiedItems = [];
    for (const item of items) {
      const dbProduct = dbProducts.find(p => p._id.toString() === item.productId);
      if (!dbProduct) return res.status(400).json({ error: `Товар не найден: ${item.productId}` });
      if (!dbProduct.inStock) return res.status(400).json({ error: `Товар недоступен: ${dbProduct.nameRu || dbProduct.name}` });
      verifiedItems.push({
        productId: dbProduct._id,
        name:      dbProduct.nameRu || dbProduct.name,
        price:     dbProduct.price, // цена из БД, а не из запроса!
        quantity:  Math.max(1, parseInt(item.quantity) || 1),
        image:     dbProduct.image,
        size:      item.size || null,
      });
    }

    const total = verifiedItems.reduce((s, i) => s + i.price * i.quantity, 0);

    const order = await Order.create({
      items:    verifiedItems,
      total,
      customer,
      user:     req.user?._id || null,
    });

    res.status(201).json({ success: true, orderId: order._id, total });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET /api/orders/my — мои заказы (только авторизованные)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip     = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments({ user: req.user._id }),
    ]);

    res.json({ orders, pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/orders — все заказы (только для админа)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    const skip     = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/orders/:id — конкретный заказ
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Заказ не найден' });

    // Разрешаем доступ только владельцу заказа или админу
    const isOwner = req.user && order.user?.toString() === req.user._id.toString();
    const isAdmin = req.user?.role === 'admin';
    if (!isOwner && !isAdmin)
      return res.status(403).json({ error: 'Нет доступа к этому заказу' });

    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/orders/:id/status — смена статуса (только для админа)
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, cancelReason } = req.body;
    const allowed = ['pending', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status))
      return res.status(400).json({ error: 'Недопустимый статус' });

    const update = { status };
    if (status === 'cancelled') {
      update.cancelledAt = new Date();
      if (cancelReason) update.cancelReason = cancelReason;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ error: 'Заказ не найден' });
    res.json(order);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
