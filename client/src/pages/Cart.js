import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart container">
        <h2>Your Cart is Empty</h2>
        <p>Add some products to get started!</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1>Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.product.images[0]} alt={item.product.name} />
              
              <div className="item-details">
                <Link to={`/products/${item.product._id}`} className="item-name">
                  {item.product.name}
                </Link>
                <div className="item-brand">{item.product.brand}</div>
                <div className="item-price">₹{item.price.toLocaleString()}</div>
              </div>

              <div className="item-actions">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={loading || item.quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={loading || item.quantity >= item.product.stock}
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="item-total">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                  disabled={loading}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal ({cart.items.length} items)</span>
            <span>₹{cart.totalPrice.toLocaleString()}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{cart.totalPrice > 500 ? 'FREE' : '₹100'}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{(cart.totalPrice + (cart.totalPrice > 500 ? 0 : 100)).toLocaleString()}</span>
          </div>

          <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>

          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
