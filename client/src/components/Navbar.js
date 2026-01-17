import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaMicrophone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useVoice } from '../context/VoiceContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const { toggleChat } = useVoice();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          🛍️ SmartCart
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          {user && <Link to="/orders">My Orders</Link>}
          {isAdmin && <Link to="/admin">Admin</Link>}
        </div>

        <div className="nav-actions">
          <button className="voice-btn" onClick={toggleChat} title="Voice Assistant">
            <FaMicrophone />
          </button>

          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <FaUser />
              <span>{user.name}</span>
              <button onClick={logout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
