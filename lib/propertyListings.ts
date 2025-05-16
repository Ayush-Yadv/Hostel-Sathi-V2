import { db, storage } from "./firebase"
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
  serverTimestamp,
  getDoc,
  orderBy,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { optimizeImage } from "./imageOptimization"

// Collection references
const pendingPropertiesCollection = collection(db, "pendingProperties")
const approvedPropertiesCollection = collection(db, "properties")


export interface PropertyData {
  ownerId?: string|null;
  // Add other property fields here based on what you expect
  [key: string]: any; // This allows for additional dynamic properties
}

export const submitProperty = async (propertyData: PropertyData, images: File[]) => {
  try {
    // Upload and optimize images
    const imageUrls: string[] = [];

    for (const image of images) {
      // Create a reference to the storage location
      const storageRef = ref(
        storage,
        `property-images/${propertyData.ownerId || "anonymous"}/${Date.now()}_${image.name}`,
      )

      // Optimize the image before uploading
      const optimizedImage = await optimizeImage(image, 1200, 800)

      // Upload the optimized image
      await uploadBytes(storageRef, optimizedImage)

      // Get the download URL
      const imageUrl = await getDownloadURL(storageRef)
      imageUrls.push(imageUrl)
    }

    // Add the property to the pendingProperties collection
    const docRef = await addDoc(collection(db, "pendingProperties"), {
      ...propertyData,
      images: imageUrls,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { success: true, propertyId: docRef.id, error: null }
  } catch (error) {
    console.error("Error submitting property:", error)
    return { success: false, propertyId: null, error: error as Error }
  }
}
// // Submit a new property listing (goes to pending)
// export const submitProperty = async (propertyData, images) => {
//   try {
//     // Upload and optimize images
//     const imageUrls = []

//     for (const image of images) {
//       // Create a reference to the storage location
//       const storageRef = ref(
//         storage,
//         `property-images/${propertyData.ownerId || "anonymous"}/${Date.now()}_${image.name}`,
//       )

//       // Optimize the image before uploading
//       const optimizedImage = await optimizeImage(image, 1200, 800)

//       // Upload the optimized image
//       await uploadBytes(storageRef, optimizedImage)

//       // Get the download URL
//       const imageUrl = await getDownloadURL(storageRef)
//       imageUrls.push(imageUrl)
//     }

//     // Add the property to the pendingProperties collection
//     const docRef = await addDoc(collection(db, "pendingProperties"), {
//       ...propertyData,
//       images: imageUrls,
//       status: "pending",
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     })

//     return { success: true, propertyId: docRef.id, error: null }
//   } catch (error) {
//     console.error("Error submitting property:", error)
//     return { success: false, propertyId: null, error }
//   }
// }

// Get all pending properties (for admin)
export const getPendingProperties = async () => {
  try {
    const q = query(pendingPropertiesCollection, orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    //const properties = []
    const properties: any[] = []

    querySnapshot.forEach((doc) => {
      properties.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return { properties, error: null }
  } catch (error) {
    console.error("Error getting pending properties:", error)
    return { properties: [], error }
  }
}

// Approve a property (moves from pending to approved)
export const approveProperty = async (propertyId: string) => {
  try {
    // Get the pending property
    const pendingPropertyRef = doc(pendingPropertiesCollection, propertyId)
    const pendingPropertySnap = await getDoc(pendingPropertyRef)

    if (!pendingPropertySnap.exists()) {
      throw new Error("Property not found")
    }

    const propertyData = pendingPropertySnap.data()

    // Add to approved properties
    const approvedPropertyRef = doc(approvedPropertiesCollection)
    await setDoc(approvedPropertyRef, {
      ...propertyData,
      status: "approved",
      approvedAt: serverTimestamp(),
    })

    // Update status in pending
    await updateDoc(pendingPropertyRef, {
      status: "approved",
    })

    return { success: true, error: null }
  } catch (error) {
    console.error("Error approving property:", error)
    return { success: false, error }
  }
}

// Reject a property
export const rejectProperty = async (propertyId: string) => {
  try {
    const pendingPropertyRef = doc(pendingPropertiesCollection, propertyId)

    await updateDoc(pendingPropertyRef, {
      status: "rejected",
      rejectedAt: serverTimestamp(),
    })

    return { success: true, error: null }
  } catch (error) {
    console.error("Error rejecting property:", error)
    return { success: false, error }
  }
}

// Get all approved properties
interface PropertyFilters {
  gender?: string
  propertyType?: string
  nearbyColleges?: string
}
export const getApprovedProperties = async (filters : PropertyFilters= {}) => {
  try {
    let q = query(approvedPropertiesCollection, where("status", "==", "approved"))

    // Apply filters if provided
    if (filters.gender) {
      q = query(q, where("gender", "==", filters.gender))
    }

    if (filters.propertyType) {
      q = query(q, where("propertyType", "==", filters.propertyType))
    }

    if (filters.nearbyColleges) {
      q = query(q, where("nearbyColleges", "array-contains", filters.nearbyColleges))
    }

    const querySnapshot = await getDocs(q)
    //const properties = []
    const properties: any[] = []

    querySnapshot.forEach((doc) => {
      properties.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return { properties, error: null }
  } catch (error) {
    console.error("Error getting approved properties:", error)
    return { properties: [], error }
  }
}

// Get a specific property by ID
export const getPropertyById = async (propertyId: string) => {
  try {
    const propertyRef = doc(approvedPropertiesCollection, propertyId)
    const propertySnap = await getDoc(propertyRef)

    if (propertySnap.exists()) {
      return { property: { id: propertyId, ...propertySnap.data() }, error: null }
    } else {
      return { property: null, error: "Property not found" }
    }
  } catch (error) {
    console.error("Error getting property:", error)
    return { property: null, error }
  }
}
