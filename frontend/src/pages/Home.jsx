import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Customize Your Dream Car</h1>
          <p className="hero-subtitle">
            Experience the future of car customization with our cutting-edge 3D visualization technology
          </p>
          <div className="hero-buttons">
            <Link to="/cars" className="btn btn-primary">
              Explore Cars
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚗</div>
              <h3>Premium Selection</h3>
              <p>Choose from a curated selection of luxury and performance vehicles</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Real-Time 3D Customization</h3>
              <p>Visualize your customizations instantly with our advanced 3D technology</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payment</h3>
              <p>Safe and secure checkout powered by Stripe payment gateway</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Order Tracking</h3>
              <p>Track your order from confirmation to delivery in real-time</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Build Your Dream Car?</h2>
          <p>Start customizing today and bring your vision to life</p>
          <Link to="/cars" className="btn btn-large">
            Start Customizing
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
