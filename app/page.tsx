"use client"

import type React from "react"
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
} from "lucide-react"
import { collegesList } from "@/data/colleges"
import { hostelsList } from "@/data/hostels"
import { onAuthChange, signOut, getCurrentUser } from "@/lib/auth"
import { saveHostel as saveHostelToFirebase, getSavedHostels, removeHostel } from "@/lib/savedHostels"
import CommonFooter from "@/components/common-footer"
import MobileNav from "@/components/mobile-nav"
import WhatsAppButton from "@/components/whatsapp-button"
import { saveContactForm } from '../lib/contactform';
import { toast } from 'react-hot-toast'; // Ass
import ContactForm from "@/components/ui/contactform"

export default function HomePage() {
  const router = useRouter()
  const collegeCarouselRef = useRef<HTMLDivElement>(null)

  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // State for search
  const [selectedCollege, setSelectedCollege] = useState("")

  // State for carousel
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeReviewPage, setActiveReviewPage] = useState(0)

  // State for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false)
 const [currentUser, setCurrentUser] = useState<User | null>(null)

  // State for saved hostels
  const [savedHostels, setSavedHostels] = useState<number[]>([])

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

  // Handle hero carousel navigation
  const goToSlide = (index: number) => {
    setActiveSlide(index)
  }

  // Handle review carousel navigation
  const goToReviewPage = (index: number) => {
    setActiveReviewPage(index)

    // Get the review track element
    const reviewTrack = document.querySelector(".review-track")as HTMLElement
    if (reviewTrack) {
      // If going to the last slide, prepare for looping back to first
      if (index === 2) {
        // After transition completes, instantly (no animation) go back to first slide
        setTimeout(() => {
          reviewTrack.classList.remove("transition-transform")
          setActiveReviewPage(0)

          // Force reflow to apply the instant change
          void reviewTrack.offsetWidth

          // Re-enable transitions for next normal navigation
          setTimeout(() => {
            reviewTrack.classList.add("transition-transform")
          }, 50)
        }, 300) // Wait for transition to complete
      }
    }
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



  // function for th contact form 


  //  const ContactForm = () =>  {
  // const [formData, setFormData] = useState({
  //   name: '',
  //   phone: '',
  //   college: '',
  //   message: ''
  // });
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { id, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [id]: value
  //   }));
  // };

  // const handleContactSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   // Basic validation
  //   if (!formData.name || !formData.phone || !formData.message) {
  //     toast.error('Please fill in all required fields');
  //     return;
  //   }
    
  //   setIsSubmitting(true);
    
  //   try {
  //     const result = await saveContactForm({
  //       name: formData.name,
  //       phone: formData.phone,
  //       college: formData.college,
  //       message: formData.message
  //     });
      
  //     if (result.success) {
  //       toast.success('Your message has been sent successfully!');
  //       // Reset form after successful submission
  //       setFormData({
  //         name: '',
  //         phone: '',
  //         college: '',
  //         message: ''
  //       });
  //     } else {
  //       toast.error(result.error || 'Failed to send message. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Contact form submission error:', error);
  //     toast.error('An unexpected error occurred. Please try again later.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  // }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="rounded-full bg-[#5A00F0] w-10 h-10 flex items-center justify-center">
              <span className="text-white font-bold text-lg">HS</span>
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
      <main className="flex-1">
        {/* Search Section */}
        <section className="p-6 bg-gradient-to-b from-[#5A00F0] via-[#9747FF] to-[#f5eeff]">
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
            <h2 className="text-white text-xl font-bold text-center mb-2">Find Your Perfect Hostel</h2>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <GraduationCap size={20} className="text-[#5A00F0]" />
                </div>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-md appearance-none bg-white"
                >
                  <option value="">Select your college</option>
                  {collegesList.map((college) => (
                    <option key={college.id} value={college.name}>
                      {college.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <button
                onClick={handleSearch}
                disabled={!selectedCollege}
                className={`px-6 py-3 rounded-lg shadow-md flex items-center gap-2 w-full md:w-auto justify-center ${
                  selectedCollege
                    ? "bg-[#8300FF] text-white hover:bg-[#7000DD]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition`}
              >
                <Search size={20} />
                <span>Search</span>
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <MapPin size={16} className="text-white" />
              <span className="text-white text-sm">Greater Noida, Uttar Pradesh</span>
            </div>
          </div>
        </section>

        {/* Hero Banner - Carousel */}
        <section className="py-8 w-full bg-gradient-to-r from-[#5A00F0]/10 to-[#B366FF]/10 box-border">
          <div className="w-full">
            <div className="bg-white shadow-lg overflow-hidden">
              <div className="carousel-container relative">
                <div
                  className="carousel-track flex transition-transform duration-500"
                  style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {/* Carousel slides */}
                  <div className="carousel-slide min-w-full p-10 bg-gradient-to-r from-[#5A00F0] to-[#B366FF]">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="flex-1 mb-4 md:mb-0">
                        <h2 className="text-white text-2xl font-bold mb-4">
                          Crazy discount
                          <br />
                          on Hostels
                        </h2>
                        <button className="bg-white text-black px-4 py-2 rounded-md font-medium shadow-md hover:bg-gray-100 transition">
                          Book now
                        </button>
                      </div>
                      <div className="flex-1 flex justify-center">
                        <Hotel size={80} className="text-white/80" />
                      </div>
                    </div>
                  </div>
                  <div className="carousel-slide min-w-full p-6 bg-gradient-to-r from-[#FF6B6B] to-[#FF9E80]">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="flex-1 mb-4 md:mb-0">
                        <h2 className="text-white text-2xl font-bold mb-4">
                          Premium
                          <br />
                          Amenities
                        </h2>
                        <button className="bg-white text-black px-4 py-2 rounded-md font-medium shadow-md hover:bg-gray-100 transition">
                          Explore
                        </button>
                      </div>
                      <div className="flex-1 flex justify-center">
                        <Wifi size={80} className="text-white/80" />
                      </div>
                    </div>
                  </div>
                  <div className="carousel-slide min-w-full p-6 bg-gradient-to-r from-[#4E54C8] to-[#8F94FB]">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="flex-1 mb-4 md:mb-0">
                        <h2 className="text-white text-2xl font-bold mb-4">
                          Comfortable
                          <br />
                          Rooms
                        </h2>
                        <button className="bg-white text-black px-4 py-2 rounded-md font-medium shadow-md hover:bg-gray-100 transition">
                          View rooms
                        </button>
                      </div>
                      <div className="flex-1 flex justify-center">
                        <Bed size={80} className="text-white/80" />
                      </div>
                    </div>
                  </div>
                  <div className="carousel-slide min-w-full p-6 bg-gradient-to-r from-[#11998E] to-[#38EF7D]">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="flex-1 mb-4 md:mb-0">
                        <h2 className="text-white text-2xl font-bold mb-4">
                          Cafeteria
                          <br />
                          Services
                        </h2>
                        <button className="bg-white text-black px-4 py-2 rounded-md font-medium shadow-md hover:bg-gray-100 transition">
                          See menu
                        </button>
                      </div>
                      <div className="flex-1 flex justify-center">
                        <Coffee size={80} className="text-white/80" />
                      </div>
                    </div>
                  </div>
                  <div className="carousel-slide min-w-full p-6 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0]">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="flex-1 mb-4 md:mb-0">
                        <h2 className="text-white text-2xl font-bold mb-4">
                          Special
                          <br />
                          Offers
                        </h2>
                        <button className="bg-white text-black px-4 py-2 rounded-md font-medium shadow-md hover:bg-gray-100 transition">
                          Get deals
                        </button>
                      </div>
                      <div className="flex-1 flex justify-center">
                        <Discount size={80} className="text-white/80" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carousel controls */}
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md z-10"
                  onClick={() => goToSlide((activeSlide - 1 + 5) % 5)}
                >
                  <ChevronLeft className="text-[#5A00F0]" />
                </button>
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md z-10"
                  onClick={() => goToSlide((activeSlide + 1) % 5)}
                >
                  <ChevronRight className="text-[#5A00F0]" />
                </button>

                {/* Carousel indicators */}
                <div className="flex justify-center gap-2 mt-4 pb-4">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        activeSlide === index ? "w-8 bg-[#5A00F0]" : "w-2 bg-gray-300"
                      }`}
                      onClick={() => goToSlide(index)}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is Hostel Sathi Section - Enhanced Design with Dynamic Animation */}
        {/* What is Hostel Sathi Section - Minimalist Redesign */}
        <section id="what-is-hostel-sathi" className="py-16 px-4 md:py-24 bg-white overflow-hidden">
          <div className="max-w-md mx-auto md:max-w-2xl lg:max-w-3xl">
            <div className="flex flex-col items-center text-center mb-12">
              {/* Small heading */}
              <h3 className="text-[#718096] text-lg md:text-xl mb-2 font-light">what is Hostel Sathi?</h3>

              {/* Large bold heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 text-[#2D3748]">
                <span className="text-[#5A00F0]">100+</span> Hostels and PG's
              </h2>

              {/* Minimal divider */}
              <div className="w-16 h-1 bg-[#5A00F0] mb-10"></div>

              {/* Staggered text with increased spacing */}
              <p className="text-[#718096] text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
                Hostel Sathi is a place
                <br className="hidden md:block" />
                where you can find
                <br className="hidden md:block" />
                affordable hostels and PGs near your college.
              </p>

              {/* Feature points in minimal style */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full">
                <div className="flex flex-col items-center">
                  <Building2 size={28} className="text-[#5A00F0] mb-3" />
                  <p className="text-[#2D3748] font-medium">Verified Listings</p>
                </div>
                <div className="flex flex-col items-center">
                  <MapPin size={28} className="text-[#5A00F0] mb-3" />
                  <p className="text-[#2D3748] font-medium">Zero Brokerage</p>
                </div>
                <div className="flex flex-col items-center">
                  <Bed size={28} className="text-[#5A00F0] mb-3" />
                  <p className="text-[#2D3748] font-medium">Student Friendly</p>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/hostels"
                className="bg-[#5A00F0] text-white px-8 py-3 rounded-md font-medium hover:bg-[#4800C0] transition-colors"
              >
                Explore Now
              </Link>
            </div>
          </div>
        </section>

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
                    <div className="h-24 md:h-32 lg:h-36 bg-gradient-to-br from-[#5A00F0] to-[#B366FF] rounded-t-lg flex items-center justify-center">
                      <School size={40} className="text-white" />
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
                      src="/placeholder.svg?height=300&width=400"
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
                    <Image src="/placeholder.svg?height=300&width=400" alt={pg.name} fill className="object-cover" />
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
                      className={`absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-full uppercase ${
                        pg.gender === "boys" ? "bg-blue-500" : pg.gender === "girls" ? "bg-pink-500" : "bg-purple-500"
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

        {/* contact use form component  */}
        
        <ContactForm/>
        {/* /////////////////////////////////// */}

        {/* Student Experience Section - Revamped */}
        <section className="py-10 px-4 bg-gray-50">
          <div className="max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Our Student's experience</h2>
              <div className="flex gap-2">
                <button
                  className="review-prev bg-white rounded-full p-1 shadow-sm"
                  onClick={() => goToReviewPage((activeReviewPage - 1 + 3) % 3)}
                >
                  <ChevronLeft size={18} className="text-[#5A00F0]" />
                </button>
                <button
                  className="review-next bg-white rounded-full p-1 shadow-sm"
                  onClick={() => goToReviewPage((activeReviewPage + 1) % 3)}
                >
                  <ChevronRight size={18} className="text-[#5A00F0]" />
                </button>
              </div>
            </div>

            <div className="review-carousel overflow-hidden">
              <div
                className="review-track flex gap-4 transition-transform duration-300"
                style={{ transform: `translateX(-${activeReviewPage * 100}%)` }}
              >
                {/* Review Cards */}
                <div className="min-w-[calc(50%-8px)] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-12px)] aspect-square bg-white p-4 rounded-lg shadow-md flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#FF69B4] text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        AS
                      </div>
                      <div>
                        <p className="font-bold">Ayush Singh</p>
                        <div className="flex items-center">
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm flex-grow">
                    "Great hostel experience! The facilities are well-maintained, and the staff is very helpful. The
                    location near my college saves a lot of commute time."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">B.Tech, GCET</p>
                </div>

                <div className="min-w-[calc(50%-8px)] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-12px)] aspect-square bg-white p-4 rounded-lg shadow-md flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#5A00F0] text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        SK
                      </div>
                      <div>
                        <p className="font-bold">Sraddha Kumari</p>
                        <div className="flex items-center">
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-gray-300 stroke-none" size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm flex-grow">
                    "The hostel is clean and well-maintained. The staff is friendly and responsive to our needs. I feel
                    safe and comfortable here."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">B.Tech, NIET</p>
                </div>

                <div className="min-w-[calc(50%-8px)] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-12px)] aspect-square bg-white p-4 rounded-lg shadow-md flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#FF9E80] text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        RK
                      </div>
                      <div>
                        <p className="font-bold">Rahul Kumar</p>
                        <div className="flex items-center">
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm flex-grow">
                    "Affordable and convenient. The hostel has good amenities and is close to my college. The food is
                    also quite good."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">BBA, G L BAJAJ</p>
                </div>

                <div className="min-w-[calc(50%-8px)] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-12px)] aspect-square bg-white p-4 rounded-lg shadow-md flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#4E54C8] text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        AP
                      </div>
                      <div>
                        <p className="font-bold">Ananya Patel</p>
                        <div className="flex items-center">
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-gray-300 stroke-none" size={14} />
                          <Star className="fill-gray-300 stroke-none" size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm flex-grow">
                    "The location is perfect, but the facilities could be better. The staff is helpful though and they
                    address issues quickly."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">BCA, GNIOT</p>
                </div>

                <div className="min-w-[calc(50%-8px)] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-12px)] aspect-square bg-white p-4 rounded-lg shadow-md flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#11998E] text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        VG
                      </div>
                      <div>
                        <p className="font-bold">Vikram Gupta</p>
                        <div className="flex items-center">
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-gray-300 stroke-none" size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm flex-grow">
                    "Great value for money. The rooms are spacious and the common areas are well-maintained. Highly
                    recommended!"
                  </p>
                  <p className="text-xs text-gray-500 mt-2">M.Tech, ABES</p>
                </div>

                <div className="min-w-[calc(50%-8px)] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-12px)] aspect-square bg-white p-4 rounded-lg shadow-md flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#8E2DE2] text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        NJ
                      </div>
                      <div>
                        <p className="font-bold">Neha Joshi</p>
                        <div className="flex items-center">
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                          <Star className="fill-[#FFD700] stroke-none" size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm flex-grow">
                    "I've been staying here for two years now. The security is excellent and the environment is very
                    conducive for studies."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">MBA, KIET</p>
                </div>
              </div>
            </div>

            {/* Carousel indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    activeReviewPage === index ? "w-8 bg-[#5A00F0]" : "w-2 bg-gray-300"
                  }`}
                  onClick={() => goToReviewPage(index)}
                ></button>
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

