import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Dashboard.css';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      console.log('Fetching admin stats...');
      const response = await api.get('/admin/stats');
      console.log('Fetched stats:', response.data);
      console.log('Stats data:', response.data.data);
      setStats(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      // Refresh stats after update
      await fetchStats();
      setUpdatingOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
      setUpdatingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="error-container">
        <h2>Failed to load dashboard</h2>
        <p>Please try refreshing the page</p>
      </div>
    );
  }
  
  console.log('Admin dashboard stats:', stats);

  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Monitor your business performance</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            👥
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.overview?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            📝
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.overview?.totalOrders || 0}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            💰
          </div>
          <div className="stat-content">
            <div className="stat-value">₹{stats.overview?.totalRevenue?.toLocaleString() || '0'}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            🚗
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.topCars?.length || 0}</div>
            <div className="stat-label">Car Models</div>
          </div>
        </div>
      </div>

      {/* Orders by Status */}
      <div className="dashboard-section">
        <h2 className="section-title">Orders by Status</h2>
        <div className="status-grid">
          {stats.overview?.ordersByStatus?.map((item) => (
            <div key={item._id} className="status-item">
              <div 
                className="status-badge" 
                style={{ background: getStatusColor(item._id) }}
              >
                {item._id}
              </div>
              <div className="status-count">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-section">
        <h2 className="section-title">Recent Orders</h2>
        <div className="orders-container">
          {stats.recentOrders?.length === 0 && (
            <div className="empty-state">
              <p>No orders yet</p>
            </div>
          )}
          {stats.recentOrders?.map((order) => (
            <div key={order._id} className="order-card admin-order-card">
              <div className="order-header">
                <div className="order-car-info">
                  <img 
                    src={order.car?.thumbnail || 'https://via.placeholder.com/100'} 
                    alt={order.car?.name || 'Car'}
                    className="order-car-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100';
                    }}
                  />
                  <div>
                    <h3 className="order-car-name">{order.car?.name || 'Unknown Car'}</h3>
                    <p className="order-customer">
                      Customer: {order.user?.name || 'Unknown'} ({order.user?.email || 'N/A'})
                    </p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="order-meta">
                  <div 
                    className="order-status"
                    style={{ background: getStatusColor(order.orderStatus) }}
                  >
                    {order.orderStatus}
                  </div>
                  <div className="order-price-small">
                    ₹{order.pricing?.totalPrice?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
              
              {/* Admin Order Tracking & Status Update */}
              <div className="order-tracking admin-tracking">
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
                
                {/* Status Update Dropdown */}
                <div className="status-update">
                  <label>Update Status:</label>
                  <select 
                    value={order.orderStatus}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    disabled={updatingOrder === order._id}
                    className="status-select"
                  >
                    {ORDER_STATUSES.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  {updatingOrder === order._id && <span className="updating">Updating...</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Selling Cars */}
      {stats.topCars && stats.topCars.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">Top Selling Cars</h2>
          <div className="top-cars-grid">
            {stats.topCars.map((car, index) => (
              <div key={car._id?._id || index} className="top-car-card">
                <div className="rank">#{index + 1}</div>
                <img 
                  src={car._id?.thumbnail || 'https://via.placeholder.com/200'} 
                  alt={car._id?.name || 'Car'}
                  className="top-car-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200';
                  }}
                />
                <h3 className="top-car-name">{car._id?.name || 'Unknown Car'}</h3>
                <div className="top-car-stats">
                  <div className="top-car-stat">
                    <span className="stat-label">📝 Orders:</span>
                    <span className="stat-value">{car.count || 0}</span>
                  </div>
                  <div className="top-car-stat">
                    <span className="stat-label">💰 Revenue:</span>
                    <span className="stat-value">₹{car.revenue?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
