import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './CarSelection.css';

const CarSelection = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      console.log('Fetching cars from API...');
      const response = await api.get('/cars');
      console.log('API Response:', response.data);
      setCars(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cars:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(`Failed to load cars: ${err.response?.data?.message || err.message || 'Please check if backend is running on port 5000'}`);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading amazing cars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>😕 Oops!</h2>
        <p>{error}</p>
        <button onClick={fetchCars} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="car-selection">
      <div className="selection-header">
        <h1 className="selection-title">Choose Your Dream Car</h1>
        <p className="selection-subtitle">
          Select from our exclusive collection of luxury vehicles and start customizing
        </p>
      </div>

      {cars.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚗</div>
          <h2>No Cars Available</h2>
          <p>Please run the seed command to add cars to the database:</p>
          <code style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px',
            display: 'block',
            marginTop: '1rem'
          }}>cd backend && npm run seed</code>
        </div>
      ) : (
        <div className="cars-container">
          {cars.map((car) => (
            <div key={car._id} className="car-card">
              <div className="car-image-wrapper">
                <img 
                  src={car.thumbnail} 
                  alt={car.name}
                  className="car-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=Car+Image';
                  }}
                />
                <div className="car-badge">{car.brand}</div>
              </div>
              
              <div className="car-details">
                <h2 className="car-name">{car.name}</h2>
                <p className="car-description">{car.description.substring(0, 120)}...</p>
                
                <div className="car-specs">
                  <div className="spec-item">
                    <span className="spec-icon">⚡</span>
                    <span className="spec-text">{car.specifications.horsepower}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">🔧</span>
                    <span className="spec-text">{car.specifications.engine}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">⚙️</span>
                    <span className="spec-text">{car.specifications.transmission}</span>
                  </div>
                </div>
                
                <div className="car-footer">
                  <div className="car-price">
                    <span className="price-label">Starting at</span>
                    <span className="price-amount">₹{car.basePrice.toLocaleString()}</span>
                  </div>
                  <Link to={`/configurator/${car._id}`} className="customize-btn">
                    Customize Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarSelection;
