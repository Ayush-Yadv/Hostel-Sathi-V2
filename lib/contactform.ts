import { db } from "./firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

// Interface for contact form data
export interface ContactData {
  name: string
  phone: string
  college: string
  message: string
  createdAt?: any
}

// Save contact form data to Firestore
export const saveContactForm = async (contactData: Omit<ContactData, 'createdAt'>): Promise<{
  success: boolean;
  contactId: string | null;
  error: string | any | null;
  originalError?: any;
}> => {
  try {
    // Add contact form data to contacts collection
    const contactsRef = collection(db, "contacts");
    const docRef = await addDoc(contactsRef, {
      ...contactData,
      createdAt: serverTimestamp(),
    });
    
    console.log("Contact form data saved:", docRef.id);
    
    return { 
      success: true, 
      contactId: docRef.id, 
      error: null 
    };
  } catch (error: any) {
    console.error("Error saving contact form data:", error);
    
    // Provide a more user-friendly error message
    let errorMessage = "Failed to submit contact form.";
    
    if (error.code === "permission-denied") {
      errorMessage = "You don't have permission to submit this form. Please try again later.";
    } else if (error.code === "unavailable") {
      errorMessage = "Service is temporarily unavailable. Please try again later.";
    }
    
    return { 
      success: false, 
      contactId: null, 
      error: errorMessage,
      originalError: error
    };
  }
}