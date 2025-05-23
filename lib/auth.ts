import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  fetchSignInMethodsForEmail,
  type User,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

// Sign up with email and password
export const signUp = async (email: string, password: string, name?: string, phoneNumber?: string) => {
  try {
    console.log("Signing up user with email:", email);
    
    // Check if we're in development mode (localhost)
    const isDevelopment = typeof window !== 'undefined' && 
                         (window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1');
    
    // In development, we can still use test phone numbers for convenience
    const isTestPhone = isDevelopment && phoneNumber && (
      phoneNumber === "+919142531909" || 
      phoneNumber === "+919499459310" ||
      phoneNumber.includes("9142531909") ||
      phoneNumber.includes("9499459310")
    );
    
    let user;
    
    // For test phone numbers in development, we can create a user directly
    if (isDevelopment && isTestPhone) {
      console.log("Using test phone number for signup");
      
      try {
        // Try to create a real user with Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        console.log("Created real Firebase user for test phone");
      } catch (err) {
        console.warn("Could not create real Firebase user, using mock:", err);
        // If Firebase creation fails, use a mock user
        user = { 
          uid: `test-user-${Date.now()}`,
          email: email,
          phoneNumber: phoneNumber,
          displayName: name
        };
      }
    } else {
      // For real users, use Firebase Auth with Blaze plan
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user = userCredential.user;
    }

    console.log("Creating user document in Firestore for:", user.uid);
    
    try {
      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        displayName: name || null,
        phoneNumber: phoneNumber || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        savedHostels: [],
        isAdmin: false, // Default to non-admin
      });
      console.log("User document created successfully");
    } catch (firestoreError) {
      console.error("Error creating user document:", firestoreError);
      // We'll continue even if Firestore fails, as the auth user is created
    }

    return { user, error: null }
  } catch (error: any) {
    console.error("Error in signUp:", error);
    return { user: null, error }
  }
}

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Check if user document exists in Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))
    
    // If not, create a new user document
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        displayName: userCredential.user.displayName || null,
        phoneNumber: userCredential.user.phoneNumber || null,
        createdAt: new Date(),
        savedHostels: [],
        isAdmin: false, // Default to non-admin
      })
      console.log("Created new user document for email/password user")
    }
    
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    console.error("Error in signIn:", error)
    return { user: null, error }
  }
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    // Add scopes if needed
    provider.addScope('email')
    provider.addScope('profile')
    
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", user.uid))

    // If not, create a new user document
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber || null,
        photoURL: user.photoURL,
        createdAt: new Date(),
        savedHostels: [],
        isAdmin: false, // Default to non-admin
      })
      console.log("Created new user document for Google auth user")
    }

    return { user, error: null }
  } catch (error: any) {
    console.error("Error in Google sign in:", error)
    return { user: null, error }
  }
}

// Initialize reCAPTCHA verifier
export const initRecaptchaVerifier = (containerId: string) => {
  try {
    // For Firebase SDK v9+, invisible reCAPTCHA is used automatically
    // We just need to create the verifier with minimal configuration
    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {
        // This callback is triggered when reCAPTCHA is verified
        console.log("reCAPTCHA verified automatically");
      }
    });
    
    // No need to explicitly render - Firebase handles this
    // But we'll keep it for backward compatibility
    verifier.render().catch(e => console.warn("Render warning (can be ignored):", e));
    
    return { verifier, error: null }
  } catch (error: any) {
    console.error("Error initializing reCAPTCHA:", error);
    return { verifier: null, error }
  }
}

