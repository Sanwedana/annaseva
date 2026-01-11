import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Check if email already exists before signup
export const checkEmailExists = async (email) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

// Sign up with email and password - with duplicate prevention
export const signUpUser = async (email, password, userData) => {
  try {
    // Check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      throw new Error("This email is already registered. Please sign in or use a different email.");
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      name: userData.name || "",
      phone: userData.phone || "",
      city: userData.city || "",
      address: userData.address || "",
      dietary: userData.dietary || [],
      favoriteRestaurants: [],
      createdAt: new Date().toISOString(),
      role: userData.role || "user",
      isActive: true
    });

    console.log("✓ User created successfully:", email);
    return { success: true, user };
  } catch (error) {
    console.error("Sign up error:", error.code, error.message);
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
};

// Sign in with email and password
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};

    console.log("✓ User signed in successfully:", email);
    return { 
      success: true, 
      user,
      userData 
    };
  } catch (error) {
    console.error("Sign in error:", error.code, error.message);
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("✓ User signed out successfully");
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: error.message };
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        callback({ user, userData });
      } catch (error) {
        console.error("Error fetching user data:", error);
        callback({ user, userData: null });
      }
    } else {
      callback(null);
    }
  });
};

// Get user-friendly error messages
export const getErrorMessage = (errorCode) => {
  const errorMessages = {
    "auth/email-already-in-use": "यह ईमेल पहले से पंजीकृत है। कृपया साइन इन करें या दूसरा ईमेल उपयोग करें।",
    "auth/user-not-found": "यह ईमेल पंजीकृत नहीं है। कृपया एक खाता बनाएं।",
    "auth/wrong-password": "गलत पासवर्ड। कृपया दोबारा कोशिश करें।",
    "auth/weak-password": "पासवर्ड कम से कम 6 अक्षर का होना चाहिए।",
    "auth/invalid-email": "अमान्य ईमेल पता।",
    "auth/operation-not-allowed": "यह ऑपरेशन अनुमत नहीं है।",
    "auth/too-many-requests": "बहुत सारे प्रयास। कृपया बाद में कोशिश करें।",
    "permission-denied": "आपको इस संसाधन तक पहुंचने की अनुमति नहीं है।"
  };
  
  return errorMessages[errorCode] || "एक त्रुटि हुई। कृपया दोबारा कोशिश करें।";
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, "users", userId), profileData, { merge: true });
    console.log("✓ User profile updated");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }
};

// Delete user account
export const deleteUserAccount = async (userId) => {
  try {
    // Delete from Firestore
    await setDoc(doc(db, "users", userId), { isActive: false }, { merge: true });
    
    // Delete from Auth
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.uid === userId) {
      await currentUser.delete();
    }
    
    console.log("✓ User account deleted");
    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, error: error.message };
  }
};

export default {
  signUpUser,
  signInUser,
  signOutUser,
  onAuthStateChange,
  checkEmailExists,
  getErrorMessage,
  updateUserProfile,
  deleteUserAccount
};
