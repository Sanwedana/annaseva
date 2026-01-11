import React, { useState } from 'react';
import './DashboardPage.css';

const DashboardPage = () => {
  const [userType, setUserType] = useState('donor');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const mockDonors = [
    {
      id: 1,
      name: 'Pizza Palace',
      food: '10 large pizzas',
      expiryTime: '30 mins',
      distance: '0.5 km',
      location: 'Downtown Area, Street 5',
      lat: 40.7128,
      lng: -74.0060,
      pickup: 'Available Now'
    },
    {
      id: 2,
      name: 'Happy Kitchen',
      food: '5 kg rice & curry',
      expiryTime: '45 mins',
      distance: '1.2 km',
      location: 'North Zone, Market Square',
      lat: 40.7150,
      lng: -74.0060,
      pickup: 'Available in 10 mins'
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>𝓐𝓷𝓷𝓪𝓢𝓮𝓥𝓪 Dashboard</h1>
        <div className="user-type-toggle">
          <button className={userType === 'donor' ? 'active' : ''} onClick={() => setUserType('donor')}>
            I'm a Donor
          </button>
          <button className={userType === 'ngo' ? 'active' : ''} onClick={() => setUserType('ngo')}>
            I'm an NGO/Receiver
          </button>
          <button className={userType === 'volunteer' ? 'active' : ''} onClick={() => setUserType('volunteer')}>
            I'm a Volunteer
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {userType === 'donor' && (
          <div className="donor-section">
            <div className="section-header">
              <h2>Post Food for Pickup</h2>
              <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                + List Food Now
              </button>
            </div>

            {showCreateForm && (
              <div className="food-form">
                <input type="text" placeholder="Food Type (e.g., Pizza, Rice, etc.)" />
                <input type="number" placeholder="Quantity (kg or units)" />
                <select>
                  <option>Expiry in 15 mins</option>
                  <option>Expiry in 30 mins</option>
                  <option>Expiry in 1 hour</option>
                </select>
                <textarea placeholder="Food Description & dietary info..."></textarea>
                <button className="btn btn-primary">Post Now</button>
              </div>
            )}
          </div>
        )}

        {userType === 'ngo' && (
          <div className="receiver-section">
            <div className="section-header">
              <h2>🗺️ Available Food Nearby</h2>
              <p>Tap on a location to pickup instantly</p>
            </div>

            <div className="map-container">
              <iframe
                title="Google Maps - AnnaSeva"
                width="100%"
                height="400"
                style={{ borderRadius: '10px' }}
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d30153.540123759063!2d-74.0059728!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1234567890"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

            <div className="food-listings">
              {mockDonors.map(donor => (
                <div key={donor.id} className="food-card">
                  <div className="food-info">
                    <h3>{donor.name}</h3>
                    <p>🍲 {donor.food}</p>
                    <p>⏱️ Expires in {donor.expiryTime}</p>
                    <p>📍 <strong>Location:</strong> {donor.location}</p>
                    <p>🚶 {donor.distance} away</p>
                    <p className="pickup-status">✅ {donor.pickup}</p>
                  </div>
                  <button className="btn btn-primary">Request Pickup</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {userType === 'volunteer' && (
          <div className="volunteer-section">
            <div className="section-header">
              <h2>🚚 Available Pickup Requests</h2>
              <p>Help deliver food and earn volunteer hours!</p>
            </div>

            <div className="requests-list">
              <div className="request-card">
                <h3>Pizza Palace → Community Center</h3>
                <p>📦 10 large pizzas (Expires in 25 mins)</p>
                <p>📍 Downtown Area, Street 5</p>
                <p>📍 0.8 km away</p>
                <p>⭐ +2 volunteer hours</p>
                <button className="btn btn-primary">Accept Request</button>
              </div>
              <div className="request-card">
                <h3>Happy Kitchen → Hope NGO</h3>
                <p>📦 5 kg rice & curry (Expires in 40 mins)</p>
                <p>📍 North Zone, Market Square</p>
                <p>📍 1.5 km away</p>
                <p>⭐ +3 volunteer hours</p>
                <button className="btn btn-primary">Accept Request</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;