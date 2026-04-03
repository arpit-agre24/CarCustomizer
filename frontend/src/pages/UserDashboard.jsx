import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import './Dashboard.css';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchOrders();
    
    // Check if redirected after successful order
    if (location.state?.orderSuccess) {
      setShowSuccess(true);
      // Clear the state after showing message
      window.history.replaceState({}, document.title);
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [location]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/myorders');
      console.log('Fetched orders:', response.data.data);
      
      // Debug: Check if car data is present
      response.data.data?.forEach((order, i) => {
        console.log(`Order ${i} car:`, order.car);
      });
      
      setOrders(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      console.error('Error response:', err.response?.data);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa500',
      confirmed: '#4caf50',
      processing: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#718096';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  console.log('Rendering dashboard with orders:', orders);

  return (
    <div className="dashboard">
      {showSuccess && (
        <div className="success-banner">
          <div className="success-icon">✓</div>
          <div className="success-message">
            <h3>Order Placed Successfully!</h3>
            <p>Your order has been confirmed and is being processed.</p>
          </div>
        </div>
      )}
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Dashboard</h1>
        <p className="dashboard-subtitle">Track your orders and customizations</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚗</div>
          <h2>No Orders Yet</h2>
          <p>Start customizing your dream car today!</p>
          <Link to="/cars" className="cta-btn">Browse Cars</Link>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-car-info">
                  <img 
                    src={order.car?.thumbnail || 'https://via.placeholder.com/150'} 
                    alt={order.car?.name || 'Car'}
                    className="order-car-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  <div>
                    <h3 className="order-car-name">{order.car?.name || 'Unknown Car'}</h3>
                    <p className="order-date">
                      Ordered: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div 
                  className="order-status"
                  style={{ background: getStatusColor(order.orderStatus) }}
                >
                  {order.orderStatus}
                </div>
              </div>

              <div className="order-customization">
                <h4>Customizations</h4>
                <div className="customization-details">
                  {order.customization?.color && (
                    <div className="detail-item">
                      <span className="detail-label">Color:</span>
                      <span className="detail-value">
                        <span 
                          className="color-dot" 
                          style={{ background: order.customization.color.code }}
                        ></span>
                        {order.customization.color.name}
                      </span>
                    </div>
                  )}
                  {order.customization?.wheels && (
                    <div className="detail-item">
                      <span className="detail-label">Wheels:</span>
                      <span className="detail-value">{order.customization.wheels.name}</span>
                    </div>
                  )}
                  {order.customization?.bumper && (
                    <div className="detail-item">
                      <span className="detail-label">Bumper:</span>
                      <span className="detail-value">{order.customization.bumper.name}</span>
                    </div>
                  )}
                  {order.customization?.spoiler && (
                    <div className="detail-item">
                      <span className="detail-label">Spoiler:</span>
                      <span className="detail-value">{order.customization.spoiler.name}</span>
                    </div>
                  )}
                  {order.customization?.extras && order.customization.extras.length > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">Extras:</span>
                      <span className="detail-value">
                        {order.customization.extras.map(e => e.name).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="order-footer">
                <div className="order-price">
                  <span className="price-label">Total:</span>
                  <span className="price-amount">₹{order.pricing?.totalPrice?.toLocaleString() || '0'}</span>
                </div>
                <div className="order-payment">
                  <span 
                    className={`payment-status ${order.paymentInfo?.paymentStatus || 'pending'}`}
                  >
                    {order.paymentInfo?.paymentStatus === 'completed' ? '✓ Paid' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Order Tracking */}
              <div className="order-tracking">
                <h4>Order Tracking</h4>
                <div className="tracking-timeline">
                  {[
                    { status: 'pending', label: 'Order Placed', icon: '📝' },
                    { status: 'confirmed', label: 'Confirmed', icon: '✓' },
                    { status: 'processing', label: 'Processing', icon: '⚙️' },
                    { status: 'shipped', label: 'Shipped', icon: '🚚' },
                    { status: 'delivered', label: 'Delivered', icon: '🎉' }
                  ].map((step, index) => {
                    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
                    const currentStatusIndex = statusOrder.indexOf(order.orderStatus);
                    const stepIndex = statusOrder.indexOf(step.status);
                    const isCompleted = stepIndex <= currentStatusIndex;
                    const isCurrent = stepIndex === currentStatusIndex;
                    
                    return (
                      <div 
                        key={step.status} 
                        className={`tracking-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                      >
                        <div className="step-icon">{step.icon}</div>
                        <div className="step-label">{step.label}</div>
                        {index < 4 && <div className="step-line"></div>}
                      </div>
                    );
                  })}
                </div>
                <div className="current-status">
                  Current Status: <span className="status-text">{order.orderStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
