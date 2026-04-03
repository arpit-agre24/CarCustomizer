import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from '@react-three/drei';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Car3D from '../components/car/Car3D';
import './Configurator.css';

// Preload car models
useGLTF.preload('/models/tesla-model-s.glb');
useGLTF.preload('/models/porsche-911.glb');

const Configurator = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth(); // Get user role from auth context
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedWheels, setSelectedWheels] = useState(null);
  const [selectedBumper, setSelectedBumper] = useState(null);
  const [selectedSpoiler, setSelectedSpoiler] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    fetchCarDetails();
    // Clear GLTF cache when switching cars to ensure fresh load
    useGLTF.clear();
  }, [carId]);

  useEffect(() => {
    if (car) {
      calculatePrice();
    }
  }, [selectedColor, selectedWheels, selectedBumper, selectedSpoiler, selectedExtras, car]);

  const fetchCarDetails = async () => {
    try {
      const response = await api.get(`/cars/${carId}`);
      const carData = response.data.data;
      setCar(carData);
      
      // Set default selections
      if (carData.customizationOptions.colors.length > 0) {
        setSelectedColor(carData.customizationOptions.colors[0]);
      }
      if (carData.customizationOptions.wheels.length > 0) {
        setSelectedWheels(carData.customizationOptions.wheels[0]);
      }
      if (carData.customizationOptions.bumpers && carData.customizationOptions.bumpers.length > 0) {
        setSelectedBumper(carData.customizationOptions.bumpers[0]);
      }
      if (carData.customizationOptions.spoilers && carData.customizationOptions.spoilers.length > 0) {
        setSelectedSpoiler(carData.customizationOptions.spoilers[0]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching car:', err);
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!car) return;
    
    let price = car.basePrice;
    if (selectedColor) price += selectedColor.price;
    if (selectedWheels) price += selectedWheels.price;
    if (selectedBumper) price += selectedBumper.price;
    if (selectedSpoiler) price += selectedSpoiler.price;
    selectedExtras.forEach(extra => price += extra.price);
    
    setTotalPrice(price);
  };

  const toggleExtra = (extra) => {
    setSelectedExtras(prev => {
      const exists = prev.find(e => e.name === extra.name);
      if (exists) {
        return prev.filter(e => e.name !== extra.name);
      } else {
        return [...prev, extra];
      }
    });
  };

  const handlePlaceOrder = async () => {
    if (placingOrder) return;
    
    // Check if user is admin
    if (isAdmin) {
      alert('Admin users cannot place orders. Admin accounts are for managing orders only.');
      return;
    }
    
    setPlacingOrder(true);
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to place an order');
        navigate('/login');
        return;
      }

      const orderData = {
        carId: car._id,
        customization: {
          color: selectedColor,
          wheels: selectedWheels,
          bumper: selectedBumper,
          spoiler: selectedSpoiler,
          extras: selectedExtras
        },
        customerDetails: {
          name: '',
          email: '',
          phone: ''
        }
      };

      console.log('Creating order with data:', orderData);
      const response = await api.post('/orders', orderData);
      console.log('Order created:', response.data);
      const orderId = response.data.data._id;
      navigate(`/checkout/${orderId}`);
    } catch (err) {
      console.error('Order creation error:', err);
      console.error('Error response:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading configurator...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="error-container">
        <h2>Car not found</h2>
        <button onClick={() => navigate('/cars')} className="back-btn">
          Back to Cars
        </button>
      </div>
    );
  }

  return (
    <div className="configurator">
      {/* Left: 3D Model View */}
      <div className="configurator-3d">
        <Canvas>
          <PerspectiveCamera makeDefault position={[10, 3, 6]} />
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minDistance={4}
            maxDistance={12}
          />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
          <spotLight position={[-5, 10, -5]} angle={0.3} penumbra={1} intensity={0.8} />
          
          {/* 3D Car Model */}
          <Car3D 
            key={car._id}
            modelPath={car.modelPath}
            color={selectedColor?.code}
          />
          
          <Environment preset="city" />
          <gridHelper args={[20, 30]} position={[0, -1.3, 0]} />
        </Canvas>
        
        <div className="view-hint">
          🖱️ Drag to rotate • Scroll to zoom
        </div>
      </div>

      {/* Right: Customization Panel with Integrated Pricing */}
      <div className="configurator-panel">
        <div className="panel-header">
          <h1 className="panel-title">{car.name}</h1>
          <p className="panel-subtitle">Customize your {car.brand}</p>
        </div>

        {/* Fixed Pricing Bar at Top */}
        <div className="pricing-bar">
          <div className="pricing-info">
            <span className="pricing-label">Total Price:</span>
            <span className="pricing-amount">₹{totalPrice.toLocaleString()}</span>
          </div>
          {isAdmin ? (
            <button 
              className="order-btn admin-disabled"
              disabled
              title="Admin users cannot place orders"
            >
              🔒 Admin View Only
            </button>
          ) : (
            <button 
              onClick={handlePlaceOrder} 
              className="order-btn"
              disabled={placingOrder}
            >
              {placingOrder ? 'Processing...' : '🚗 Place Order'}
            </button>
          )}
        </div>

        <div className="panel-content">
          <div className="customization-sections">
          {/* Colors */}
          <div className="customization-section">
            <h3 className="section-title">Exterior Color 🎨</h3>
            <div className="color-options">
              {car.customizationOptions.colors.map((color) => (
                <div
                  key={color.name}
                  className={`color-option ${selectedColor?.name === color.name ? 'selected' : ''}`}
                  onClick={() => setSelectedColor(color)}
                >
                  <div 
                    className="color-swatch" 
                    style={{ background: color.code }}
                  ></div>
                  <div className="color-info">
                    <span className="color-name">{color.name}</span>
                    <span className="color-price">
                      {color.price > 0 ? `+₹${color.price.toLocaleString()}` : 'Included'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wheels */}
          <div className="customization-section">
            <h3 className="section-title">Wheels ⚙️</h3>
            <div className="wheel-options">
              {car.customizationOptions.wheels.map((wheel) => (
                <div
                  key={wheel.name}
                  className={`wheel-option ${selectedWheels?.name === wheel.name ? 'selected' : ''}`}
                  onClick={() => setSelectedWheels(wheel)}
                >
                  <div className="wheel-name">{wheel.name}</div>
                  <div className="wheel-price">
                    {wheel.price > 0 ? `+₹${wheel.price.toLocaleString()}` : 'Included'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bumpers */}
          {car.customizationOptions.bumpers && car.customizationOptions.bumpers.length > 0 && (
            <div className="customization-section">
              <h3 className="section-title">Bumper Style 🔧</h3>
              <div className="bumper-options">
                {car.customizationOptions.bumpers.map((bumper) => (
                  <div
                    key={bumper.name}
                    className={`bumper-option ${selectedBumper?.name === bumper.name ? 'selected' : ''}`}
                    onClick={() => setSelectedBumper(bumper)}
                  >
                    <div className="bumper-name">{bumper.name}</div>
                    <div className="bumper-price">
                      {bumper.price > 0 ? `+₹${bumper.price.toLocaleString()}` : 'Included'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spoilers */}
          {car.customizationOptions.spoilers && car.customizationOptions.spoilers.length > 0 && (
            <div className="customization-section">
              <h3 className="section-title">Spoiler 🏎️</h3>
              <div className="spoiler-options">
                {car.customizationOptions.spoilers.map((spoiler) => (
                  <div
                    key={spoiler.name}
                    className={`spoiler-option ${selectedSpoiler?.name === spoiler.name ? 'selected' : ''}`}
                    onClick={() => setSelectedSpoiler(spoiler)}
                  >
                    <div className="spoiler-name">{spoiler.name}</div>
                    <div className="spoiler-price">
                      {spoiler.price > 0 ? `+₹${spoiler.price.toLocaleString()}` : 'Included'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extras */}
          {car.customizationOptions.extras && car.customizationOptions.extras.length > 0 && (
            <div className="customization-section">
              <h3 className="section-title">Extras ✨</h3>
              <div className="extras-options">
                {car.customizationOptions.extras.map((extra) => (
                  <div
                    key={extra.name}
                    className={`extra-option ${selectedExtras.find(e => e.name === extra.name) ? 'selected' : ''}`}
                    onClick={() => toggleExtra(extra)}
                  >
                    <div className="extra-checkbox">
                      {selectedExtras.find(e => e.name === extra.name) && '✓'}
                    </div>
                    <div className="extra-info">
                      <span className="extra-name">{extra.name}</span>
                      <span className="extra-description">{extra.description}</span>
                      <span className="extra-price">+₹{extra.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurator;
