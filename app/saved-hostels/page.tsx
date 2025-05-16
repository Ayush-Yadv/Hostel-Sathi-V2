"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Loader2, MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSavedHostels, removeHostel } from "@/lib/savedHostels"
import { hostels } from "@/data/hostels"
import { onAuthChange } from "@/lib/auth"
import CommonNavbar from "@/components/common-navbar"

export default function SavedHostelsPage() {
  const [user, setUser] = useState<any>(null)
  const [savedHostels, setSavedHostels] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
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
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link href="/profile">
              <User className="h-4 w-4" />
              View Profile
            </Link>
          </Button>
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
    </div>
  )
}
