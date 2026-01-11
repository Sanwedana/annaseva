// Dummy Indian Users Data - FoodConnect ke liye!
export const dummyUsers = [
  {
    id: "user_001",
    name: "राज कुमार",
    email: "raj.kumar@email.com",
    phone: "+91-9876543210",
    city: "Mumbai",
    address: "Bandra, Mumbai",
    dietary: ["vegetarian", "spicy"],
    favoriteRestaurants: ["rest_001", "rest_002"],
    createdAt: new Date("2024-01-15")
  },
  {
    id: "user_002",
    name: "प्रिया शर्मा",
    email: "priya.sharma@email.com",
    phone: "+91-9876543211",
    city: "Delhi",
    address: "Connaught Place, Delhi",
    dietary: ["vegan", "healthy"],
    favoriteRestaurants: ["rest_003"],
    createdAt: new Date("2024-02-10")
  },
  {
    id: "user_003",
    name: "अमित पटेल",
    email: "amit.patel@email.com",
    phone: "+91-9876543212",
    city: "Bangalore",
    address: "Koramangala, Bangalore",
    dietary: ["non-vegetarian", "spicy"],
    favoriteRestaurants: ["rest_001", "rest_004"],
    createdAt: new Date("2024-01-20")
  }
];

export const dummyRestaurants = [
  {
    id: "rest_001",
    name: "राज का ढाबा",
    city: "Mumbai",
    cuisine: "North Indian",
    rating: 4.5,
    deliveryTime: "30-40 mins",
    minOrder: 200,
    address: "Bandra West, Mumbai",
    phone: "+91-2267890123",
    specialties: ["Butter Chicken", "Biryani", "Naan"]
  },
  {
    id: "rest_002",
    name: "दक्षिण स्वाद",
    city: "Mumbai",
    cuisine: "South Indian",
    rating: 4.3,
    deliveryTime: "25-35 mins",
    minOrder: 150,
    address: "Andheri, Mumbai",
    phone: "+91-2265432109",
    specialties: ["Dosa", "Idli", "Sambar"]
  },
  {
    id: "rest_003",
    name: "हरी प्रदेश खाना",
    city: "Delhi",
    cuisine: "Vegetarian",
    rating: 4.7,
    deliveryTime: "20-30 mins",
    minOrder: 180,
    address: "CP, New Delhi",
    phone: "+91-1123456789",
    specialties: ["Chole Bhature", "Paneer", "Rajma Rice"]
  },
  {
    id: "rest_004",
    name: "मैसूर रसोई",
    city: "Bangalore",
    cuisine: "Kannada",
    rating: 4.4,
    deliveryTime: "35-45 mins",
    minOrder: 250,
    address: "Koramangala, Bangalore",
    phone: "+91-8012345678",
    specialties: ["Ghassi", "Bisi Bele Bath", "Ragi Mudde"]
  }
];

export const dummyFoodItems = [
  {
    id: "food_001",
    name: "मक्खन मुर्ग",
    restaurantId: "rest_001",
    price: 399,
    description: "नरम मुर्ग टमाटर की ग्रेवी में",
    category: "Main Course",
    veg: false,
    spicy: true,
    prepTime: "20 mins"
  },
  {
    id: "food_002",
    name: "बिरयानी",
    restaurantId: "rest_001",
    price: 349,
    description: "बासमती चावल और मसालों के साथ",
    category: "Rice",
    veg: false,
    spicy: true,
    prepTime: "25 mins"
  },
  {
    id: "food_003",
    name: "मसाला डोसा",
    restaurantId: "rest_002",
    price: 149,
    description: "कुरकुरे डोसा आलू मसाले के साथ",
    category: "Breakfast",
    veg: true,
    spicy: true,
    prepTime: "15 mins"
  },
  {
    id: "food_004",
    name: "छोले भटूरे",
    restaurantId: "rest_003",
    price: 179,
    description: "तले हुए भटूरे दही और छोलों के साथ",
    category: "Main Course",
    veg: true,
    spicy: false,
    prepTime: "18 mins"
  },
  {
    id: "food_005",
    name: "पनीर टिक्का",
    restaurantId: "rest_003",
    price: 279,
    description: "मसालेदार मैरिनेटेड पनीर",
    category: "Appetizer",
    veg: true,
    spicy: true,
    prepTime: "12 mins"
  }
];

export const dummyOrders = [
  {
    id: "order_001",
    userId: "user_001",
    restaurantId: "rest_001",
    items: ["food_001", "food_002"],
    totalPrice: 748,
    status: "Delivered",
    orderDate: new Date("2024-03-01"),
    deliveryDate: new Date("2024-03-01")
  },
  {
    id: "order_002",
    userId: "user_002",
    restaurantId: "rest_003",
    items: ["food_004", "food_005"],
    totalPrice: 458,
    status: "Pending",
    orderDate: new Date("2024-03-05"),
    deliveryDate: null
  }
];
