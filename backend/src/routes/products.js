const router = require('express').Router();
const Product = require('../models/Product');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validate');

// GET /api/products — список с фильтрацией, поиском и пагинацией
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, inStock, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (inStock === 'true') filter.inStock = true;

    if (search) {
      // Полнотекстовый поиск по EN + RU названию
      filter.$or = [
        { name:   { $regex: search, $options: 'i' } },
        { nameRu: { $regex: search, $options: 'i' } },
      ];
    }

    const sortMap = {
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      newest:     { createdAt: -1 },
      oldest:     { createdAt: 1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortBy).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Товар не найден' });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/products — только для админа
router.post('/', authMiddleware, adminMiddleware, validateProduct, async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.status(201).json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT /api/products/:id — только для админа
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!p) return res.status(404).json({ error: 'Товар не найден' });
    res.json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/products/:id — только для админа
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: 'Товар не найден' });
    res.json({ message: 'Товар удалён' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
