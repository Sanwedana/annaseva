import React, { useMemo } from 'react';
import {
  matchFoodToReceivers,
  rankVolunteerRequests,
  estimateFoodImpact,
  getDonorSuggestions,
  predictPickupUrgency,
} from '../services/aiService';
import './AIInsights.css';

// ── Sample receiver / request data used when real data is unavailable ─────────

const SAMPLE_RECEIVERS = [
  { id: 'ngo_1', name: 'Asha Foundation', lat: 40.715, lng: -74.007, dietary: 'veg',    capacity: 30 },
  { id: 'ngo_2', name: 'Hope NGO',        lat: 40.711, lng: -74.004, dietary: 'any',    capacity: 50 },
  { id: 'ngo_3', name: 'Seva Trust',      lat: 40.718, lng: -74.010, dietary: 'veg',    capacity: 20 },
  { id: 'ngo_4', name: 'Roti Bank',       lat: 40.720, lng: -74.001, dietary: 'nonveg', capacity: 40 },
];

const SAMPLE_REQUESTS = [
  { id: 'req_1', title: 'Pizza Palace → Community Center', food: 'Pizzas',       quantity: 10, expiryMins: 25, lat: 40.7128, lng: -74.006,  volunteerHours: 2 },
  { id: 'req_2', title: 'Happy Kitchen → Hope NGO',        food: 'Rice & Curry', quantity: 5,  expiryMins: 40, lat: 40.7150, lng: -74.006,  volunteerHours: 3 },
  { id: 'req_3', title: 'Green Café → Seva Trust',         food: 'Sandwiches',   quantity: 20, expiryMins: 60, lat: 40.7100, lng: -74.009,  volunteerHours: 1 },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const UrgencyBadge = ({ label, color }) => (
  <span className="ai-urgency-badge" style={{ background: color }}>
    {label}
  </span>
);

const ScoreBar = ({ score }) => (
  <div className="ai-score-bar-wrap">
    <div className="ai-score-bar-fill" style={{ width: `${score}%` }} />
    <span className="ai-score-label">{score}%</span>
  </div>
);

// ── Donor panel ───────────────────────────────────────────────────────────────

const DonorInsights = ({ listing }) => {
  const defaultListing = { food: 'mixed food', quantity: 5, expiryMins: 45, lat: 40.7128, lng: -74.006 };
  const activeListing = listing || defaultListing;

  const suggestions = useMemo(
    () => getDonorSuggestions(activeListing, []),
    [activeListing]
  );

  const impact = useMemo(
    () => estimateFoodImpact(activeListing.quantity),
    [activeListing.quantity]
  );

  const urgency = predictPickupUrgency(activeListing.expiryMins);

  const matches = useMemo(
    () => matchFoodToReceivers(activeListing, SAMPLE_RECEIVERS),
    [activeListing]
  );

  return (
    <div className="ai-panel">
      <h3 className="ai-panel-title">🤖 AI Insights — Donor</h3>

      {/* Urgency */}
      <div className="ai-card">
        <h4>Pickup Urgency</h4>
        <UrgencyBadge label={urgency.label} color={urgency.color} />
        <ScoreBar score={urgency.score} />
      </div>

      {/* Impact */}
      <div className="ai-card">
        <h4>Estimated Impact</h4>
        <div className="ai-impact-grid">
          <div className="ai-impact-item">
            <span className="ai-impact-value">{impact.meals}</span>
            <span className="ai-impact-label">Meals</span>
          </div>
          <div className="ai-impact-item">
            <span className="ai-impact-value">{impact.co2Kg} kg</span>
            <span className="ai-impact-label">CO₂ Saved</span>
          </div>
          <div className="ai-impact-item">
            <span className="ai-impact-value">{impact.waterLitres} L</span>
            <span className="ai-impact-label">Water Saved</span>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="ai-card">
        <h4>Smart Suggestions</h4>
        <ul className="ai-suggestions">
          {suggestions.map((s, i) => (
            <li key={i} className={`ai-suggestion ai-suggestion-${s.type}`}>
              {s.message}
            </li>
          ))}
        </ul>
      </div>

      {/* Top matching receivers */}
      {matches.length > 0 && (
        <div className="ai-card">
          <h4>Best Matched Receivers</h4>
          <ul className="ai-match-list">
            {matches.slice(0, 3).map((r) => (
              <li key={r.id} className="ai-match-item">
                <div className="ai-match-info">
                  <strong>{r.name}</strong>
                  <span>{r.distanceKm} km away</span>
                </div>
                <ScoreBar score={r.matchScore} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ── NGO panel ─────────────────────────────────────────────────────────────────

const NGOInsights = ({ donors }) => {
  const activeDonors = donors || [
    { id: 1, name: 'Pizza Palace',  food: 'Pizzas',       quantity: 10, expiryMins: 25, lat: 40.7128, lng: -74.006 },
    { id: 2, name: 'Happy Kitchen', food: 'Rice & Curry', quantity: 5,  expiryMins: 40, lat: 40.7150, lng: -74.006 },
  ];

  return (
    <div className="ai-panel">
      <h3 className="ai-panel-title">🤖 AI Insights — NGO</h3>

      <div className="ai-card">
        <h4>Food Listings — Urgency Ranking</h4>
        <ul className="ai-match-list">
          {activeDonors
            .map((d) => ({ ...d, urgency: predictPickupUrgency(d.expiryMins || 60) }))
            .sort((a, b) => b.urgency.score - a.urgency.score)
            .map((d) => (
              <li key={d.id} className="ai-match-item">
                <div className="ai-match-info">
                  <strong>{d.name}</strong>
                  <span>{d.food}</span>
                </div>
                <UrgencyBadge label={d.urgency.label} color={d.urgency.color} />
              </li>
            ))}
        </ul>
      </div>

      <div className="ai-card ai-tip">
        <p>💡 AI Tip: Accept listings with <strong>Critical</strong> or <strong>High</strong> urgency first — food is most at risk of expiring.</p>
      </div>
    </div>
  );
};

// ── Volunteer panel ───────────────────────────────────────────────────────────

const VolunteerInsights = ({ requests }) => {
  const volunteerLocation = useMemo(() => ({ lat: 40.713, lng: -74.005 }), []);

  const ranked = useMemo(
    () => rankVolunteerRequests(requests || SAMPLE_REQUESTS, volunteerLocation),
    [requests, volunteerLocation]
  );

  return (
    <div className="ai-panel">
      <h3 className="ai-panel-title">🤖 AI Insights — Volunteer</h3>

      <div className="ai-card">
        <h4>Requests — AI Priority Ranking</h4>
        <ul className="ai-match-list">
          {ranked.map((req) => (
            <li key={req.id} className="ai-match-item">
              <div className="ai-match-info">
                <strong>{req.title}</strong>
                <span>
                  {req.distanceKm} km · ⭐ +{req.volunteerHours} hrs
                </span>
              </div>
              <div className="ai-match-badges">
                <UrgencyBadge label={req.urgency.label} color={req.urgency.color} />
                <ScoreBar score={req.priorityScore} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="ai-card ai-tip">
        <p>💡 AI Tip: Start with the highest-priority request — it balances urgency, proximity, and impact.</p>
      </div>
    </div>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * AIInsights — renders the appropriate AI panel based on the active user role.
 *
 * @param {{ userType: 'donor'|'ngo'|'volunteer', listing?: Object, donors?: Array, requests?: Array }} props
 */
const AIInsights = ({ userType, listing, donors, requests }) => {
  if (userType === 'donor')    return <DonorInsights listing={listing} />;
  if (userType === 'ngo')      return <NGOInsights donors={donors} />;
  if (userType === 'volunteer') return <VolunteerInsights requests={requests} />;
  return null;
};

export default AIInsights;
