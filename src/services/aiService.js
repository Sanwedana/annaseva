// AI Food Matching Service for AnnaSeva
// Runs entirely client-side using scoring algorithms

// ── Urgency scoring ──────────────────────────────────────────────────────────

/**
 * Returns an urgency label and score (0-100) for a food listing based on the
 * minutes remaining before expiry.
 * @param {number} expiryMinutes - minutes until the food expires
 * @returns {{ label: string, score: number, color: string }}
 */
export const predictPickupUrgency = (expiryMinutes) => {
  if (expiryMinutes <= 15) {
    return { label: 'Critical', score: 100, color: '#e53e3e' };
  }
  if (expiryMinutes <= 30) {
    return { label: 'High', score: 80, color: '#dd6b20' };
  }
  if (expiryMinutes <= 60) {
    return { label: 'Medium', score: 55, color: '#d69e2e' };
  }
  return { label: 'Low', score: 30, color: '#38a169' };
};

// ── Haversine distance helper ─────────────────────────────────────────────────

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Food-type compatibility ───────────────────────────────────────────────────

const FOOD_KEYWORDS = {
  veg: ['vegetarian', 'veg', 'paneer', 'dal', 'rice', 'sabzi', 'roti', 'idli', 'dosa', 'salad', 'fruit'],
  nonveg: ['chicken', 'mutton', 'fish', 'egg', 'meat', 'biryani', 'kebab'],
};

const detectFoodType = (foodDescription = '') => {
  const lower = foodDescription.toLowerCase();
  if (FOOD_KEYWORDS.nonveg.some((k) => lower.includes(k))) return 'nonveg';
  if (FOOD_KEYWORDS.veg.some((k) => lower.includes(k))) return 'veg';
  return 'unknown';
};

// ── Receiver matching ─────────────────────────────────────────────────────────

/**
 * Ranks receivers (NGOs/volunteers) against a food listing.
 *
 * Scoring breakdown (max 100):
 *   - Proximity   : 40 pts  (inverse distance, capped at 10 km radius)
 *   - Urgency     : 30 pts  (higher urgency → higher priority for nearby receivers)
 *   - Diet match  : 20 pts  (veg listing → veg-preferred receiver scores higher)
 *   - Capacity    : 10 pts  (receiver capacity vs listing quantity)
 *
 * @param {Object} foodListing
 * @param {string} foodListing.food       - food description
 * @param {number} foodListing.quantity   - kg or units available
 * @param {number} foodListing.expiryMins - minutes until expiry
 * @param {number} foodListing.lat
 * @param {number} foodListing.lng
 *
 * @param {Array<Object>} receivers       - list of NGO / volunteer profiles
 * @param {string}  receivers[].id
 * @param {string}  receivers[].name
 * @param {number}  receivers[].lat
 * @param {number}  receivers[].lng
 * @param {string}  [receivers[].dietary] - 'veg' | 'nonveg' | 'any'
 * @param {number}  [receivers[].capacity]- max units they can handle
 *
 * @returns {Array<Object>} receivers sorted by matchScore descending, with
 *                          distanceKm, urgency, and matchScore appended
 */
export const matchFoodToReceivers = (foodListing, receivers) => {
  const urgency = predictPickupUrgency(foodListing.expiryMins);
  const foodType = detectFoodType(foodListing.food);

  return receivers
    .map((receiver) => {
      const distanceKm = haversineKm(
        foodListing.lat,
        foodListing.lng,
        receiver.lat,
        receiver.lng
      );

      // ── Proximity score (40 pts) ──
      const proximityScore = distanceKm > 10 ? 0 : Math.round(40 * (1 - distanceKm / 10));

      // ── Urgency score (30 pts) — closer receivers get the full urgency bonus ──
      const urgencyScore = distanceKm <= 5 ? Math.round((urgency.score / 100) * 30) : Math.round((urgency.score / 100) * 15);

      // ── Diet match score (20 pts) ──
      let dietScore = 10; // neutral
      if (receiver.dietary === 'veg' && foodType === 'veg') dietScore = 20;
      if (receiver.dietary === 'veg' && foodType === 'nonveg') dietScore = 0;
      if (receiver.dietary === 'nonveg' && foodType === 'nonveg') dietScore = 20;
      if (receiver.dietary === 'any') dietScore = 15;

      // ── Capacity score (10 pts) ──
      const capacity = receiver.capacity || 50;
      const capacityScore =
        foodListing.quantity <= capacity
          ? 10
          : Math.round(10 * (capacity / foodListing.quantity));

      const matchScore = proximityScore + urgencyScore + dietScore + capacityScore;

      return {
        ...receiver,
        distanceKm: Math.round(distanceKm * 10) / 10,
        urgency,
        matchScore: Math.min(matchScore, 100),
      };
    })
    .filter((r) => r.distanceKm <= 10)
    .sort((a, b) => b.matchScore - a.matchScore);
};

