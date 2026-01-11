import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import './RegisterPage.css';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'donor';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    userType: userType
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        userType: formData.userType,
        createdAt: new Date(),
        rating: 5,
        verified: false
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>🍽️ FoodConnect</h1>
            <h2>Create Account</h2>
            <p>Join as a {formData.userType}</p>
          </div>

          <form onSubmit={handleRegister} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="user-type-selector">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="donor"
                  checked={formData.userType === 'donor'}
                  onChange={handleChange}
                />
                🍽️ Donor
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="ngo"
                  checked={formData.userType === 'ngo'}
                  onChange={handleChange}
                />
                🏢 NGO
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="volunteer"
                  checked={formData.userType === 'volunteer'}
                  onChange={handleChange}
                />
                🤝 Volunteer
              </label>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
            <p><Link to="/">Back to Home</Link></p>
          </div>
        </div>

        <div className="auth-image">
          <div className="image-content">
            <h3>Get Started Today</h3>
            <p>📝 Create your account</p>
            <p>🗺️ Find food nearby</p>
            <p>🚚 Start sharing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;