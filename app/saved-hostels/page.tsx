"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Loader2, MapPin, User, Heart, Star, Wifi, Utensils, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSavedHostels, removeHostel, saveHostel as saveHostelToFirebase } from "@/lib/savedHostels"
import { hostels } from "@/data/hostels"
import { onAuthChange, getCurrentUser } from "@/lib/auth"
import CommonNavbar from "@/components/common-navbar"

export default function SavedHostelsPage() {
  const [user, setUser] = useState<any>(null)
  const [savedHostels, setSavedHostels] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollege, setSelectedCollege] = useState("")
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser)
      if (!authUser) {
        router.push("/auth/login?redirect=/saved-hostels")
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const fetchSavedHostels = async () => {
      if (!user) return

      const { savedHostels, error } = await getSavedHostels(user.uid)
      if (!error) {
        setSavedHostels(savedHostels)
      }
      setLoading(false)
    }

    if (user) {
      fetchSavedHostels()
    }
  }, [user])

  const handleRemoveHostel = async (hostelId: number) => {
    if (!user) return

    const { success } = await removeHostel(user.uid, hostelId)
    if (success) {
      setSavedHostels((prev) => prev.filter((id) => id !== hostelId))
    }
  }

  // Add toggleSaveHostel function
  const toggleSaveHostel = async (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  // Filter hostels data to only include saved hostels
  const savedHostelsData = hostels.filter((hostel) => savedHostels.includes(hostel.id))

  return (
    <div>
      {/* Header */}
      <CommonNavbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Saved Hostels/PGs</h1>
        </div>

        {savedHostelsData.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">No Saved Hostels Yet</h2>
            <p className="text-gray-500 mb-6">You haven't saved any hostels or PGs yet.</p>
            <Button asChild>
              <Link href="/hostels">Browse Hostels/PGs</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedHostelsData.map((hostel) => (
              <div
                key={hostel.id}
                className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <Image src={hostel.images[0] || "/placeholder.svg"} alt={hostel.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{hostel.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      ₹{hostel.price.toLocaleString()}/month
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{hostel.address}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/hostels/${hostel.id}`}>View Details</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveHostel(hostel.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Hostels and PGs Section */}
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels
            .filter(hostel => !savedHostels.includes(hostel.id))
            .slice(0, 5)
            .map((hostel) => (
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
      </div>
    </div>
  )
}
