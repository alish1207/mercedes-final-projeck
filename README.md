# 🏎 Mercedes-AMG F1 Store v2 — Improved

## 🚀 Запуск

### 1. Backend
```bash
cd backend
npm install
node src/seed.js   # заполнить БД один раз
npm run dev        # → http://localhost:5000
```

### 2. Frontend (в другом терминале)
```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

Открой браузер: **http://localhost:5173**

---

## ✨ Что улучшено

### Backend
- Роли пользователей (user / admin) — защита admin-маршрутов
- Rate limiting — защита от брутфорса
- Валидация всех входящих данных
- Цены в заказе берутся из БД (нельзя подменить)
- Пагинация товаров и заказов
- Поиск по EN и RU названию
- Пилоты перенесены в MongoDB
- Смена пароля через /api/auth/me/password

### Frontend
- Главная страница (/) с hero, статистикой, новинками
- Вишлист — кнопка ♡ на карточке, страница /wishlist
- Фильтр по цене (слайдер) и размеру
- Счётчик вишлиста в шапке

---

## 🌐 API

| Метод | URL | Доступ |
|---|---|---|
| POST | /api/auth/register | Все |
| POST | /api/auth/login | Все |
| GET  | /api/auth/me | Авторизованные |
| PUT  | /api/auth/me | Авторизованные |
| PUT  | /api/auth/me/password | Авторизованные |
| GET  | /api/products | Все |
| POST | /api/products | Только admin |
| PUT  | /api/products/:id | Только admin |
| DELETE | /api/products/:id | Только admin |
| POST | /api/orders | Все (гости тоже) |
| GET  | /api/orders/my | Авторизованные |
| GET  | /api/orders | Только admin |
| PATCH | /api/orders/:id/status | Только admin |
| GET  | /api/pilots | Все |
| POST | /api/payment/create-intent | Авторизованные |
# mercedes-final-projeck
