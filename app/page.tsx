"use client"
import React from "react"
import { User } from "firebase/auth"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Menu,
  Phone,
  MapPin,
  Star,
  Home,
  Heart,
  BookOpen,
  User as UserIcon,
  Building2,
  GraduationCap,
  School,
  ShoppingCartIcon as Discount,
  Hotel,
  Bed,
  Coffee,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  Search,
  LogOut,
  ChevronUp,
  ChevronDown,
  Shield,
  DollarSign,
  Users,
  ArrowRight,
  CheckCircle,
  FileCheck,
  CalendarCheck,
} from "lucide-react"
import { collegesList } from "@/data/colleges"
import { hostelsList } from "@/data/hostels"
import { onAuthChange, signOut, getCurrentUser } from "@/lib/auth"
import { saveHostel as saveHostelToFirebase, getSavedHostels, removeHostel } from "@/lib/savedHostels"
import CommonFooter from "@/components/common-footer"
import MobileNav from "@/components/mobile-nav"
import WhatsAppButton from "@/components/whatsapp-button"
import { saveContactForm } from '../lib/contactform';
import ContactForm from "@/components/ui/contactform"
import { getFirstAvailableImage } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter()
  const collegeCarouselRef = useRef<HTMLDivElement>(null)
  const reviewCarouselRef = useRef<HTMLDivElement>(null)

  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // State for feature bar

  const [currentFeature, setCurrentFeature] = useState(0)

  // State for search
  const [selectedCollege, setSelectedCollege] = useState("")

  // State for carousel
  const [activeSlide, setActiveSlide] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

  // State for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // State for saved hostels
  const [savedHostels, setSavedHostels] = useState<number[]>([])

  // Handle window resize
  const [isDesktop, setIsDesktop] = useState(false)

  // State for FAQ
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Review data type
  type Review = {
    name: string
    initials: string
    color: string
    rating: number
    review: string
    college: string
  }

  // Review data
  const reviews: Review[] = [
    {
      name: "Ayush Singh",
      initials: "AS",
      color: "#FF69B4",
      rating: 3,
      review: "Great hostel experience! The facilities are well-maintained, and the staff is very helpful. The location near my college saves a lot of commute time.",
      college: "B.Tech, GCET"
    },
    {
      name: "Sraddha Kumari",
      initials: "SK",
      color: "#5A00F0",
      rating: 4,
      review: "The hostel is clean and well-maintained. The staff is friendly and responsive to our needs. I feel safe and comfortable here.",
      college: "B.Tech, NIET"
    },
    {
      name: "Rahul Kumar",
      initials: "RK",
      color: "#FF9E80",
      rating: 5,
      review: "Affordable and convenient. The hostel has good amenities and is close to my college. The food is also quite good.",
      college: "BBA, G L BAJAJ"
    },
    {
      name: "Ananya Patel",
      initials: "AP",
      color: "#4E54C8",
      rating: 3,
      review: "The location is perfect, but the facilities could be better. The staff is helpful though and they address issues quickly.",
      college: "BCA, GNIOT"
    },
    {
      name: "Vikram Gupta",
      initials: "VG",
      color: "#11998E",
      rating: 4,
      review: "Great value for money. The rooms are spacious and the common areas are well-maintained. Highly recommended!",
      college: "M.Tech, ABES"
    },
    {
      name: "Neha Joshi",
      initials: "NJ",
      color: "#8E2DE2",
      rating: 5,
      review: "I've been staying here for two years now. The security is excellent and the environment is very conducive for studies.",
      college: "MBA, KIET"
    },
    {
      name: "Priya Kumar",
      initials: "PK",
      color: "#FF6B6B",
      rating: 5,
      review: "The hostel provides excellent study environment. The library and study rooms are well-equipped. The staff is very supportive of our academic needs.",
      college: "B.Tech, IMS"
    },
    {
      name: "Rohan Sharma",
      initials: "RS",
      color: "#4CAF50",
      rating: 4,
      review: "Great food quality and variety. The mess menu changes regularly and they accommodate special dietary requirements. The common areas are well-maintained.",
      college: "B.Tech, JSS"
    }
  ]

  // features
  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      description: "All properties are personally verified by our team for authenticity and quality.",
      bgColor: "bg-yellow-400",
    },
    {
      icon: DollarSign,
      title: "Zero Brokerage",
      description: "Connect directly with property owners. No hidden charges, no commission fees.",
      bgColor: "bg-green-400",
    },
    {
      icon: Users,
      title: "Student Friendly",
      description: "Specially curated accommodations with student-friendly amenities and policies.",
      bgColor: "bg-blue-400",
    },
  ]

  // Handle review carousel navigation
  const scrollReviews = (direction: "prev" | "next") => {
    if (reviewCarouselRef.current) {
      const scrollAmount = direction === "next" ? 400 : -400
      reviewCarouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Handle hero carousel navigation
  const goToSlide = (index: number) => {
    setActiveSlide(index)
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Handle search
  const handleSearch = () => {
    if (selectedCollege) {
      router.push(`/hostels?college=${encodeURIComponent(selectedCollege)}`)
    }
  }

  // Handle college carousel navigation
  const scrollColleges = (direction: "prev" | "next") => {
    if (collegeCarouselRef.current) {
      const scrollAmount = direction === "next" ? 320 : -320
      collegeCarouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Handle login/logout
  const handleAuthAction = async () => {
    if (isLoggedIn) {
      // Logout logic
      await signOut()
    } else {
      // Navigate to login page
      router.push("/auth/login")
    }
  }

  // Toggle save hostel
  const toggleSaveHostel = async (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      router.push("/auth/login")
      return
    }

    const currentUser = getCurrentUser()
    if (!currentUser) {
      console.error("No user found despite isLoggedIn being true")
      router.push("/auth/login")
      return
    }

    try {
      if (savedHostels.includes(id)) {
        // Remove from saved hostels
        const result = await removeHostel(currentUser.uid, id)
        if (result.success) {
          const updatedSavedHostels = savedHostels.filter((hostelId) => hostelId !== id)
          setSavedHostels(updatedSavedHostels)
        } else {
          console.error("Error removing hostel:", result.error)
        }
      } else {
        // Add to saved hostels
        const result = await saveHostelToFirebase(currentUser.uid, id)
        if (result.success) {
          const updatedSavedHostels = [...savedHostels, id]
          setSavedHostels(updatedSavedHostels)
        } else {
          console.error("Error saving hostel:", result.error)
        }
      }
    } catch (error) {
      console.error("Error toggling saved hostel:", error)
    }
  }

  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // In a real app, you would send the form data to your backend
    router.push("/contact-thank-you")
  }

  // Filter hostels and PGs
  const featuredHostels = hostelsList.filter((hostel) => hostel.type === "hostel").slice(0, 3)
  const featuredPGs = hostelsList.filter((hostel) => hostel.type === "pg").slice(0, 3)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Check auth state
    const unsubscribe = onAuthChange(async (user) => {
      setIsLoggedIn(!!user)
      setCurrentUser(user)

      if (user) {
        // Get saved hostels from Firestore instead of localStorage
        try {
          const result = await getSavedHostels(user.uid)
          if (result.savedHostels) {
            setSavedHostels(result.savedHostels)
          }
        } catch (error) {
          console.error("Error fetching saved hostels:", error)
        }
      } else {
        setSavedHostels([])
      }
    })

    // Improved scroll animation for the path in "What is Hostel Sathi" section
    const handleScroll = () => {
      const section = document.getElementById("what-is-hostel-sathi")
      if (section) {
        const sectionTop = section.getBoundingClientRect().top
        const windowHeight = window.innerHeight

        // Trigger animation when section is 25% in view
        if (sectionTop < windowHeight * 0.75) {
          const desktopPath = document.getElementById("animated-path-desktop")
          const mobilePath = document.getElementById("animated-path-mobile")

          if (desktopPath && !desktopPath.classList.contains("animate")) {
            desktopPath.classList.add("animate")
          }
          if (mobilePath && !mobilePath.classList.contains("animate")) {
            mobilePath.classList.add("animate")
          }
        }
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Trigger once on load to check if section is already in view
    setTimeout(handleScroll, 300)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
      unsubscribe()
    }
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 5)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Auto-scroll reviews
  useEffect(() => {
    if (!isAutoScrolling) return

    const interval = setInterval(() => {
      scrollReviews("next")
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoScrolling])

  // scrool of listing 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="rounded-full overflow-hidden w-10 h-10 flex items-center justify-center">
              <img src="/hostelsathi-logo.jpg" alt="Hostel Sathi Logo" className="w-10 h-10 object-cover" />
            </div>
            <h1 className="ml-2 text-lg font-bold hidden md:block">Hostel Sathi</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#5A00F0] hidden md:block">
            <Phone size={24} />
          </button>
          <button
            onClick={handleAuthAction}
            className="bg-[#8300FF] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#7000DD] transition flex items-center gap-2"
          >
            {isLoggedIn ? (
              <>
                <LogOut size={18} />
                <span>Logout</span>
              </>
            ) : (
              "Login/sign up"
            )}
          </button>
          <Link
            href="/list-property"
            className="hidden md:flex items-center gap-2 text-[#5A00F0] hover:text-[#7000DD] transition"
          >
            <Building2 size={18} />
            <span>List Your Property</span>
          </Link>
          {isDesktop && (
            <button onClick={toggleMobileMenu} className="text-[#5A00F0]">
              <Menu size={24} />
            </button>
          )}
        </div>
      </header>

      {/* Desktop Navigation Menu (Hamburger) */}
      {isDesktop && mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
          <div className="bg-white w-80 h-full shadow-lg p-6 animate-slide-in-right">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={toggleMobileMenu} className="text-gray-500">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-6">
              <Link href="/" className="flex items-center gap-3 text-lg hover:text-[#5A00F0] transition-colors">
                <Home size={24} />
                <span>Home</span>
              </Link>
              <Link
                href="/saved-hostels"
                className="flex items-center gap-3 text-lg hover:text-[#5A00F0] transition-colors"
              >
                <Heart size={24} />
                <span>Saved Hostels</span>
              </Link>
              <Link href="/hostels" className="flex items-center gap-3 text-lg hover:text-[#5A00F0] transition-colors">
                <BookOpen size={24} />
                <span>Hostels/PG's</span>
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={handleAuthAction}
                  className="flex items-center gap-3 text-lg hover:text-[#5A00F0] transition-colors w-full text-left"
                >
                  <LogOut size={24} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 text-lg hover:text-[#5A00F0] transition-colors"
                >
                  <UserIcon size={24} />
                  <span>Login/Sign up</span>
                </Link>
              )}
              <div className="pt-6 border-t border-gray-200">
                <Link
                  href="/about-us"
                  className="flex items-center gap-3 text-lg hover:text-[#5A00F0] transition-colors"
                >
                  <span>About Us</span>
                </Link>
                <Link
                  href="/team"
                  className="flex items-center gap-3 text-lg hover:text-[#5A00F0] transition-colors mt-4"
                >
                  <span>Our Team</span>
                </Link>
                <Link
                  href="/contact-us"
                  className="flex items-center gap-3 text-lg hover:text-[#5A00F0] transition-colors mt-4"
                >
                  <Phone size={24} />
                  <span>Contact Us</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}

      <section className="relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-700/20 to-transparent"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

        <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-24">
          <div className="max-w-6xl mx-auto">
            {/* Top Section - Heading and Search */}
            <div className="text-center mb-12 lg:mb-16">
              <div className="space-y-6 mb-10">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-medium">
                  <Star className="w-3 h-3 mr-1" />
                  Trusted by 10,000+ Students
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight font-modern text-white">
                  Find Your Perfect
                  <span className="block text-yellow-300">Hostel Companion</span>
                </h1>
                <p className="text-lg sm:text-xl text-purple-100 leading-relaxed font-modern font-medium max-w-3xl mx-auto">
                  Discover verified hostels and PGs near your college with zero brokerage. Your comfort, our priority.
                </p>
              </div>


              {/* search fxn new one  */}


              <div className="w-full max-w-2xl mx-auto p-4">
                {/* 🎯 MAIN CONTAINER - This div controls the overall size and background */}
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100">
                  {/* Header - Reduced margin bottom from mb-8 to mb-4 */}
                  <div className="text-center mb-4">
                    <h3 className="text-gray-800 font-bold text-xl lg:text-2xl mb-1">Search Your College</h3>
                  </div>

                  {/* Search Form - Reduced space-y from 6 to 4 */}
                  <div className="space-y-4">
                    {/* College Selection */}
                    <div className="w-full">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                          <GraduationCap size={18} className="text-purple-600" />
                        </div>
                        <select
                          id="college-select"
                          value={selectedCollege}
                          onChange={(e) => setSelectedCollege(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 shadow-sm appearance-none bg-white text-gray-800 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
                        >
                          <option value="" disabled>
                            Choose your college...
                          </option>
                          {collegesList.map((college) => (
                            <option key={college.id} value={college.name}>
                              {college.name}
                            </option>
                          ))}
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className="flex justify-center">
                      <Button
                        onClick={handleSearch}
                        disabled={!selectedCollege}
                        size="default"
                        className={`w-full sm:w-auto min-w-[200px] h-12 font-semibold rounded-lg text-base transition-all duration-200 ${selectedCollege
                            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Find Hostels
                      </Button>
                    </div>
                  </div>

                  {/* Popular Locations Footer - Reduced margin top from mt-8 to mt-4 and padding top from pt-6 to pt-4 */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-purple-600" />
                        <span className="font-medium">Currently operating in:</span>
                      </div>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                        Greater Noida
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Feature Carousel */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left - Feature Carousel */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-white/20 h-[300px] flex items-center">
                  <div className="w-full">
                    <div className="flex items-start space-x-6">
                      <div className={`${features[currentFeature].bgColor} p-4 rounded-2xl flex-shrink-0`}>
                        {React.createElement(features[currentFeature].icon, {
                          className: "w-8 h-8 text-purple-800",
                        })}
                      </div>
                      <div className="text-white flex-1">
                        <h3 className="font-bold text-2xl lg:text-3xl mb-4 font-modern">
                          {features[currentFeature].title}
                        </h3>
                        <p className="text-purple-100 font-modern font-medium text-lg leading-relaxed">
                          {features[currentFeature].description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center mt-6 space-x-3">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentFeature ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right - Stats and Additional Info */}
              <div className="space-y-12 w-full">
                {/* Additional Benefits */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border border-white/20 h-[300px] flex flex-col justify-center">
                  <h4 className="text-white font-semibold text-lg mb-4">Why Choose Hostel Sathi?</h4>
                  <ul className="space-y-3 text-purple-100">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                      <span>Instant property verification</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                      <span>Direct owner contact</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                      <span>Student-focused amenities</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                      <span>24/7 customer support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANOTHER SECTION CONTAIN THE FEATURE PART */}

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Decorative elements */}
          <div className="absolute left-0 w-32 h-32 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute right-0 w-32 h-32 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>

          <div className="relative max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-16 sm:mb-20 text-center">
              <div className="inline-block px-4 py-1.5 bg-purple-100 rounded-full text-purple-700 font-medium text-sm sm:text-base mb-6">
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  <span>Trusted by thousands of students</span>
                </span>
              </div>

              <p className="text-gray-500 text-sm sm:text-base mb-4 font-medium tracking-wide uppercase">
                what is Hostel Sathi?
              </p>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                <span className="text-purple-600 font-modern">50+</span>{" "}
                <span className="text-gray-900 font-modern">Hostels and PG's</span>
              </h2>

              {/* Purple underline decoration - made it more elegant */}
              <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-purple-700 mx-auto mb-8 rounded-full"></div>

              <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto font-modern">
                Hostel Sathi is a place where you can find affordable hostels and PGs near your college.
                <span className="block mt-4 text-base sm:text-lg text-gray-500">
                  We connect students with quality accommodations that feel like a home away from home.
                </span>
              </p>
            </div>

            {/* Features Cards - Redesigned with hover effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
      {/* Smart Roommate Matching */}
      {/* Complete Online Booking */}
<div
  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-purple-200 group animate-fade-in-up"
  style={{ animationDelay: "0.1s" }}
>
  <div className="flex flex-col h-full">
    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110 group-hover:rotate-3 transform">
      <CalendarCheck className="w-7 h-7 text-purple-600 transition-transform duration-300" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 font-modern">Complete Online Booking</h3>
    <p className="text-gray-600 text-base leading-relaxed mb-5 flex-grow">
      Book your hostel from anywhere with our seamless online process. Browse verified listings, take virtual tours,
      and confirm your stay—all within a few clicks.
    </p>
    <ul className="space-y-2">
      <li className="flex items-center text-sm text-gray-500">
        <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
        <span>Instant booking & confirmation</span>
      </li>
      <li className="flex items-center text-sm text-gray-500">
        <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
        <span>Virtual hostel tours available</span>
      </li>
    </ul>
  </div>
</div>


      {/* 24/7 Safety & Support */}
      <div
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-purple-200 group animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex flex-col h-full">
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110 group-hover:rotate-3 transform">
            <Shield className="w-7 h-7 text-purple-600 transition-transform duration-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-modern">24/7 Safety & Support</h3>
          <p className="text-gray-600 text-base leading-relaxed mb-5 flex-grow">
            Round-the-clock security monitoring and instant support team available to ensure your safety and resolve any
            concerns immediately.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
              <span>24/7 security monitoring</span>
            </li>
            <li className="flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
              <span>Instant support response</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Student Friendly */}
      <div
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-purple-200 group sm:col-span-2 lg:col-span-1 animate-fade-in-up"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex flex-col h-full">
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110 group-hover:rotate-3 transform">
            <Bed className="w-7 h-7 text-purple-600 transition-transform duration-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-modern">Student Friendly</h3>
          <p className="text-gray-600 text-base leading-relaxed mb-5 flex-grow">
            Specially curated accommodations with student-focused amenities, flexible policies, and convenient locations
            near educational institutions.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
              <span>Study-friendly environment</span>
            </li>
            <li className="flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
              <span>Student community</span>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
            {/* CTA Button - Enhanced */}
            <div className=" flex justify-center mb-16">
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group h-auto"
              >
                <Link href="/hostels">
                  Explore Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </section>


{/* CONTAIN THE HOSTEL AND THE COLLEGES :  */}

      <main className="flex-1 -mt-20">
        {/* Popular Colleges - Improved responsiveness */}
        <section className="py-8 px-4 bg-gray-50">
          <div className="max-w-md mx-auto md:max-w-2xl lg:max-w-5xl xl:max-w-6xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Find Hostels Near These <span className="text-[#5A00F0]">Popular Colleges</span>
              </h2>
              <div className="flex gap-2">
                <button
                  className="college-prev bg-white rounded-full p-1 shadow-sm"
                  onClick={() => scrollColleges("prev")}
                >
                  <ChevronLeft size={18} className="text-[#5A00F0]" />
                </button>
                <button
                  className="college-next bg-white rounded-full p-1 shadow-sm"
                  onClick={() => scrollColleges("next")}
                >
                  <ChevronRight size={18} className="text-[#5A00F0]" />
                </button>
              </div>
            </div>

            <div className="college-carousel overflow-x-auto hide-scrollbar" ref={collegeCarouselRef}>
              <div className="flex gap-4 pb-4 w-full">
                {collegesList.map((college, index) => (
                  <Link
                    key={index}
                    href={`/hostels?college=${encodeURIComponent(college.name)}`}
                    className="min-w-[150px] md:min-w-[200px] lg:min-w-[250px] xl:min-w-[280px] bg-white rounded-lg shadow-md transform transition-transform hover:scale-105"
                  >
                    <div className="h-24 md:h-32 lg:h-36 bg-gradient-to-br from-[#5A00F0] to-[#B366FF] rounded-t-lg flex items-center justify-center overflow-hidden">
                      <Image
                        src={college.image}
                        alt={college.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 md:p-4">
                      <p className="text-center font-medium text-sm md:text-base lg:text-lg">{college.name}</p>
                      <p className="text-xs md:text-sm text-gray-500 text-center">{college.type}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Hostels */}
        <section className="py-8 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured Hostels</h2>
              <Link href="/hostels?type=hostel" className="text-[#5A00F0] font-medium hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHostels.map((hostel) => (
                <Link
                  key={hostel.id}
                  href={`/hostels/${hostel.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={getFirstAvailableImage(hostel.images)}
                      alt={hostel.name}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={(e) => toggleSaveHostel(hostel.id, e)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md z-10"
                    >
                      <Heart
                        size={20}
                        className={savedHostels.includes(hostel.id) ? "fill-[#FF6B6B] text-[#FF6B6B]" : "text-gray-400"}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{hostel.name}</h3>
                      <div className="flex items-center bg-[#5A00F0] text-white px-2 py-1 rounded">
                        <Star size={14} className="fill-white mr-1" />
                        <span>{hostel.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      <MapPin size={16} className="text-gray-500 mr-1" />
                      <span className="text-gray-500 text-sm">{hostel.address}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {hostel.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
                      {hostel.amenities.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          +{hostel.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-[#5A00F0]">₹{hostel.price}</span>
                        <span className="text-gray-500 text-sm">/month</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured PGs - New Section */}
        <section className="py-8 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured PG's</h2>
              <Link href="/hostels?type=pg" className="text-[#5A00F0] font-medium hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPGs.map((pg) => (
                <Link
                  key={pg.id}
                  href={`/hostels/${pg.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={getFirstAvailableImage(pg.images)}
                      alt={pg.name}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={(e) => toggleSaveHostel(pg.id, e)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md z-10"
                    >
                      <Heart
                        size={20}
                        className={savedHostels.includes(pg.id) ? "fill-[#FF6B6B] text-[#FF6B6B]" : "text-gray-400"}
                      />
                    </button>
                    {/* Gender Badge */}
                    <span
                      className={`absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-full uppercase ${pg.gender === "boys" ? "bg-blue-500" : pg.gender === "girls" ? "bg-pink-500" : "bg-purple-500"
                        }`}
                    >
                      {pg.gender}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{pg.name}</h3>
                      <div className="flex items-center bg-[#5A00F0] text-white px-2 py-1 rounded">
                        <Star size={14} className="fill-white mr-1" />
                        <span>{pg.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      <MapPin size={16} className="text-gray-500 mr-1" />
                      <span className="text-gray-500 text-sm">{pg.address}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {pg.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
                      {pg.amenities.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          +{pg.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-[#5A00F0]">₹{pg.price}</span>
                        <span className="text-gray-500 text-sm">/month</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Student Experience Section - Revamped */}
        <section className="py-10 px-4 bg-gray-50">
          <div className="max-w-md mx-auto md:max-w-2xl lg:max-w-5xl xl:max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Our Student's experience</h2>
              <div className="flex gap-2">
                <button
                  className="review-prev bg-white rounded-full p-1 shadow-sm"
                  onClick={() => scrollReviews("prev")}
                >
                  <ChevronLeft size={18} className="text-[#5A00F0]" />
                </button>
                <button
                  className="review-next bg-white rounded-full p-1 shadow-sm"
                  onClick={() => scrollReviews("next")}
                >
                  <ChevronRight size={18} className="text-[#5A00F0]" />
                </button>
              </div>
            </div>

            <div className="review-carousel overflow-x-auto hide-scrollbar" ref={reviewCarouselRef}>
              <div className="flex gap-4 pb-4 w-full">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="min-w-[300px] md:min-w-[350px] lg:min-w-[400px] bg-white p-6 rounded-lg shadow-md flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold"
                          style={{ backgroundColor: review.color }}
                        >
                          {review.initials}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{review.name}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`${i < review.rating ? "fill-[#FFD700] stroke-none" : "fill-gray-300 stroke-none"}`}
                                size={16}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 flex-grow mb-4">{review.review}</p>
                    <p className="text-sm text-gray-500">{review.college}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section - Fixed Alignment */}
        <section className="py-10 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <ContactForm />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-[#5A00F0]">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  question: "What is Hostel Sathi?",
                  answer:
                    "Hostel Sathi is a platform that helps students find affordable and quality hostels and PGs near their colleges. We verify all listings to ensure they meet our standards for safety, cleanliness, and amenities.",
                },
                {
                  question: "How do I find a hostel on Hostel Sathi?",
                  answer:
                    "You can search for hostels by selecting your college from the dropdown menu on our homepage or by browsing through our listings. You can filter results by type (hostel or PG), gender preference, and other criteria.",
                },
                {
                  question: "Is there a fee for using Hostel Sathi?",
                  answer:
                    "No, Hostel Sathi is completely free for students. We don't charge any brokerage or commission fees. Our goal is to make the hostel-finding process as easy and affordable as possible.",
                },
                {
                  question: "How do I list my property on Hostel Sathi?",
                  answer:
                    "Property owners can list their hostels or PGs by clicking on the 'List Your Property' button on our website. You'll need to provide details about your property, including photos, amenities, and pricing.",
                },
                {
                  question: "Are the hostels on Hostel Sathi verified?",
                  answer:
                    "Yes, all hostels and PGs listed on Hostel Sathi are verified by our team. We ensure that they meet our standards for safety, cleanliness, and amenities before they are listed on our platform.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    className="w-full flex justify-between items-center p-4 text-left font-medium focus:outline-none"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="text-[#5A00F0]" />
                    ) : (
                      <ChevronDown className="text-[#5A00F0]" />
                    )}
                  </button>
                  <div className={`px-4 pb-4 ${expandedFaq === index ? "block" : "hidden"}`}>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WhatsApp Button */}
        <WhatsAppButton />
      </main>

      {/* Footer */}
      <CommonFooter />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}

