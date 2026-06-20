// Простая валидация входящих данных

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2)
    errors.push('Имя должно содержать минимум 2 символа');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push('Некорректный email');
  if (!password || password.length < 6)
    errors.push('Пароль должен быть минимум 6 символов');

  if (errors.length) return res.status(400).json({ error: errors.join('. ') });
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Введите email и пароль' });
  next();
};

const validateProduct = (req, res, next) => {
  const { name, price, image, category } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2)
    errors.push('Название обязательно');
  if (price === undefined || isNaN(price) || Number(price) < 0)
    errors.push('Цена должна быть положительным числом');
  if (!image || !image.startsWith('http'))
    errors.push('Некорректная ссылка на изображение');
  if (category && !['clothing', 'accessories', 'collectibles'].includes(category))
    errors.push('Некорректная категория');

  if (errors.length) return res.status(400).json({ error: errors.join('. ') });
  next();
};

const validateOrder = (req, res, next) => {
  const { items, customer } = req.body;
  const errors = [];

  if (!Array.isArray(items) || items.length === 0)
    errors.push('Корзина пуста');

  if (items) {
    for (const item of items) {
      if (!item.productId) errors.push('Не указан ID товара');
      if (!item.price || isNaN(item.price) || Number(item.price) < 0)
        errors.push(`Некорректная цена товара: ${item.name || item.productId}`);
      if (item.quantity && (isNaN(item.quantity) || item.quantity < 1))
        errors.push('Количество должно быть >= 1');
    }
  }

  if (!customer?.name?.trim())       errors.push('Укажите имя получателя');
  if (!customer?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    errors.push('Некорректный email получателя');
  if (!customer?.address?.trim())    errors.push('Укажите адрес доставки');

  if (errors.length) return res.status(400).json({ error: errors.join('. ') });
  next();
};

module.exports = { validateRegister, validateLogin, validateProduct, validateOrder };
