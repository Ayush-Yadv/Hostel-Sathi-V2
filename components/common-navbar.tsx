"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Menu,
  Phone,
  Heart,
  Home,
  BookOpen,
  User,
  X,
  LogOut,
  Building2,
} from "lucide-react"
import { onAuthChange, signOut } from "@/lib/auth"

export default function CommonNavbar() {
  const router = useRouter()

  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // State for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

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
    const unsubscribe = onAuthChange((user) => {
      setIsLoggedIn(!!user)
      setCurrentUser(user)
    })

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      unsubscribe()
    }
  }, [])

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
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

  return (
    <>
      {/* Top Header */}
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
                <Link href="/blogs" className="flex items-center gap-3 text-lg hover:text-[#5A00F0] transition-colors">
                  <BookOpen size={24} />
                  <span>Blogs</span>
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
                    <User size={24} />
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
      </header>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
        <div className="flex justify-around items-center p-3">
          <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-[#5A00F0]">
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/hostels" className="flex flex-col items-center text-gray-600 hover:text-[#5A00F0]">
            <BookOpen size={24} />
            <span className="text-xs mt-1">Hostels/PG's</span>
          </Link>
          <Link href="/saved-hostels" className="flex flex-col items-center text-gray-600 hover:text-[#5A00F0]">
            <Heart size={24} />
            <span className="text-xs mt-1">Saved</span>
          </Link>
          <Link href="/list-property" className="flex flex-col items-center text-gray-600 hover:text-[#5A00F0]">
            <Building2 size={24} />
            <span className="text-xs mt-1">List Property</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
