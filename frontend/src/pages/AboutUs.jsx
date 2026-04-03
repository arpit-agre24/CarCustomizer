import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About CarCustomizer</h1>
          <p>Transforming dreams into reality, one custom car at a time</p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="about-section mission-section">
        <div className="about-container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              At CarCustomizer, we believe every car should be as unique as its owner. 
              Our mission is to provide an immersive, intuitive platform where car enthusiasts 
              can design, customize, and order their dream vehicles with unprecedented ease and precision.
            </p>
            <p>
              Founded in 2024, we've revolutionized the car buying experience by combining 
              cutting-edge 3D visualization technology with a seamless ordering process.
            </p>
          </div>
          <div className="mission-image">
            <div className="feature-icon">🚗</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="about-section features-section">
        <div className="about-container">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>3D Customization</h3>
              <p>Experience your car in stunning 3D with real-time color, wheel, and accessory changes</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Pricing</h3>
              <p>See live price updates as you customize, with transparent breakdown of all costs</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payments</h3>
              <p>Industry-leading Stripe integration for safe and seamless transactions</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Order Tracking</h3>
              <p>Real-time updates on your order status from confirmation to delivery</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Premium Quality</h3>
              <p>Only the finest vehicles and customization options from trusted manufacturers</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>24/7 Support</h3>
              <p>Our dedicated team is always here to help with any questions or concerns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="about-section stats-section">
        <div className="about-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Car Models</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Customizations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="about-section team-section">
        <div className="about-container">
          <h2>Meet Our Team</h2>
          <p className="team-intro">Passionate car enthusiasts dedicated to delivering excellence</p>
          
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💼</div>
              <h3>Alex Thompson</h3>
              <p className="member-role">Founder & CEO</p>
              <p className="member-bio">Car enthusiast with 15+ years in automotive industry</p>
            </div>

            <div className="team-member">
              <div className="member-avatar">👩‍💻</div>
              <h3>Sarah Chen</h3>
              <p className="member-role">Lead Developer</p>
              <p className="member-bio">Full-stack expert passionate about 3D visualization</p>
            </div>

            <div className="team-member">
              <div className="member-avatar">👨‍🎨</div>
              <h3>Marcus Rodriguez</h3>
              <p className="member-role">Design Director</p>
              <p className="member-bio">Award-winning automotive designer</p>
            </div>

            <div className="team-member">
              <div className="member-avatar">👩‍💼</div>
              <h3>Emily Watson</h3>
              <p className="member-role">Customer Success</p>
              <p className="member-bio">Dedicated to ensuring every customer is delighted</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="about-section cta-section">
        <div className="about-container">
          <h2>Ready to Customize Your Dream Car?</h2>
          <p>Start your journey today and experience the future of car buying</p>
          <a href="/cars" className="cta-button">Explore Cars</a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
