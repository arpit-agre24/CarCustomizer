import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api';
import './Checkout.css';

// Load Stripe outside of component to avoid recreating on render
let stripePromise = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Checkout Form Component with Stripe
const CheckoutForm = ({ order, orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setCardError(null);

    try {
      // Create payment intent
      const { data } = await api.post('/payment/create-payment-intent', {
        amount: order.pricing.totalPrice,
        orderId: orderId
      });

      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: order.user?.name || 'Customer',
              email: order.user?.email || ''
            }
          }
        }
      );

      if (error) {
        setCardError(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        // Update order payment status
        await api.put(`/orders/${orderId}/payment`, {
          paymentId: paymentIntent.id,
          paymentMethod: 'stripe',
          paymentStatus: 'completed'
        });
        
        // Redirect to dashboard with success message
        navigate('/dashboard', { state: { orderSuccess: true } });
      }
    } catch (err) {
      console.error('Payment error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error message:', err.message);
      setCardError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-container">
        <label>Card Details</label>
        <CardElement options={cardElementOptions} />
      </div>
      
      {cardError && (
        <div className="error-message">{cardError}</div>
      )}

      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="pay-btn"
      >
        {processing ? (
          <>
            <div className="btn-spinner"></div>
            Processing...
          </>
        ) : (
          `Pay ₹${order.pricing.totalPrice.toLocaleString()}`
        )}
      </button>

      <div className="security-badges">
        <div className="badge">🔒 Secure Payment</div>
        <div className="badge">✅ SSL Encrypted</div>
        <div className="badge">🛡️ Protected</div>
      </div>
    </form>
  );
};

// Main Checkout Component
const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stripeKey, setStripeKey] = useState(null);

  useEffect(() => {
    fetchOrder();
    fetchStripeConfig();
  }, [orderId]);

  const fetchStripeConfig = async () => {
    try {
      const response = await api.get('/payment/config');
      setStripeKey(response.data.publishableKey);
    } catch (err) {
      console.error('Error fetching Stripe config:', err);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <h2>Order not found</h2>
        <button onClick={() => navigate('/cars')} className="back-btn">
          Back to Cars
        </button>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">Review your order and complete payment</p>

        <div className="checkout-content">
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="car-summary">
              <img 
                src={order.car.thumbnail}
                alt={order.car.name}
                className="summary-car-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x250';
                }}
              />
              <h3 className="summary-car-name">{order.car.name}</h3>
              <p className="summary-car-brand">{order.car.brand} {order.car.model}</p>
            </div>

            <div className="customization-summary">
              <h3 className="summary-section-title">Customizations</h3>
              
              {order.customization.color && (
                <div className="summary-item">
                  <span className="item-label">Color:</span>
                  <span className="item-value">
                    <span 
                      className="color-dot" 
                      style={{ background: order.customization.color.code }}
                    ></span>
                    {order.customization.color.name}
                    {order.customization.color.price > 0 && (
                      <span className="item-price">+₹{order.customization.color.price.toLocaleString()}</span>
                    )}
                  </span>
                </div>
              )}

              {order.customization.wheels && (
                <div className="summary-item">
                  <span className="item-label">Wheels:</span>
                  <span className="item-value">
                    {order.customization.wheels.name}
                    {order.customization.wheels.price > 0 && (
                      <span className="item-price">+₹{order.customization.wheels.price.toLocaleString()}</span>
                    )}
                  </span>
                </div>
              )}

              {order.customization.bumper && (
                <div className="summary-item">
                  <span className="item-label">Bumper:</span>
                  <span className="item-value">
                    {order.customization.bumper.name}
                    {order.customization.bumper.price > 0 && (
                      <span className="item-price">+₹{order.customization.bumper.price.toLocaleString()}</span>
                    )}
                  </span>
                </div>
              )}

              {order.customization.spoiler && (
                <div className="summary-item">
                  <span className="item-label">Spoiler:</span>
                  <span className="item-value">
                    {order.customization.spoiler.name}
                    {order.customization.spoiler.price > 0 && (
                      <span className="item-price">+₹{order.customization.spoiler.price.toLocaleString()}</span>
                    )}
                  </span>
                </div>
              )}

              {order.customization.extras && order.customization.extras.length > 0 && (
                <div className="extras-section">
                  <span className="item-label">Extras:</span>
                  {order.customization.extras.map((extra, index) => (
                    <div key={index} className="extra-item">
                      <span>{extra.name}</span>
                      <span className="item-price">+₹{extra.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Base Price:</span>
                <span>₹{order.pricing.basePrice.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Customizations:</span>
                <span>+₹{order.pricing.customizationPrice.toLocaleString()}</span>
              </div>
              <div className="price-row price-total">
                <span>Total:</span>
                <span>₹{order.pricing.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="payment-section">
            <h2 className="payment-title">Payment</h2>
            
            <div className="payment-info">
              <div className="info-icon">🔒</div>
              <p>Secure payment powered by Stripe</p>
              <p className="info-note">Your card information is encrypted and secure</p>
            </div>

            {stripeKey ? (
              <Elements stripe={getStripe()}>
                <CheckoutForm order={order} orderId={orderId} />
              </Elements>
            ) : (
              <div className="loading-stripe">Loading payment system...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
