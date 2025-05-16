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
  type User,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

// Sign up with email and password
export const signUp = async (email: string, password: string, name?: string, phoneNumber?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: name || null,
      phoneNumber: phoneNumber || null,
      createdAt: new Date(),
      savedHostels: [],
      isAdmin: false, // Default to non-admin
    })

    return { user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", user.uid))

    // If not, create a new user document
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        savedHostels: [],
        isAdmin: false, // Default to non-admin
      })
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

// Initialize reCAPTCHA verifier
export const initRecaptchaVerifier = (containerId: string) => {
  try {
    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: "normal",
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    })
    return { verifier, error: null }
  } catch (error) {
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

    const appVerifier = window.recaptchaVerifier
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    window.confirmationResult = confirmationResult
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error }
  }
}

// Verify OTP
export const verifyOTP = async (otp: string) => {
  try {
    if (!window.confirmationResult) {
      throw new Error("No verification session found. Please request a new code.")
    }

    const result = await window.confirmationResult.confirm(otp)
    // result is UserCredential with a 'user' property
    return { success: true, user: result.user, error: null }
  } catch (error) {
    return { success: false, error }
  }
}

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error }
  }
}

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    return { success: true, error: null }
  } catch (error) {
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

// Check if user is admin
export const checkIsAdmin = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return userDoc.data()?.isAdmin === true
    }
    return false
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
