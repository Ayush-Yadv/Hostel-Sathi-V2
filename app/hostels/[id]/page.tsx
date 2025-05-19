"use client"

import { Hostel } from "@/data/hostels";
import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import CommonNavbar from "@/components/common-navbar"
import CommonFooter from "@/components/common-footer"
import MobileNav from "@/components/mobile-nav"
import WhatsAppButton from "@/components/whatsapp-button"
import { onAuthChange, getCurrentUser, signOut } from "@/lib/auth"
import { saveBooking } from "@/lib/bookings"
import { saveHostel as saveHostelToFirebase, removeHostel, getSavedHostels } from "@/lib/savedHostels"
import { toast } from "sonner"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { User } from "firebase/auth"

import {
  Menu,
  Phone,
  MapPin,
  Star,
  Home,
  Heart,
  BookOpen,
  User,
  X,
  ArrowLeft,
  Wifi,
  Utensils,
  Shield,
  Power,
  Tv,
  Dumbbell,
  Library,
  Send,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  LogOut,
  Building,
  Building2,
  Users,
} from "lucide-react"
import { hostelsList } from "@/data/hostels"

export default function HostelDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const collegeParam = searchParams.get("college")
  const id = Number(params.id)

  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // State for hostel
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // State for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // State for saved hostels
  const [savedHostels, setSavedHostels] = useState<number[]>([])
  
  // State for booking form
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    college: collegeParam || "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for reviews
  interface ReviewType {
  id: number;
  name: string;
  text: string;
  rating: number;
  date: string;
}
  const [reviewText, setReviewText] = useState("")
  const [reviews, setReviews] = useState<ReviewType[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Handle window resize
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Use Firebase auth state instead of localStorage
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        setIsLoggedIn(true)
        setCurrentUser(user)
        
        // Get saved hostels from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            if (userData.savedHostels) {
              setSavedHostels(userData.savedHostels)
            }
          }
        } catch (error) {
          console.error("Error fetching saved hostels:", error)
        }
      } else {
        setIsLoggedIn(false)
        setCurrentUser(null)
        setSavedHostels([])
      }
    })

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      unsubscribe()
    }
  }, [])

  // Load hostel data
  useEffect(() => {
    const foundHostel = hostelsList.find((h) => h.id === id)
    if (foundHostel) {
      setHostel(foundHostel)
      // Initialize with mock reviews
      setReviews([
        {
          id: 1,
          name: "Rahul Kumar",
          text: "Great hostel with excellent facilities. The staff is very helpful and the location is perfect.",
          rating: 5,
          date: "2023-05-15",
        },
        {
          id: 2,
          name: "Priya Singh",
          text: "Clean rooms and good food. The WiFi could be better though.",
          rating: 4,
          date: "2023-06-22",
        },
      ])
    } else {
      router.push("/hostels?college=" + encodeURIComponent(collegeParam || ""))
    }
  }, [id, router, collegeParam])

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Handle image navigation
  const goToImage = (index: number) => {
    setActiveImageIndex(index)
  }

  const nextImage = () => {
    if (hostel) {
      setActiveImageIndex((prev) => (prev + 1) % hostel.images.length)
    }
  }

  const prevImage = () => {
    if (hostel) {
      setActiveImageIndex((prev) => (prev - 1 + hostel.images.length) % hostel.images.length)
    }
  }

  // Get amenity icon
  // type Amenity =
  // | "WiFi"
  // | "High-Speed WiFi"
  // | "Mess"
  // | "Homely Food"
  // | "Security"
  // | "Power Backup"
  // | "TV Lounge"
  // | "Tech Lounge"
  // | "Gym"
  // | "Library"
  // | "Study Room"
  // | "Study Rooms"
  // ;

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi":
      case "High-Speed WiFi":
        return <Wifi size={18} />
      case "Mess":
      case "Homely Food":
        return <Utensils size={18} />
      case "Security":
        return <Shield size={18} />
      case "Power Backup":
        return <Power size={18} />
      case "TV Lounge":
      case "Tech Lounge":
        return <Tv size={18} />
      case "Gym":
        return <Dumbbell size={18} />
      case "Library":
      case "Study Room":
      case "Study Rooms":
        return <Library size={18} />
      default:
        return null
    }
  }

  // Handle login/logout
  const handleAuthAction = async () => {
    if (isLoggedIn) {
      // Logout logic using Firebase
      try {
        await signOut()
        setIsLoggedIn(false)
        setCurrentUser(null)
        setSavedHostels([])
        toast.success("Logged out successfully")
      } catch (error) {
        console.error("Error signing out:", error)
        toast.error("Failed to log out")
      }
    } else {
      // Navigate to login page
      localStorage.setItem(
        "redirectAfterLogin",
        `/hostels/${id}${collegeParam ? `?college=${encodeURIComponent(collegeParam)}` : ""}`,
      )
      router.push("/auth/login")
    }
  }

  // Toggle save hostel
  const toggleSaveHostel = async () => {
    if (!isLoggedIn) {
      // Store the current page URL for redirection after login
      localStorage.setItem(
        "redirectAfterLogin",
        `/hostels/${id}${collegeParam ? `?college=${encodeURIComponent(collegeParam)}` : ""}`,
      )
      router.push("/auth/login")
      return
    }

    const currentUserObj = getCurrentUser()
    if (!currentUserObj) {
      console.error("No user found despite isLoggedIn being true")
      router.push("/auth/login")
      return
    }

    try {
      if (savedHostels.includes(id)) {
        // Remove from saved hostels
        const result = await removeHostel(currentUserObj.uid, id)
        if (result.success) {
          const updatedSavedHostels = savedHostels.filter((hostelId) => hostelId !== id)
          setSavedHostels(updatedSavedHostels)
          toast.success("Removed from saved hostels")
        } else {
          console.error("Error removing hostel:", result.error)
          toast.error("Failed to remove from saved hostels")
        }
      } else {
        // Add to saved hostels
        const result = await saveHostelToFirebase(currentUserObj.uid, id)
        if (result.success) {
          const updatedSavedHostels = [...savedHostels, id]
          setSavedHostels(updatedSavedHostels)
          toast.success("Added to saved hostels")
        } else {
          console.error("Error saving hostel:", result.error)
          toast.error("Failed to add to saved hostels")
        }
      }
    } catch (error) {
      console.error("Error toggling saved hostel:", error)
      toast.error("Failed to update saved hostels")
    }
  }

  // Handle review submission
  const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isLoggedIn) {
      // Store the current page URL for redirection after login
      localStorage.setItem(
        "redirectAfterLogin",
        `/hostels/${id}${collegeParam ? `?college=${encodeURIComponent(collegeParam)}` : ""}`,
      )
      router.push("/auth/login")
      return
    }

    if (reviewText.trim() === "") return

    const newReview = {
      id: Date.now(),
      name: "You",
      text: reviewText,
      rating: 5,
      date: new Date().toISOString().split("T")[0],
    }

    setReviews([newReview, ...reviews])
    setReviewText("")
    setShowReviewForm(false)
  }

  if (!hostel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A00F0]"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <CommonNavbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {hostel ? (
          <>
            {/* Image Gallery */}
            <section className="relative bg-black">
              <div className="relative h-64 md:h-96 lg:h-[500px]">
                <Image
                  src={hostel.images[activeImageIndex] || "/placeholder.svg"}
                  alt={`${hostel.name} - Image ${activeImageIndex + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Type and Gender Badge */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <span className="bg-[#5A00F0] text-white px-3 py-1 rounded-full uppercase text-sm font-medium">
                    {hostel.type}
                  </span>
                  <span
                    className={`text-white px-3 py-1 rounded-full uppercase text-sm font-medium ${
                      hostel.gender === "boys" ? "bg-blue-500" : hostel.gender === "girls" ? "bg-pink-500" : "bg-purple-500"
                    }`}
                  >
                    {hostel.gender}
                  </span>
                </div>

                {/* Save Button */}
                <button
                  onClick={toggleSaveHostel}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-10"
                >
                  <Heart
                    size={24}
                    className={savedHostels.includes(id) ? "fill-[#FF6B6B] text-[#FF6B6B]" : "text-gray-400"}
                  />
                </button>

                {/* Image Navigation */}
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md z-10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="text-[#5A00F0]" />
                </button>
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md z-10"
                  onClick={nextImage}
                >
                  <ChevronRight className="text-[#5A00F0]" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {activeImageIndex + 1} / {hostel.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="bg-black p-2 overflow-x-auto hide-scrollbar">
                <div className="flex gap-2">
                  {hostel.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative min-w-[80px] h-16 rounded overflow-hidden ${
                        activeImageIndex === index ? "ring-2 ring-[#5A00F0]" : "opacity-70"
                      }`}
                      onClick={() => goToImage(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Hostel Details */}
            <section className="py-6 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold mb-2">{hostel.name}</h1>
                      <div className="flex items-center mb-2">
                        <MapPin size={16} className="text-gray-500 mr-1" />
                        <span className="text-gray-500">{hostel.address}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center bg-[#5A00F0] text-white px-2 py-1 rounded mr-3">
                          <Star size={14} className="fill-white mr-1" />
                          <span>{hostel.rating}</span>
                        </div>
                        <span className="text-gray-500">{hostel.reviews} reviews</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <div className="text-3xl font-bold text-[#5A00F0]">₹{hostel.price}</div>
                      <div className="text-gray-500">per month</div>
                    </div>
                  </div>

                  {/* Accommodation Type and Gender */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h2 className="text-xl font-bold mb-3">Accommodation Details</h2>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center">
                        {hostel.type === "hostel" ? (
                          <Building2 size={18} className="text-[#5A00F0] mr-2" />
                        ) : (
                          <Building size={18} className="text-[#5A00F0] mr-2" />
                        )}
                        <span className="font-medium">{hostel.type === "hostel" ? "Hostel" : "Paying Guest (PG)"}</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={18} className="text-[#5A00F0] mr-2" />
                        <span className="font-medium">
                          For {hostel.gender === "boys" ? "Boys" : hostel.gender === "girls" ? "Girls" : "Boys & Girls"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h2 className="text-xl font-bold mb-3">Distance</h2>
                    <div className="flex items-center">
                      <MapPin size={18} className="text-[#5A00F0] mr-2" />
                      <span>
                        {hostel.distance[collegeParam ?? "Other"] || hostel.distance["Other"]} km from {collegeParam || "city center"}
                      </span>
                      {/* <span>
                        {hostel.distance[collegeParam] || hostel.distance["Other"]} km from {collegeParam || "city center"}
                      </span> */}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h2 className="text-xl font-bold mb-3">Description</h2>
                    <p className="text-gray-700">{hostel.description}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h2 className="text-xl font-bold mb-3">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {hostel.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <div className="text-[#5A00F0] mr-2">{getAmenityIcon(amenity)}</div>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Reviews</h2>
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-[#8300FF] text-white px-4 py-2 rounded-md hover:bg-[#7000DD] transition"
                    >
                      {showReviewForm ? "Cancel" : "Write a Review"}
                    </button>
                  </div>

                  {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="mb-6 border-b border-gray-200 pb-6">
                      <div className="mb-4">
                        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Review
                        </label>
                        <textarea
                          id="review"
                          rows={4}
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                          placeholder="Share your experience with this hostel..."
                          required
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="bg-[#8300FF] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#7000DD] transition"
                      >
                        Submit Review
                      </button>
                    </form>
                  )}

                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="bg-[#5A00F0] text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold mr-3">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold">{review.name}</p>
                                <div className="flex items-center">
                                  {Array(review.rating)
                                    .fill(0)
                                    .map((_, i) => (
                                      <Star key={i} className="fill-[#FFD700] stroke-none" size={14} />
                                    ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-gray-500 text-sm">{review.date}</span>
                          </div>
                          <p className="mt-2 text-gray-700">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                  )}
                </div>

                {/* Booking Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">Book This {hostel.type === "hostel" ? "Hostel" : "PG"}</h2>
                  
                  {!isLoggedIn ? (
                    <div className="text-center py-6">
                      <div className="text-gray-600 mb-4">You need to be logged in to book this {hostel.type === "hostel" ? "hostel" : "PG"}.</div>
                      <button
                        onClick={() => {
                          // Store the current page URL for redirection after login
                          localStorage.setItem(
                            "redirectAfterLogin",
                            `/hostels/${id}${collegeParam ? `?college=${encodeURIComponent(collegeParam)}` : ""}`
                          )
                          router.push("/auth/login")
                        }}
                        className="bg-[#8300FF] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#7000DD] transition"
                      >
                        Login to Book
                      </button>
                    </div>
                  ) : (
                    <form 
                      className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0"
                      onSubmit={async (e) => {
                        e.preventDefault()
                        
                        if (!currentUser) {
                          toast.error("You must be logged in to book a hostel")
                          return
                        }
                        
                        if (!bookingForm.name || !bookingForm.phone) {
                          toast.error("Please fill in all required fields")
                          return
                        }
                        
                        setIsSubmitting(true)
                        
                        try {
                          const result = await saveBooking({
                            userId: currentUser.uid,
                            userName: bookingForm.name,
                            userEmail: currentUser.email,
                            userPhone: bookingForm.phone,
                            hostelId: hostel.id,
                            hostelName: hostel.name,
                            college: bookingForm.college,
                            message: bookingForm.message,
                            status: 'pending'
                          })
                          
                          if (result.success) {
                            toast.success("Booking request submitted successfully!")
                            setBookingForm({
                              name: "",
                              phone: "",
                              college: collegeParam || "",
                              message: ""
                            })
                          } else {
                            // Display the specific error message if available
                            const errorMessage = typeof result.error === 'string' 
                              ? result.error 
                              : "Failed to submit booking request. Please try again.";
                            toast.error(errorMessage);
                            console.error("Booking error details:", result.originalError);
                          }
                        } catch (error) {
                          console.error("Error submitting booking:", error)
                          toast.error("An error occurred. Please try again later.")
                        } finally {
                          setIsSubmitting(false)
                        }
                      }}
                    >
                      {/* Hostel Name (Read-only) */}
                      <div className="md:col-span-2">
                        <label htmlFor="booking-hostel" className="block text-sm font-medium text-gray-700 mb-1">
                          Hostel Name
                        </label>
                        <input
                          type="text"
                          id="booking-hostel"
                          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                          value={hostel.name}
                          readOnly
                        />
                      </div>
                    
                      <div className="md:col-span-1">
                        <label htmlFor="booking-name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="booking-name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                          placeholder="Your name"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                          required
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label htmlFor="booking-phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="booking-phone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                          placeholder="Your phone number"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="booking-college" className="block text-sm font-medium text-gray-700 mb-1">
                          College
                        </label>
                        <input
                          type="text"
                          id="booking-college"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                          placeholder="Your college name"
                          value={bookingForm.college}
                          onChange={(e) => setBookingForm({...bookingForm, college: e.target.value})}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="booking-message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          id="booking-message"
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                          placeholder="Any specific requirements or questions?"
                          value={bookingForm.message}
                          onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                        ></textarea>
                      </div>

                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full bg-[#8300FF] text-white font-semibold py-3 rounded-md hover:bg-[#7000DD] transition flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {isSubmitting ? 'Submitting...' : 'Book Now'} <Send size={16} />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
          </div>
        )}
      </main>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Footer */}
      <CommonFooter />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
