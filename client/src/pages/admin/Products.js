import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Products.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products?limit=100');
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      toast.error('Error loading products');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (error) {
      toast.error('Error loading categories');
    }
  };

  const handleInputChange = (e) => {
    setCurrentProduct({
      ...currentProduct,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (editMode) {
        await axios.put(`/api/products/${currentProduct._id}`, currentProduct, config);
        toast.success('Product updated successfully!');
      } else {
        await axios.post('/api/products', currentProduct, config);
        toast.success('Product created successfully!');
      }

      setShowModal(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct({
      ...product,
      category: product.category._id
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/products/${id}`,
        { isActive: !isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Product ${!isActive ? 'activated' : 'deactivated'}`);
      fetchProducts();
    } catch (error) {
      toast.error('Error updating product status');
    }
  };

  const resetForm = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      stock: '',
      image: ''
    });
    setEditMode(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add New Product
        </button>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img src={product.image} alt={product.name} className="product-thumb" />
                </td>
                <td>{product.name}</td>
                <td>{product.category?.name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>⭐ {product.rating.toFixed(1)}</td>
                <td>
                  <span className={`status ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(product)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-toggle"
                      onClick={() => handleToggleActive(product._id, product.isActive)}
                      title={product.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {product.isActive ? '👁️' : '🚫'}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={currentProduct.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={currentProduct.price}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={currentProduct.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={currentProduct.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={currentProduct.brand}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  name="image"
                  value={currentProduct.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editMode ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
