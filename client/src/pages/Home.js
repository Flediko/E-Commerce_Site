import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FaRocket, FaMicrophone, FaShoppingBag } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products/top'),
        axios.get('/api/categories')
      ]);
      setTopProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="gradient-text">SmartCart</span>
            </h1>
            <p className="hero-subtitle">
              The Future of Shopping with AI Voice Assistant
            </p>
            <div className="hero-features">
              <div className="feature">
                <FaMicrophone className="feature-icon" />
                <span>Voice Commands</span>
              </div>
              <div className="feature">
                <FaRocket className="feature-icon" />
                <span>Fast Delivery</span>
              </div>
              <div className="feature">
                <FaShoppingBag className="feature-icon" />
                <span>300+ Products</span>
              </div>
            </div>
            <Link to="/products" className="btn btn-primary hero-btn">
              Start Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="category-card"
              >
                <img src={category.image} alt={category.name} />
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Products Section */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Top Rated Products</h2>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="grid grid-4">
              {topProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-20">
            <Link to="/products" className="btn btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Voice Assistant Info */}
      <section className="voice-info-section">
        <div className="container">
          <div className="voice-info-card">
            <FaMicrophone className="voice-info-icon" />
            <h2>Try Our AI Voice Assistant!</h2>
            <p>
              Click the microphone button at the bottom right and say commands like:
            </p>
            <ul className="voice-commands-list">
              <li>"Show me laptops under 50000"</li>
              <li>"Recommend best smartphones"</li>
              <li>"What's trending in electronics?"</li>
              <li>"Add to cart"</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
