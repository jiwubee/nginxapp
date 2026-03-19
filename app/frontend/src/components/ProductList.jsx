import React, { useState, useEffect } from 'react';
import { fetchProducts, addProduct } from '../api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instanceId, setInstanceId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data.data);
      setInstanceId(data.instanceId);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await addProduct(formData);
      setFormData({ name: '', price: '', category: '' });
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Products</h1>
      
      {instanceId && (
        <div className="info-box">
          <small>Backend Instance: <code>{instanceId}</code></small>
        </div>
      )}

      <div className="form-section">
        <h2>Add New Product</h2>
        <form onSubmit={handleAddProduct}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="price"
              placeholder="Price"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="category"
              placeholder="Category (optional)"
              value={formData.category}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">Error: {error}</div>}
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {products.length === 0 ? (
            <p>No products found. Add one to get started!</p>
          ) : (
            products.map(product => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">${product.price.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ProductList;