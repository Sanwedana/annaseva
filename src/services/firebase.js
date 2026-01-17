import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Arre, Firebase ka configuration le lo!
// Sab kuch environment variables se aa raha hai
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Firebase ko initialize karo, bhai!
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("✓ Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Auth aur Database export karo
export const auth = getAuth(app); // Login-logout ke liye
export const db = getFirestore(app); // Data store karne ke liye

// Development: Use Firestore emulator (optional)
if (process.env.REACT_APP_ENVIRONMENT === "development" && process.env.REACT_APP_USE_EMULATOR === "true") {
  try {
    connectFirestoreEmulator(db, "localhost", 8080);
    console.log("🔧 Using Firestore Emulator");
  } catch (error) {
    console.warn("Emulator already connected or error:", error.message);
  }
}

// Add error handler for App Check token errors
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    if (event.message?.includes("app-check-token")) {
      console.warn("⚠️ App Check token error detected");
      console.log("Solution: Disable App Check in Firebase Console");
    }
  });
}

// Custom error handler to suppress Firebase errors from console
const originalError = console.error;
console.error = function(...args) {
  const message = args[0]?.toString() || "";
  
  // Filter out Firebase errors from showing in console
  if (message.includes("Firebase") || message.includes("firebase")) {
    console.warn("🔍 Firebase error caught (hidden from user):", message);
    return;
  }
  
  originalError.apply(console, args);
};

// Export app for other modules
export default app;