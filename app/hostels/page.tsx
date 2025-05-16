"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  MapPin,
  Star,
  Home,
  Heart,
  BookOpen,
  User,
  X,
  Wifi,
  Utensils,
  Shield,
  Search,
  Building,
  Building2,
  Users,
  Filter,
} from "lucide-react"
import { hostelsList, type HostelType, type GenderType, type Hostel } from "@/data/hostels"
import { collegesList } from "@/data/colleges"
import CommonNavbar from "@/components/common-navbar"

export default function HostelsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const collegeParam = searchParams.get("college")

  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // State for hostels
  const [hostels, setHostels] = useState<Hostel[]>([]) 
  const [selectedCollege, setSelectedCollege] = useState(collegeParam || "")

  // New filter states
  const [accommodationType, setAccommodationType] = useState<HostelType | "">("")
  const [genderPreference, setGenderPreference] = useState<GenderType | "">("")
  const [showFilters, setShowFilters] = useState(false)
  const [filtersApplied, setFiltersApplied] = useState(false)

  // State for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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

    // Check if user is logged in from localStorage
    const loggedInStatus = localStorage.getItem("isLoggedIn")
    if (loggedInStatus === "true") {
      setIsLoggedIn(true)
    }

    // Get saved hostels from localStorage
    const savedHostelsData = localStorage.getItem("savedHostels")
    if (savedHostelsData) {
      setSavedHostels(JSON.parse(savedHostelsData))
    }

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Load and filter hostels
  useEffect(() => {
    let filteredHostels = [...hostelsList]

    // Apply college filter if selected
    if (selectedCollege && selectedCollege !== "All Colleges") {
      // No specific filtering by college distance, just keep all hostels
      // In a real app, you might filter by proximity to the selected college
    }

    // Apply accommodation type filter
    if (accommodationType) {
      filteredHostels = filteredHostels.filter((hostel) => hostel.type === accommodationType)
    }

    // Apply gender preference filter
    if (genderPreference) {
      filteredHostels = filteredHostels.filter(
        (hostel) => hostel.gender === genderPreference || hostel.gender === "co-ed",
      )
    }

    setHostels(filteredHostels)
  }, [selectedCollege, accommodationType, genderPreference, collegeParam])

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Handle login/logout
  const handleAuthAction = () => {
    if (isLoggedIn) {
      // Logout logic
      localStorage.removeItem("isLoggedIn")
      setIsLoggedIn(false)
    } else {
      // Navigate to login page
      router.push("/auth/login")
    }
  }

  // Update the handleSearch function to scroll to results
  const handleSearch = () => {
    setFiltersApplied(true)

    // Scroll to results section
    setTimeout(() => {
      const resultsSection = document.getElementById("hostel-results")
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  // Handle college selection
  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCollege(e.target.value)
  }

  // Toggle save hostel
  const toggleSaveHostel = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      router.push("/auth/login")
      return
    }

    let updatedSavedHostels: number[]

    if (savedHostels.includes(id)) {
      updatedSavedHostels = savedHostels.filter((hostelId) => hostelId !== id)
    } else {
      updatedSavedHostels = [...savedHostels, id]
    }

    setSavedHostels(updatedSavedHostels)
    localStorage.setItem("savedHostels", JSON.stringify(updatedSavedHostels))
  }

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Reset all filters
  const resetFilters = () => {
    setAccommodationType("")
    setGenderPreference("")
    setFiltersApplied(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <CommonNavbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {/* Search Section */}
        <section className="bg-gradient-to-r from-[#5A00F0] to-[#B366FF] py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-4">
              {selectedCollege ? `Hostels/PG's near ${selectedCollege}` : "All Hostels/PG's"}
            </h1>

            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Find Your Perfect Accommodation</h2>
                <button onClick={toggleFilters} className="flex items-center gap-2 text-[#5A00F0] font-medium">
                  <Filter size={18} />
                  <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
                </button>
              </div>

              <div className={`space-y-4 ${showFilters ? "block" : "hidden"}`}>
                {/* College Selection */}
                <div>
                  <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
                    Select College
                  </label>
                  <select
                    id="college"
                    value={selectedCollege}
                    onChange={handleCollegeChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                  >
                    <option value="">All Colleges</option>
                    {collegesList.map((college) => (
                      <option key={college.id} value={college.name}>
                        {college.name}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Accommodation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAccommodationType("hostel")}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
                        accommodationType === "hostel"
                          ? "bg-[#5A00F0] text-white border-[#5A00F0]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Building2 size={18} />
                      <span>Hostel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccommodationType("pg")}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
                        accommodationType === "pg"
                          ? "bg-[#5A00F0] text-white border-[#5A00F0]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Building size={18} />
                      <span>PG</span>
                    </button>
                  </div>
                </div>

                {/* Gender Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender Preference</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGenderPreference("boys")}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
                        genderPreference === "boys"
                          ? "bg-[#5A00F0] text-white border-[#5A00F0]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Users size={18} />
                      <span>Boys</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenderPreference("girls")}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
                        genderPreference === "girls"
                          ? "bg-[#5A00F0] text-white border-[#5A00F0]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Users size={18} />
                      <span>Girls</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSearch}
                    className="flex-1 bg-[#8300FF] text-white font-semibold py-2 rounded-md hover:bg-[#7000DD] transition flex items-center justify-center gap-2"
                  >
                    <Search size={18} />
                    <span>Search</span>
                  </button>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(accommodationType || genderPreference || selectedCollege) && (
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Active Filters:</h3>
                  <button onClick={resetFilters} className="text-sm text-[#5A00F0] hover:underline">
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {accommodationType && (
                    <div className="bg-[#5A00F0]/10 text-[#5A00F0] px-3 py-1 rounded-full text-sm flex items-center">
                      {accommodationType === "hostel" ? "Hostel" : "PG"}
                      <button onClick={() => setAccommodationType("")} className="ml-2 hover:text-[#7000DD]">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {genderPreference && (
                    <div className="bg-[#5A00F0]/10 text-[#5A00F0] px-3 py-1 rounded-full text-sm flex items-center">
                      For {genderPreference === "boys" ? "Boys" : "Girls"}
                      <button onClick={() => setGenderPreference("")} className="ml-2 hover:text-[#7000DD]">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {selectedCollege && (
                    <div className="bg-[#5A00F0]/10 text-[#5A00F0] px-3 py-1 rounded-full text-sm flex items-center">
                      Near {selectedCollege}
                      <button onClick={() => setSelectedCollege("")} className="ml-2 hover:text-[#7000DD]">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center text-white mb-2">
              <MapPin size={16} className="mr-1" />
              <span>Greater Noida, Uttar Pradesh</span>
            </div>
          </div>
        </section>

        {/* Hostels Listing */}
        <section id="hostel-results" className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            {hostels.length > 0 ? (
              <>
                <div className="mb-4 text-gray-600">
                  Found {hostels.length} {hostels.length === 1 ? "accommodation" : "accommodations"}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hostels.map((hostel) => (
                    <div
                      key={hostel.id}
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
                            className={
                              savedHostels.includes(hostel.id) ? "fill-[#FF6B6B] text-[#FF6B6B]" : "text-gray-400"
                            }
                          />
                        </button>
                        {/* Type and Gender Badge */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="bg-[#5A00F0] text-white text-xs px-2 py-1 rounded-full uppercase">
                            {hostel.type}
                          </span>
                          <span
                            className={`text-white text-xs px-2 py-1 rounded-full uppercase ${
                              hostel.gender === "boys"
                                ? "bg-blue-500"
                                : hostel.gender === "girls"
                                  ? "bg-pink-500"
                                  : "bg-purple-500"
                            }`}
                          >
                            {hostel.gender}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-xl font-bold">{hostel.name}</h2>
                          <div className="flex items-center bg-[#5A00F0] text-white px-2 py-1 rounded">
                            <Star size={14} className="fill-white mr-1" />
                            <span>{hostel.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center mb-3">
                          <MapPin size={16} className="text-gray-500 mr-1" />
                          <span className="text-gray-500 text-sm">
                            {hostel.distance[selectedCollege] || hostel.distance["Other"]} km from{" "}
                            {selectedCollege || "city center"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {hostel.amenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {amenity === "WiFi" && <Wifi size={12} className="inline mr-1" />}
                              {amenity === "Mess" && <Utensils size={12} className="inline mr-1" />}
                              {amenity === "Security" && <Shield size={12} className="inline mr-1" />}
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
                          <Link
                            href={`/hostels/${hostel.id}?college=${encodeURIComponent(selectedCollege || "")}`}
                            className="bg-[#8300FF] text-white px-3 py-2 rounded-md hover:bg-[#7000DD] transition"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
                <p className="text-gray-500 mb-6">
                  We couldn't find any accommodations matching your criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#8300FF] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#7000DD] transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A0D2F] text-white p-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="rounded-full bg-white w-10 h-10 flex items-center justify-center">
              <span className="text-[#5A00F0] font-bold text-lg">HS</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Hostel sathi</h3>
              <p className="text-sm italic">Your secret home</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto md:grid-cols-4 md:max-w-2xl">
            <div className="space-y-2">
              <Link href="#" className="block hover:text-[#B366FF] transition-colors">
                About us
              </Link>
              <Link href="#" className="block hover:text-[#B366FF] transition-colors">
                Contact us
              </Link>
            </div>
            <div className="space-y-2">
              <Link href="#" className="block hover:text-[#B366FF] transition-colors">
                Privacy policy
              </Link>
              <Link href="#" className="block hover:text-[#B366FF] transition-colors">
                Terms of use
              </Link>
            </div>
            <div className="space-y-2">
              <Link href="#" className="block hover:text-[#B366FF] transition-colors">
                FAQs
              </Link>
              <Link href="#" className="block hover:text-[#B366FF] transition-colors">
                Support
              </Link>
            </div>
            <div className="space-y-2">
              <Link href="#" className="block hover:text-[#B366FF] transition-colors">
                Careers
              </Link>
              <Link href="#" className="block hover:text-[#B366FF] transition-colors">
                Partners
              </Link>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-400">© 2023 Hostel Sathi. All rights reserved.</p>
        </div>
      </footer>

      {/* Bottom Navigation - Only visible on mobile/tablet */}
      {!isDesktop && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-20">
          <Link href="/" className="flex flex-col items-center">
            <Home size={24} />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/saved-hostels" className="flex flex-col items-center">
            <Heart size={24} />
            <span className="text-xs">Saved Hostels</span>
          </Link>
          <Link href="/hostels" className="flex flex-col items-center">
            <BookOpen size={24} className="text-[#5A00F0]" />
            <span className="text-xs text-[#5A00F0]">Hostels/PG's</span>
          </Link>
          <Link href="/auth/login" className="flex flex-col items-center">
            <User size={24} />
            <span className="text-xs">Account</span>
          </Link>
        </div>
      )}
    </div>
  )
}