// Send OTP to phone number
export const sendOTP = async (phoneNumber: string) => {
  try {
    // Format phone number if needed
    if (!phoneNumber.startsWith("+")) {
      phoneNumber = `+91${phoneNumber}` // Assuming India country code
    }

    // Check if we're in development mode (localhost)
    const isDevelopment = typeof window !== 'undefined' && 
                         (window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1');
    
    // In development, we can still use test phone numbers for convenience
    const isTestPhone = isDevelopment && (
      phoneNumber === "+919142531909" || 
      phoneNumber === "+919499459310"
    );
    
    console.log(`Attempting to send OTP to ${phoneNumber}. Test phone: ${isTestPhone}`);

    if (!window.recaptchaVerifier) {
      console.error("reCAPTCHA verifier not found");
      return { 
        success: false, 
        error: new Error("reCAPTCHA not initialized. Please refresh the page and try again.") 
      }
    }

    const appVerifier = window.recaptchaVerifier;
    
    // For test phone numbers in development, we can simulate success
    // This is just for development convenience
    if (isDevelopment && isTestPhone) {
      console.log("Using test phone number. Simulating OTP sent.");
      // Store a mock confirmation result for the test phone
      window.confirmationResult = {
        confirm: (code: string) => {
          // Check if the code matches the test code for this phone
          const isValidCode = 
            (phoneNumber === "+919142531909" && code === "983536") || 
            (phoneNumber === "+919499459310" && code === "914253");
          
          if (isValidCode) {
            // Create a more complete mock user object that matches Firebase Auth User structure
            return Promise.resolve({ 
              user: { 
                uid: `test-user-${Date.now()}`,
                email: null,
                phoneNumber: phoneNumber,
                displayName: null,
                emailVerified: false,
                isAnonymous: false,
                metadata: {
                  creationTime: new Date().toISOString(),
                  lastSignInTime: new Date().toISOString()
                },
                providerData: [{
                  providerId: 'phone',
                  uid: phoneNumber,
                  displayName: null,
                  email: null,
                  phoneNumber: phoneNumber,
                  photoURL: null
                }],
                // Add necessary methods that might be used
                delete: () => Promise.resolve(),
                getIdToken: () => Promise.resolve("test-token"),
                toJSON: () => ({})
              } 
            });
          } else {
            return Promise.reject(new Error("Invalid verification code"));
          }
        }
      };
      return { success: true, error: null };
    }
    
    // For real phone numbers, use Firebase
    console.log("Sending OTP via Firebase...");
    
    try {
      // With Firebase SDK v9+, this will use invisible reCAPTCHA automatically
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      console.log("OTP sent successfully");
      return { success: true, error: null };
    } catch (err) {
      // Handle specific error cases
      console.error("Error in signInWithPhoneNumber:", err);
      
      // Type check the error before accessing properties
      if (err && typeof err === 'object' && 'code' in err && err.code === 'auth/captcha-check-failed') {
        console.log("Attempting to refresh reCAPTCHA and retry...");
        
        try {
          // Try to reset the reCAPTCHA if possible
          if (window.recaptchaVerifier && typeof window.recaptchaVerifier.clear === 'function') {
            window.recaptchaVerifier.clear();
          }
          
          // Re-initialize the reCAPTCHA with default container ID
          const { verifier } = initRecaptchaVerifier("recaptcha-container") as any;
          window.recaptchaVerifier = verifier;
          
          // Try again with the new verifier
          const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
          window.confirmationResult = confirmationResult;
          console.log("OTP sent successfully after retry");
          return { success: true, error: null };
        } catch (retryErr) {
          console.error("Retry also failed:", retryErr);
          throw retryErr;
        }
      }
      
      throw err;
    }
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    
    // Handle specific error cases
    if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/captcha-check-failed') {
      console.log("reCAPTCHA verification failed. Attempting to reset...");
      
      try {
        // Try to reset the reCAPTCHA
        if (window.recaptchaVerifier) {
          if (typeof window.recaptchaVerifier.clear === 'function') {
            window.recaptchaVerifier.clear();
          }
          
          // Re-initialize with minimal configuration
          // Use "recaptcha-container" as the default container ID
          const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible"
          });
          
          window.recaptchaVerifier = verifier;
        }
        
        return { 
          success: false, 
          error: new Error("Verification failed. Please try again.") 
        };
      } catch (resetError) {
        console.error("Failed to reset reCAPTCHA:", resetError);
        return { 
          success: false, 
          error: new Error("Failed to reset verification. Please refresh the page and try again.") 
        };
      }
    }
    
    // For network errors, provide a more user-friendly message
    if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/network-request-failed') {
      return { 
        success: false, 
        error: new Error("Network error. Please check your internet connection and try again.") 
      };
    }
    
    return { success: false, error };
  }
}

