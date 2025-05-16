import { db } from "./firebase"
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore"

// Get saved hostels for a user
export const getSavedHostels = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()
      return { savedHostels: userData.savedHostels || [], error: null }
    } else {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        savedHostels: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return { savedHostels: [], error: null }
    }
  } catch (error) {
    console.error("Error getting saved hostels:", error)
    return { savedHostels: [], error }
  }
}

// Save a hostel for a user
export const saveHostel = async (userId: string, hostelId: number) => {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      // Update existing user document
      await updateDoc(userRef, {
        savedHostels: arrayUnion(hostelId),
        updatedAt: serverTimestamp(),
      })
    } else {
      // Create new user document
      await setDoc(userRef, {
        savedHostels: [hostelId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error saving hostel:", error)
    return { success: false, error }
  }
}

// Remove a hostel from a user's saved hostels
export const removeHostel = async (userId: string, hostelId: number) => {
  try {
    const userRef = doc(db, "users", userId)

    await updateDoc(userRef, {
      savedHostels: arrayRemove(hostelId),
      updatedAt: serverTimestamp(),
    })

    return { success: true, error: null }
  } catch (error) {
    console.error("Error removing hostel:", error)
    return { success: false, error }
  }
}
