import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'Pending': 'status-pending',
      'Processing': 'status-processing',
      'Shipped': 'status-shipped',
      'Delivered': 'status-delivered',
      'Cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders container">
        <h2>No Orders Yet</h2>
        <p>Start shopping to create your first order!</p>
      </div>
    );
  }

  return (
    <div className="orders-page container">
      <h1>My Orders</h1>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`order-status ${getStatusClass(order.orderStatus)}`}>
                {order.orderStatus}
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="order-item-details">
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-qty">Quantity: {item.quantity}</div>
                    <div className="order-item-price">₹{item.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-address">
                <strong>Delivery Address:</strong>
                <p>
                  {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                  {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                </p>
              </div>
              <div className="order-total">
                <strong>Total: ₹{order.totalPrice.toLocaleString()}</strong>
                <p>Payment: {order.paymentMethod}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
