import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'COD'
  });

  const shippingPrice = cart.totalPrice > 500 ? 0 : 100;
  const taxPrice = 0;
  const totalPrice = cart.totalPrice + shippingPrice + taxPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          image: item.product.images[0]
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: cart.totalPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      };

      const { data } = await axios.post('/api/orders', orderData);
      
      toast.success('Order placed successfully!');
      await clearCart();
      navigate(`/orders`);
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page container">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h2>Shipping Address</h2>
            
            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="House No, Street Name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Payment Method</h2>
            
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                />
                <span>Cash on Delivery (COD)</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="Credit Card"
                  checked={formData.paymentMethod === 'Credit Card'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                />
                <span>Credit/Debit Card (Demo Only)</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={formData.paymentMethod === 'UPI'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                />
                <span>UPI (Demo Only)</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary place-order-btn" disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-items">
            {cart.items.map(item => (
              <div key={item._id} className="summary-item">
                <img src={item.product.images[0]} alt={item.product.name} />
                <div>
                  <div className="summary-item-name">{item.product.name}</div>
                  <div className="summary-item-qty">Qty: {item.quantity}</div>
                </div>
                <div className="summary-item-price">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cart.totalPrice.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>₹{taxPrice}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
