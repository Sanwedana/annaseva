import { 
  dummyUsers, 
  dummyRestaurants, 
  dummyFoodItems, 
  dummyOrders 
} from "../data/dummyIndianUsers";

// Cache constants
const CACHE_KEYS = {
  USERS: "foodconnect_users_cache",
  RESTAURANTS: "foodconnect_restaurants_cache",
  FOOD_ITEMS: "foodconnect_food_items_cache",
  ORDERS: "foodconnect_orders_cache",
  CURRENT_USER: "foodconnect_current_user"
};

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Cache utility functions
const saveToCache = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.log("Cache save error:", error);
  }
};

const getFromCache = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (error) {
    console.log("Cache retrieval error:", error);
    return null;
  }
};

const clearCache = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.log("Cache clear error:", error);
  }
};

// Initialize cache on first load
const initializeCache = () => {
  if (!getFromCache(CACHE_KEYS.USERS)) {
    saveToCache(CACHE_KEYS.USERS, dummyUsers);
  }
  if (!getFromCache(CACHE_KEYS.RESTAURANTS)) {
    saveToCache(CACHE_KEYS.RESTAURANTS, dummyRestaurants);
  }
  if (!getFromCache(CACHE_KEYS.FOOD_ITEMS)) {
    saveToCache(CACHE_KEYS.FOOD_ITEMS, dummyFoodItems);
  }
  if (!getFromCache(CACHE_KEYS.ORDERS)) {
    saveToCache(CACHE_KEYS.ORDERS, dummyOrders);
  }
};

// ===== USERS FUNCTIONS =====
export const getUserById = (userId) => {
  const users = getFromCache(CACHE_KEYS.USERS) || dummyUsers;
  return users.find(user => user.id === userId);
};

export const getAllUsers = () => {
  return getFromCache(CACHE_KEYS.USERS) || dummyUsers;
};

export const getUsersByCity = (city) => {
  const users = getFromCache(CACHE_KEYS.USERS) || dummyUsers;
  return users.filter(user => user.city === city);
};

export const setCurrentUser = (user) => {
  saveToCache(CACHE_KEYS.CURRENT_USER, user);
};

export const getCurrentUser = () => {
  return getFromCache(CACHE_KEYS.CURRENT_USER);
};

export const addUser = (newUser) => {
  const users = getFromCache(CACHE_KEYS.USERS) || dummyUsers;
  users.push(newUser);
  saveToCache(CACHE_KEYS.USERS, users);
  return newUser;
};

export const updateUser = (userId, updatedData) => {
  const users = getFromCache(CACHE_KEYS.USERS) || dummyUsers;
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedData };
    saveToCache(CACHE_KEYS.USERS, users);
    return users[userIndex];
  }
  return null;
};

// ===== RESTAURANTS FUNCTIONS =====
export const getRestaurantById = (restaurantId) => {
  const restaurants = getFromCache(CACHE_KEYS.RESTAURANTS) || dummyRestaurants;
  return restaurants.find(rest => rest.id === restaurantId);
};

export const getAllRestaurants = () => {
  return getFromCache(CACHE_KEYS.RESTAURANTS) || dummyRestaurants;
};

export const getRestaurantsByCity = (city) => {
  const restaurants = getFromCache(CACHE_KEYS.RESTAURANTS) || dummyRestaurants;
  return restaurants.filter(rest => rest.city === city);
};

export const getRestaurantsByCuisine = (cuisine) => {
  const restaurants = getFromCache(CACHE_KEYS.RESTAURANTS) || dummyRestaurants;
  return restaurants.filter(rest => rest.cuisine === cuisine);
};

export const addRestaurant = (newRestaurant) => {
  const restaurants = getFromCache(CACHE_KEYS.RESTAURANTS) || dummyRestaurants;
  restaurants.push(newRestaurant);
  saveToCache(CACHE_KEYS.RESTAURANTS, restaurants);
  return newRestaurant;
};

// ===== FOOD ITEMS FUNCTIONS =====
export const getFoodById = (foodId) => {
  const foods = getFromCache(CACHE_KEYS.FOOD_ITEMS) || dummyFoodItems;
  return foods.find(food => food.id === foodId);
};

