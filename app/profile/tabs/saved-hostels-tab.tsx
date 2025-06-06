"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, MapPin, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSavedHostels, removeHostel } from "@/lib/savedHostels"
import { hostels } from "@/data/hostels"

export default function SavedHostelsTab({ userId }: { userId: string }) {
  const [savedHostels, setSavedHostels] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<number | null>(null)

  useEffect(() => {
    const fetchSavedHostels = async () => {
      if (!userId) return

      const { savedHostels, error } = await getSavedHostels(userId)
      if (!error) {
        setSavedHostels(savedHostels)
      }
      setLoading(false)
    }

    fetchSavedHostels()
  }, [userId])

  const handleRemoveHostel = async (hostelId: number) => {
    setRemoving(hostelId)
    const { success } = await removeHostel(userId, hostelId)
    if (success) {
      setSavedHostels((prev) => prev.filter((id) => id !== hostelId))
    }
    setRemoving(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (savedHostels.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You haven't saved any hostels yet.</p>
        <Button asChild>
          <Link href="/hostels">Browse Hostels/PGs</Link>
        </Button>
      </div>
    )
  }

  // Filter hostels data to only include saved hostels
  const savedHostelsData = hostels.filter((hostel) => savedHostels.includes(hostel.id))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                <Link href={`/hostels/${hostel.id}`}>
                  <ExternalLink className="h-4 w-4" />
                  View Details
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleRemoveHostel(hostel.id)}
                disabled={removing === hostel.id}
              >
                {removing === hostel.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span className="ml-1">Remove</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
