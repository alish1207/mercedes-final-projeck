require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Pilot = require('./models/Pilot');

const products = [
  { name: 'W16 Racing Jacket', nameRu: 'Гоночная куртка W16', price: 189, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', category: 'clothing', descriptionRu: 'Официальная командная гоночная куртка 2025 года. Лёгкая, ветрозащитная.', badge: 'W16', sizes: ['S','M','L','XL','XXL'] },
  { name: '2025 Season Cap', nameRu: 'Бейсболка 2025', price: 49, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600', category: 'accessories', descriptionRu: 'Официальная командная бейсболка. Универсальный размер.', badge: 'NEW' },
  { name: 'AMG Team Polo', nameRu: 'Поло AMG Team', price: 79, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600', category: 'clothing', descriptionRu: 'Классическое командное поло.', sizes: ['S','M','L','XL'] },
  { name: 'Scale Model W16 1:18', nameRu: 'Масштабная модель W16 — 1:18', price: 249, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600', category: 'collectibles', descriptionRu: 'Масштабная модель болида W16 в масштабе 1:18. Литой металл.', badge: 'NEW' },
  { name: 'Silver Arrow Hoodie', nameRu: 'Худи Silver Arrow', price: 119, image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600', category: 'clothing', descriptionRu: 'Премиальное худи с принтом Silver Arrow.', sizes: ['S','M','L','XL','XXL'] },
  { name: 'Team Backpack 2025', nameRu: 'Рюкзак команды 2025', price: 139, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', category: 'accessories', descriptionRu: 'Официальный командный рюкзак с отделением для ноутбука.', badge: 'W16' },
  { name: 'Russell #63 T-Shirt', nameRu: 'Футболка Расселл #63', price: 59, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600', category: 'clothing', descriptionRu: 'Футболка с номером и именем Джорджа Расселла.', sizes: ['S','M','L','XL'] },
  { name: 'Antonelli #12 T-Shirt', nameRu: 'Футболка Антонелли #12', price: 59, image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600', category: 'clothing', descriptionRu: 'Футболка с номером и именем Андреа Ким Антонелли.', badge: 'NEW', sizes: ['S','M','L','XL'] },
];

const pilots = [
  {
    number: 63, name: 'George Russell', nameRu: 'Джордж Расселл',
    nationality: 'Британия', flag: '🇬🇧', born: '1998-02-15', hometown: 'Кингс-Линн, Норфолк',
    bio: 'Джордж Расселл — лидер команды Mercedes-AMG Petronas F1 с 2022 года. Победитель Гран-при Бразилии 2022.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', helmet: '#00d2be',
    stats: { races: 147, wins: 3, podiums: 18, poles: 4, championships: 0 },
    car: 'W16', instagram: 'georgerussell63', twitter: 'GeorgeRussell63',
  },
  {
    number: 12, name: 'Andrea Kimi Antonelli', nameRu: 'Андреа Ким Антонелли',
    nationality: 'Италия', flag: '🇮🇹', born: '2006-08-25', hometown: 'Болонья, Италия',
    bio: 'Андреа Ким Антонелли — самый молодой пилот в истории Mercedes F1. Дебютировал в 2025 году.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500', helmet: '#ffffff',
    stats: { races: 10, wins: 0, podiums: 2, poles: 1, championships: 0 },
    car: 'W16', instagram: 'kimi_antonelli', twitter: 'KimiAntonelli',
  },
];

(async () => {
  await mongoose.connect(process.env.DB_URI);
  await Product.deleteMany({});
  await Pilot.deleteMany({});
  const p = await Product.insertMany(products);
  const pl = await Pilot.insertMany(pilots);
  console.log(`✅ Добавлено товаров: ${p.length}, пилотов: ${pl.length}`);
  process.exit(0);
})();
