const BASE = import.meta.env.VITE_API_URL || '';

const headers = (extra = {}) => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
};

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса');
  return data;
};

export const api = {
  // Auth
  register: (body) => fetch(`${BASE}/api/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),
  login:    (body) => fetch(`${BASE}/api/auth/login`,    { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),
  me:       ()     => fetch(`${BASE}/api/auth/me`,       { headers: headers() }).then(handle),

  // Products
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${BASE}/api/products${q ? '?' + q : ''}`, { headers: headers() }).then(handle);
  },
  getProduct: (id) => fetch(`${BASE}/api/products/${id}`, { headers: headers() }).then(handle),

  // Orders
  placeOrder: (body) => fetch(`${BASE}/api/orders`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),
  myOrders:   ()     => fetch(`${BASE}/api/orders/my`, { headers: headers() }).then(handle),

  // Payment
  createPaymentIntent: (body) => fetch(`${BASE}/api/payment/create-intent`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),

  // Pilots
  getPilots: () => fetch(`${BASE}/api/pilots`, { headers: headers() }).then(handle),
};
