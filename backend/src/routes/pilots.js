const router = require('express').Router();
const Pilot = require('../models/Pilot');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET /api/pilots
router.get('/', async (req, res) => {
  try {
    const pilots = await Pilot.find({ active: true }).sort({ number: 1 });
    res.json(pilots);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/pilots/:id
router.get('/:id', async (req, res) => {
  try {
    const pilot = await Pilot.findById(req.params.id);
    if (!pilot) return res.status(404).json({ error: 'Пилот не найден' });
    res.json(pilot);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/pilots — только для админа
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pilot = await Pilot.create(req.body);
    res.status(201).json(pilot);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT /api/pilots/:id — только для админа
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pilot = await Pilot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pilot) return res.status(404).json({ error: 'Пилот не найден' });
    res.json(pilot);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
