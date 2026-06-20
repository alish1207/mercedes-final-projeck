const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null = гость
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:      String,
    price:     { type: Number, min: 0 },
    quantity:  { type: Number, default: 1, min: 1 },
    image:     String,
    size:      String,
  }],
  total: { type: Number, required: true, min: 0 },
  customer: {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    phone:   String,
    address: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  stripePaymentIntentId: { type: String },
  paidAt:    { type: Date },
  cancelledAt: { type: Date },
  cancelReason: { type: String },
}, { timestamps: true });

// Индексы для быстрого поиска
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'customer.email': 1 });

module.exports = mongoose.model('Order', orderSchema);
