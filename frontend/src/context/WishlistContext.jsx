import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const toggle = (product) => {
    setItems(prev =>
      prev.some(i => i._id === product._id)
        ? prev.filter(i => i._id !== product._id)
        : [...prev, product]
    );
  };

  const isWished = (id) => items.some(i => i._id === id);
  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, toggle, isWished, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
