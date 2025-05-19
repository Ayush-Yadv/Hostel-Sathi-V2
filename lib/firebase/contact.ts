import { db } from './config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface ContactFormError extends Error {
  code?: string
  details?: string
}

export const submitContactForm = async (formData: ContactFormData) => {
  try {
    console.log('Starting form submission with data:', formData)

    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message']
    const missingFields = requiredFields.filter(field => !formData[field as keyof ContactFormData])
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      const error = new Error(`Missing required fields: ${missingFields.join(', ')}`) as ContactFormError
      error.code = 'MISSING_FIELDS'
      error.details = missingFields.join(', ')
      throw error
    }

    console.log('Creating contact document in Firestore...')
    const contactsRef = collection(db, 'contacts')
    const docData = {
      ...formData,
      createdAt: serverTimestamp(),
      status: 'new',
      source: 'contact_form',
      metadata: {
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        formVersion: '1.0.0'
      },
      tags: [
        'website_contact',
        formData.subject.toLowerCase().includes('hostel') ? 'hostel_inquiry' : 'general_inquiry',
        formData.phone ? 'has_phone' : 'no_phone'
      ]
    }

    console.log('Document data to be stored:', docData)
    const docRef = await addDoc(contactsRef, docData)
    console.log('Document successfully created with ID:', docRef.id)

    return { 
      success: true, 
      id: docRef.id,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined
    })
    
    // Format error for client
    const formattedError = error as ContactFormError
    if (formattedError.code === 'MISSING_FIELDS') {
      throw formattedError
    }
    
    // Handle Firebase errors
    if (error instanceof Error && 'code' in error) {
      const firebaseError = error as { code: string }
      switch (firebaseError.code) {
        case 'permission-denied':
          throw new Error('You do not have permission to submit the form')
        case 'unavailable':
          throw new Error('Service is temporarily unavailable. Please try again later')
        default:
          throw new Error('An error occurred while submitting the form')
      }
    }
    
    throw new Error('An unexpected error occurred')
  }
} 