export const getAllFoodItems = () => {
  return getFromCache(CACHE_KEYS.FOOD_ITEMS) || dummyFoodItems;
};

export const getFoodByRestaurant = (restaurantId) => {
  const foods = getFromCache(CACHE_KEYS.FOOD_ITEMS) || dummyFoodItems;
  return foods.filter(food => food.restaurantId === restaurantId);
};

export const getFoodByCategory = (category) => {
  const foods = getFromCache(CACHE_KEYS.FOOD_ITEMS) || dummyFoodItems;
  return foods.filter(food => food.category === category);
};

export const getVegetarianFood = () => {
  const foods = getFromCache(CACHE_KEYS.FOOD_ITEMS) || dummyFoodItems;
  return foods.filter(food => food.veg === true);
};

export const getNonVegetarianFood = () => {
  const foods = getFromCache(CACHE_KEYS.FOOD_ITEMS) || dummyFoodItems;
  return foods.filter(food => food.veg === false);
};

export const addFoodItem = (newFood) => {
  const foods = getFromCache(CACHE_KEYS.FOOD_ITEMS) || dummyFoodItems;
  foods.push(newFood);
  saveToCache(CACHE_KEYS.FOOD_ITEMS, foods);
  return newFood;
};

// ===== ORDERS FUNCTIONS =====
export const getOrderById = (orderId) => {
  const orders = getFromCache(CACHE_KEYS.ORDERS) || dummyOrders;
  return orders.find(order => order.id === orderId);
};

export const getAllOrders = () => {
  return getFromCache(CACHE_KEYS.ORDERS) || dummyOrders;
};

export const getOrdersByUser = (userId) => {
  const orders = getFromCache(CACHE_KEYS.ORDERS) || dummyOrders;
  return orders.filter(order => order.userId === userId);
};

export const getOrdersByStatus = (status) => {
  const orders = getFromCache(CACHE_KEYS.ORDERS) || dummyOrders;
  return orders.filter(order => order.status === status);
};

export const addOrder = (newOrder) => {
  const orders = getFromCache(CACHE_KEYS.ORDERS) || dummyOrders;
  orders.push(newOrder);
  saveToCache(CACHE_KEYS.ORDERS, orders);
  return newOrder;
};

export const updateOrder = (orderId, updatedData) => {
  const orders = getFromCache(CACHE_KEYS.ORDERS) || dummyOrders;
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex] = { ...orders[orderIndex], ...updatedData };
    saveToCache(CACHE_KEYS.ORDERS, orders);
    return orders[orderIndex];
  }
  return null;
};

// ===== SEARCH FUNCTIONS =====
export const searchRestaurants = (query) => {
  const lowerQuery = query.toLowerCase();
  const restaurants = getFromCache(CACHE_KEYS.RESTAURANTS) || dummyRestaurants;
  return restaurants.filter(rest => 
    rest.name.toLowerCase().includes(lowerQuery) ||
    rest.cuisine.toLowerCase().includes(lowerQuery)
  );
};

export const searchFoodItems = (query) => {
  const lowerQuery = query.toLowerCase();
  const foods = getFromCache(CACHE_KEYS.FOOD_ITEMS) || dummyFoodItems;
  return foods.filter(food => 
    food.name.toLowerCase().includes(lowerQuery) ||
    food.description.toLowerCase().includes(lowerQuery)
  );
};

// ===== CACHE MANAGEMENT =====
export const clearAllCache = () => {
  Object.values(CACHE_KEYS).forEach(key => clearCache(key));
};

export const refreshCache = () => {
  clearAllCache();
  initializeCache();
};

export const getCacheStatus = () => {
  return {
    users: getFromCache(CACHE_KEYS.USERS)?.length || 0,
    restaurants: getFromCache(CACHE_KEYS.RESTAURANTS)?.length || 0,
    foods: getFromCache(CACHE_KEYS.FOOD_ITEMS)?.length || 0,
    orders: getFromCache(CACHE_KEYS.ORDERS)?.length || 0,
    lastUpdated: new Date().toLocaleString()
  };
};

// Initialize cache when service loads
initializeCache();
console.log("✓ Data Service initialized with cache! 💾");
