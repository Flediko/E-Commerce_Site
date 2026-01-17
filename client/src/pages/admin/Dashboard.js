import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/orders')
      ]);

      const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.totalPrice, 0);

      setStats({
        totalProducts: productsRes.data.total,
        totalOrders: ordersRes.data.length,
        totalRevenue,
        totalUsers: 0 // You can add users endpoint if needed
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="admin-dashboard container">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <FaBox color="#1e40af" />
          </div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <FaShoppingCart color="#92400e" />
          </div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <FaDollarSign color="#065f46" />
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ddd6fe' }}>
            <FaUsers color="#5b21b6" />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/products" className="admin-action-btn">
          <FaBox /> Manage Products
        </Link>
        <Link to="/admin/orders" className="admin-action-btn">
          <FaShoppingCart /> Manage Orders
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
