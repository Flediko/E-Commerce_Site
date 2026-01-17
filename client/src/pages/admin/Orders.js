import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Manage Orders</h1>
      
      <div style={{ background: 'white', borderRadius: '10px', padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Order ID</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Customer</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Total</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '15px' }}>#{order._id.slice(-8)}</td>
                <td style={{ padding: '15px' }}>{order.user?.name || 'N/A'}</td>
                <td style={{ padding: '15px' }}>₹{order.totalPrice.toLocaleString()}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: order.orderStatus === 'Delivered' ? '#d1fae5' : '#fef3c7',
                    color: order.orderStatus === 'Delivered' ? '#065f46' : '#92400e'
                  }}>
                    {order.orderStatus}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    style={{ padding: '5px 10px', borderRadius: '5px' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
