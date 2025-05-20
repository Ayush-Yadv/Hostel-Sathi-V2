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
  ownerName: string;
  contactNumber: string;
  email: string;
  propertyName: string;
  propertyType: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  nearbyColleges: string[];
  description: string;
  monthlyRent: string;
  amenities: {
    wifi: boolean;
    mess: boolean;
    security: boolean;
    powerBackup: boolean;
    tvLounge: boolean;
    gym: boolean;
    studyRoom: boolean;
    washingMachine: boolean;
    acRooms: boolean;
    attachedBathroom: boolean;
  };
  roomTypes: {
    single: boolean;
    double: boolean;
    triple: boolean;
    fourSharing: boolean;
  };
  amenitiesList: string[];
  roomTypesList: string[];
}

export const submitProperty = async (propertyData: PropertyData) => {
  try {
    // Add the property to the pendingProperties collection
    const docRef = await addDoc(collection(db, "pendingProperties"), {
      ...propertyData,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { 
      success: true, 
      propertyId: docRef.id, 
      error: null
    }
  } catch (error) {
    console.error("Error submitting property:", error)
    return { 
      success: false, 
      propertyId: null, 
      error: error as Error
    }
  }
}

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
