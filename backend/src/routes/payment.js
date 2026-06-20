const router = require('express').Router();
const Order = require('../models/Order');
const { optionalAuth } = require('../middleware/auth');

let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  } else {
    console.warn('⚠  Stripe не настроен — добавьте STRIPE_SECRET_KEY в .env');
  }
} catch {
  console.warn('⚠  Не удалось загрузить Stripe');
}

// POST /api/payment/create-intent
router.post('/create-intent', optionalAuth, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe не настроен. Добавьте STRIPE_SECRET_KEY в .env' });

  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'Укажите orderId' });

    // Берём сумму из БД — не доверяем клиенту
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Заказ не найден' });
    if (order.status === 'paid') return res.status(400).json({ error: 'Заказ уже оплачен' });

    // Проверяем, что платёжное намерение создаёт владелец заказа или гость с нужным email
    if (req.user && order.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Нет доступа к этому заказу' });
    }

    const intent = await stripe.paymentIntents.create({
      amount:   Math.round(order.total * 100), // в центах
      currency: 'usd',
      metadata: { orderId: order._id.toString() },
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// POST /api/payment/webhook (вызывает Stripe)
router.post('/webhook', require('express').raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.sendStatus(200);

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (e) {
    console.error('Webhook signature error:', e.message);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const orderId = intent.metadata?.orderId;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        status: 'paid',
        stripePaymentIntentId: intent.id,
        paidAt: new Date(),
      });
      console.log(`✅ Заказ оплачен: ${orderId}`);
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object;
    const orderId = intent.metadata?.orderId;
    if (orderId) {
      console.warn(`❌ Оплата не прошла для заказа: ${orderId}`);
    }
  }

  res.json({ received: true });
});

module.exports = router;