// ── Volunteer request ranking ─────────────────────────────────────────────────

/**
 * Ranks open pickup requests for a volunteer.
 *
 * Score = urgencyWeight (40) + distanceWeight (40) + impactWeight (20)
 *
 * @param {Array<Object>} requests
 * @param {{ lat: number, lng: number }} volunteerLocation
 * @returns {Array<Object>} requests sorted by priorityScore descending
 */
export const rankVolunteerRequests = (requests, volunteerLocation) => {
  return requests
    .map((req) => {
      const distanceKm = haversineKm(
        volunteerLocation.lat,
        volunteerLocation.lng,
        req.lat,
        req.lng
      );
      const urgency = predictPickupUrgency(req.expiryMins || 60);
      const distanceScore = distanceKm > 10 ? 0 : Math.round(40 * (1 - distanceKm / 10));
      const urgencyScore = Math.round((urgency.score / 100) * 40);
      const impactScore = Math.min(Math.round((req.quantity || 1) / 5) * 4, 20);
      return {
        ...req,
        distanceKm: Math.round(distanceKm * 10) / 10,
        urgency,
        priorityScore: Math.min(distanceScore + urgencyScore + impactScore, 100),
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
};

// ── Impact estimation ─────────────────────────────────────────────────────────

const KG_PER_MEAL = 0.4;        // average kg of food per meal
const CO2_PER_KG_FOOD = 2.5;    // kg CO2 saved per kg food rescued
const WATER_PER_KG_FOOD = 1000; // litres of water embedded per kg food

/**
 * Estimates the positive impact of rescuing a given quantity of food.
 * @param {number} quantityKg
 * @returns {{ meals: number, co2Kg: number, waterLitres: number }}
 */
export const estimateFoodImpact = (quantityKg) => {
  const meals = Math.round(quantityKg / KG_PER_MEAL);
  const co2Kg = Math.round(quantityKg * CO2_PER_KG_FOOD * 10) / 10;
  const waterLitres = Math.round(quantityKg * WATER_PER_KG_FOOD);
  return { meals, co2Kg, waterLitres };
};

// ── Donor suggestions ─────────────────────────────────────────────────────────

/**
 * Generates smart suggestions for a donor based on the food they are about to
 * list and (optionally) their past donation history.
 *
 * @param {Object} currentListing
 * @param {string} currentListing.food
 * @param {number} currentListing.quantity
 * @param {number} currentListing.expiryMins
 * @param {Array}  [history] - array of past listings (same shape)
 * @returns {Array<{ type: string, message: string }>}
 */
export const getDonorSuggestions = (currentListing, history = []) => {
  const suggestions = [];
  const urgency = predictPickupUrgency(currentListing.expiryMins);

  if (urgency.label === 'Critical') {
    suggestions.push({
      type: 'warning',
      message: '⏰ Food expires in under 15 minutes — post now for the best chance of a pickup.',
    });
  }

  if (currentListing.quantity >= 20) {
    suggestions.push({
      type: 'info',
      message: '📦 Large quantity detected. Consider splitting into 2 listings to reach more receivers.',
    });
  }

  if (history.length >= 3) {
    const avgQty = history.reduce((s, h) => s + (h.quantity || 0), 0) / history.length;
    if (currentListing.quantity < avgQty * 0.5) {
      suggestions.push({
        type: 'tip',
        message: `💡 You typically donate ~${Math.round(avgQty)} kg. Listing more helps feed more people.`,
      });
    }
  }

  const impact = estimateFoodImpact(currentListing.quantity || 1);
  suggestions.push({
    type: 'impact',
    message: `🌱 This donation could provide ~${impact.meals} meal${impact.meals !== 1 ? 's' : ''} and save ${impact.co2Kg} kg of CO₂.`,
  });

  return suggestions;
};