// Verify OTP
export const verifyOTP = async (otp: string) => {
  try {
    console.log("Verifying OTP:", otp);
    
    if (!window.confirmationResult) {
      console.error("No confirmation result found");
      throw new Error("No verification session found. Please request a new code.")
    }

    console.log("Confirming OTP...");
    const result = await window.confirmationResult.confirm(otp);
    console.log("OTP verified successfully:", result);
    
    // Check if user document exists in Firestore
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    
    // If not, create a new user document
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", result.user.uid), {
        phoneNumber: result.user.phoneNumber,
        email: result.user.email || null,
        displayName: result.user.displayName || null,
        createdAt: new Date(),
        savedHostels: [],
        isAdmin: false, // Default to non-admin
      });
      console.log("Created new user document for phone auth user");
    }
    
    // result is UserCredential with a 'user' property
    return { success: true, user: result.user, error: null }
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return { success: false, error }
  }
}

// Check if email exists in Firebase Auth
export const checkEmailExists = async (email: string) => {
  try {
    // Firebase doesn't provide a direct method to check if an email exists
    // We'll use the fetchSignInMethodsForEmail method which returns available sign-in methods for an email
    const methods = await fetchSignInMethodsForEmail(auth, email)
    return methods.length > 0
  } catch (error: any) {
    console.error("Error checking email existence:", error)
    return false
  }
}

// Reset password
export const resetPassword = async (email: string) => {
  try {
    // First check if the email exists
    const emailExists = await checkEmailExists(email)
    
    if (!emailExists) {
      console.log("No account found with email:", email);
      return { 
        success: false, 
        error: new Error("No account found with this email. Please sign up first."),
        notFound: true 
      }
    }
    
    console.log("Email exists, sending password reset email to:", email);
    
    // If email exists, send password reset email with actionCodeSettings
    const actionCodeSettings = {
      // URL you want to redirect back to after password reset
      url: window.location.origin + "/auth/login",
      // This must be true for password reset emails
      handleCodeInApp: false
    };
    
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    
    console.log("Password reset email sent successfully");
    return { success: true, error: null }
  } catch (error: any) {
    console.error("Error in resetPassword:", error);
    return { success: false, error }
  }
}

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error }
  }
}

// Listen to auth state changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser
}

// Check if user is logged in
export const isUserLoggedIn = () => {
  return auth.currentUser !== null
}

// Check if user is admin
export const checkIsAdmin = async (userId: string) => {
  try {
    // First check if user is in the hardcoded admin list
    const currentUser = auth.currentUser;
    
    // List of hardcoded admin credentials
    const adminCredentials = [
      { email: "admin1@hostelsathi.com", password: "Admin@123" },
      { email: "admin2@hostelsathi.com", password: "Admin@123" },
      { email: "admin3@hostelsathi.com", password: "Admin@123" },
      { email: "admin4@hostelsathi.com", password: "Admin@123" },
      { email: "admin5@hostelsathi.com", password: "Admin@123" }
    ];
    
    // If the current user's email is in the admin list, they are an admin
    if (currentUser && currentUser.email) {
      const isAdmin = adminCredentials.some(admin => admin.email === currentUser.email);
      return isAdmin;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

// Make user an admin (this would typically be done manually or by another admin)
export const makeUserAdmin = async (userId: string) => {
  try {
    await setDoc(doc(db, "users", userId), { isAdmin: true }, { merge: true })
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error }
  }
}
