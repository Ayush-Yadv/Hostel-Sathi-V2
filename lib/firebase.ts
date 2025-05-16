// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsqnXy6IhqbC3BN64M04FBCAd9T2trDnw",
  authDomain: "hostel-sathi-alpha-version.firebaseapp.com",
  projectId: "hostel-sathi-alpha-version",
  storageBucket: "hostel-sathi-alpha-version.firebasestorage.app",
  messagingSenderId: "360051431400",
  appId: "1:360051431400:web:f466fd6683e7b82d46765d",
  measurementId: "G-B18CZ5818W",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
