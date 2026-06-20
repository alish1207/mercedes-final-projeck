import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product, size) => {
    setItems(prev => {
      const key = product._id + (size || '');
      const existing = prev.find(i => i._key === key);
      if (existing) return prev.map(i => i._key === key ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1, size: size || null, _key: key }];
    });
  };

  const removeItem = (key) => setItems(prev => prev.filter(i => i._key !== key));
  const updateQty = (key, qty) => {
    if (qty < 1) return removeItem(key);
    setItems(prev => prev.map(i => i._key === key ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
