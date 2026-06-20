const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  nameRu:        { type: String, trim: true },
  price:         { type: Number, required: true, min: 0 },
  image:         { type: String, required: true },
  category:      { type: String, enum: ['clothing', 'accessories', 'collectibles'], default: 'clothing' },
  description:   { type: String },
  descriptionRu: { type: String },
  inStock:       { type: Boolean, default: true },
  badge:         { type: String },
  sizes:         [{ type: String }],
}, { timestamps: true });

// Полнотекстовый поиск по имени (EN + RU)
productSchema.index({ name: 'text', nameRu: 'text' });
// Быстрая фильтрация по категории
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ inStock: 1 });

module.exports = mongoose.model('Product', productSchema);
