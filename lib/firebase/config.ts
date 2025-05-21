import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDsqnXy6IhqbC3BN64M04FBCAd9T2trDnw",
  authDomain: "hostel-sathi-alpha-version.firebaseapp.com",
  projectId: "hostel-sathi-alpha-version",
  storageBucket: "hostel-sathi-alpha-version.appspot.com",
  messagingSenderId: "360051431400",
  appId: "1:360051431400:web:f466fd6683e7b82d46765d",
  measurementId: "G-B18CZ5818W"
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const auth = getAuth(app)

// Configure auth for better compatibility with reCAPTCHA
auth.useDeviceLanguage(); // Use the device's language for SMS

// Log current domain for debugging
if (typeof window !== 'undefined') {
  const currentDomain = window.location.hostname;
  console.log(`Current domain: ${currentDomain}`);
  
  // Check if current domain matches auth domain
  if (firebaseConfig.authDomain && !firebaseConfig.authDomain.includes(currentDomain) && 
      currentDomain !== 'localhost' && currentDomain !== '127.0.0.1') {
    console.warn(`Warning: Current domain (${currentDomain}) may not be authorized in Firebase. ` +
                `Auth domain is set to: ${firebaseConfig.authDomain}`);
  }
}

export { app, db, auth } 