import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import './HomePage.css';

const HomePage = () => {
  const [feedbackForm, setFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showGallery, setShowGallery] = useState(false);

  const handleFeedback = async () => {
    if (!feedback.trim()) {
      alert('Please enter your feedback!');
      return;
    }
    
    try {
      await addDoc(collection(db, 'feedback'), {
        message: feedback,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent
      });
      alert('Thank you for your feedback! We appreciate your suggestions.');
      setFeedback('');
      setFeedbackForm(false);
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Error saving feedback. Please try again.');
    }
  };

  const heroBackgroundImage = 'https://divyanur.org/uploads/what-we-do-details/Anna_Seva.webp';

  return (
    <div className="home-page">
      {/* Hero Section with Background Image */}
      <div 
        className="hero"
        style={{
          backgroundImage: `url('${heroBackgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 
            className="devnagari-title"
            onMouseEnter={() => setShowGallery(true)}
            onMouseLeave={() => setShowGallery(false)}
          >
            𝙰𝚗𝚗𝚊𝚂𝚎𝚟𝚊
          </h1>
          
          <p className="hero-tagline">Saving food, serving humanity.</p>
          
          {showGallery && (
            <div className="gallery-overlay">
              <div className="gallery-grid">
                <img src="https://images.unsplash.com/photo-1488521787991-2726f568266f?w=300&h=300&fit=crop" alt="Food sharing 1" />
                <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop" alt="Community 1" />
                <img src="https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=300&h=300&fit=crop" alt="Helping 1" />
                <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=300&fit=crop" alt="Donation 1" />
                <img src="https://images.unsplash.com/photo-1535982066051-384ca081e815?w=300&h=300&fit=crop" alt="Food 1" />
                <img src="https://images.unsplash.com/photo-1594095769052-f1a99edffe41?w=300&h=300&fit=crop" alt="Care 1" />
              </div>
            </div>
          )}
          
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Join Now</Link>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="about-section">
        <div className="about-container">
          <h2>About AnnaSeva</h2>
          <div className="about-content">
            <div>
              <p>
                AnnaSeva is a simple food sharing platform that helps save extra food instead of throwing it away. 
                People or places with surplus food can post details on the platform, and nearby NGOs or volunteers 
                can quickly collect and distribute it to people in need.
              </p>
            </div>
            <div>
              <p>
                The system uses location and time to make sure food is picked up fast and safely. It also helps donors 
                understand how much food they waste, so they can plan better next time. This way, we reduce food waste, 
                help hungry people, and protect the environment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Type Selection */}
      <div className="user-types-section">
        <h2>Who Are You?</h2>
        <div className="user-types">
          <Link to="/register?type=donor" className="user-type-card donor-card">
            <div className="type-icon">🍽️</div>
            <h3>Restaurant Donor</h3>
            <p>List excess food from your restaurant</p>
            <ul>
              <li>✓ Instant pickup scheduling</li>
              <li>✓ Track food donations</li>
              <li>✓ Tax deduction certificates</li>
            </ul>
          </Link>

          <Link to="/register?type=ngo" className="user-type-card ngo-card">
            <div className="type-icon">🏢</div>
            <h3>NGO/Organization</h3>
            <p>Receive food for your communities</p>
            <ul>
              <li>✓ Browse nearby donors</li>
              <li>✓ Request food instantly</li>
              <li>✓ Schedule pickups</li>
            </ul>
          </Link>

          <Link to="/register?type=volunteer" className="user-type-card volunteer-card">
            <div className="type-icon">🤝</div>
            <h3>Volunteer</h3>
            <p>Help pickup and deliver food</p>
            <ul>
              <li>✓ Find pickup requests</li>
              <li>✓ Track deliveries</li>
              <li>✓ Earn volunteer hours</li>
            </ul>
          </Link>
        </div>
      </div>

      {/* Taglines Section */}
      <div className="taglines-section">
        <div className="tagline-card">
          <h3>Waste Less, Serve More</h3>
          <p>Every meal shared is a step towards sustainability</p>
        </div>
        <div className="tagline-card">
          <h3>Every Bite Counts for Change</h3>
          <p>Transform surplus into solutions for hunger</p>
        </div>
        <div className="tagline-card">
          <h3>Connect. Share. Impact.</h3>
          <p>Building communities through food sharing</p>
        </div>
      </div>

      {/* Impacts Section */}
      <div className="impacts-section">
        <h2>Our Impact</h2>
        <div className="impacts-grid">
          <div className="impact-card">
            <div className="impact-icon">🍲</div>
            <h3>Hunger Reduced</h3>
            <p>Thousands of meals reaching those in need</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">♻️</div>
            <h3>Waste Eliminated</h3>
            <p>Redirecting food from landfills to tables</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">🌍</div>
            <h3>Emissions Cut</h3>
            <p>Reducing carbon footprint through sharing</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">💰</div>
            <h3>Resources Saved</h3>
            <p>Maximizing value from available resources</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">📊</div>
            <h3>Costs Lowered</h3>
            <p>Economic benefits for all participants</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">❤️</div>
            <h3>Lives Nourished</h3>
            <p>Building healthier, happier communities</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>List Food</h3>
            <p>Post excess food with location on map</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Notify Receivers</h3>
            <p>System alerts nearby NGOs & volunteers</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Handover & Review</h3>
            <p>Complete pickup and share feedback</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Track Impact</h3>
            <p>Monitor donations & environmental impact</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2>Ready to Make a Difference?</h2>
        <p className="cta-tagline">Every action counts. Join us today.</p>
        <Link to="/register" className="btn btn-primary btn-large">Get Started Now</Link>
      </div>

      {/* Feedback Button */}
      <button className="feedback-btn" onClick={() => setFeedbackForm(!feedbackForm)}>
        💬 Send Feedback
      </button>

      {/* Feedback Modal */}
      {feedbackForm && (
        <div className="feedback-modal">
          <div className="feedback-content">
            <h3>We Value Your Feedback</h3>
            <textarea
              placeholder="Tell us how we can improve AnnaSeva..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="5"
            ></textarea>
            <div className="feedback-buttons">
              <button className="btn btn-primary" onClick={handleFeedback}>Submit</button>
              <button className="btn btn-secondary" onClick={() => setFeedbackForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;