const API_BASE = '/api';

export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE}/items`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const addProduct = async (product) => {
  const response = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to add product');
  return response.json();
};

export const fetchStats = async () => {
  const response = await fetch(`${API_BASE}/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};