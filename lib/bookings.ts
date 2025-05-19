import { db } from "./firebase"
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore"

// Interface for booking data
export interface BookingData {
  userId: string
  userName: string
  userEmail: string | null
  userPhone: string
  hostelId: number
  hostelName: string
  college: string
  message: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt?: any
}

// Save booking to Firestore
export const saveBooking = async (bookingData: Omit<BookingData, 'createdAt'>): Promise<{
  success: boolean;
  bookingId: string | null;
  error: string | any | null;
  originalError?: any;
}> => {
  try {
    // First, check if the user exists in the users collection
    // This is a workaround for Firestore permissions - we'll store the booking in the user's document
    // instead of a separate collection if we don't have write access to the bookings collection
    
    // Try to save to the user's document first (this is more likely to work with default security rules)
    try {
      // Add booking to user's bookings subcollection
      const userBookingsRef = collection(db, "users", bookingData.userId, "bookings");
      const docRef = await addDoc(userBookingsRef, {
        ...bookingData,
        createdAt: serverTimestamp(),
      });
      
      console.log("Booking saved to user's bookings subcollection:", docRef.id);
      
      return { 
        success: true, 
        bookingId: docRef.id, 
        error: null 
      };
    } catch (userBookingError) {
      console.warn("Could not save to user's bookings subcollection, trying main bookings collection:", userBookingError);
      
      // If that fails, try the main bookings collection
      const docRef = await addDoc(collection(db, "bookings"), {
        ...bookingData,
        createdAt: serverTimestamp(),
      });
      
      return { 
        success: true, 
        bookingId: docRef.id, 
        error: null 
      };
    }
  } catch (error: any) {
    console.error("Error saving booking:", error);
    
    // Provide a more user-friendly error message
    let errorMessage = "Failed to save booking.";
    
    if (error.code === "permission-denied") {
      errorMessage = "You don't have permission to book. Please contact support.";
    } else if (error.code === "unavailable") {
      errorMessage = "Service is temporarily unavailable. Please try again later.";
    } else if (error.code === "not-found") {
      errorMessage = "User account not found. Please log out and log in again.";
    }
    
    return { 
      success: false, 
      bookingId: null, 
      error: errorMessage,
      originalError: error
    };
  }
}

// Get user's bookings
export const getUserBookings = async (userId: string) => {
  try {
    // This would typically use a query to get bookings for a specific user
    // For now, we'll just return a placeholder since we're not implementing the full booking history feature
    return { 
      success: true, 
      bookings: [], 
      error: null 
    }
  } catch (error) {
    console.error("Error getting user bookings:", error)
    return { 
      success: false, 
      bookings: [], 
      error 
    }
  }
}