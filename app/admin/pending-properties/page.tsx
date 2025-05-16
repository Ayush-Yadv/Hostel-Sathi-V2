"use client"
import type { User } from "firebase/auth"
import { useState, useEffect, SetStateAction } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Check,
  X,
  Loader2,
  Building2,
  MapPin,
  Users,
  Calendar,
  Phone,
  Mail,
  Wifi,
  Utensils,
  Shield,
  Bed,
  AlertTriangle,
} from "lucide-react"
import { onAuthChange, checkIsAdmin } from "@/lib/auth"
import { getPendingProperties, approveProperty, rejectProperty, PropertyData} from "@/lib/propertyListings"

export default function PendingPropertiesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in using Firebase Auth
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        // Check if the user is an admin
        const adminStatus = await checkIsAdmin(currentUser.uid)
        setIsAdmin(adminStatus)

        if (adminStatus) {
          // Only fetch properties if user is an admin
          fetchPendingProperties()
        }
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const fetchPendingProperties = async () => {
    try {
      setLoading(true)
      const { properties, error } = await getPendingProperties()

      if (error) {
        setError("Failed to fetch pending properties")
        console.error("Error fetching pending properties:", error)
        return
      }

      setProperties(properties)
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Error in fetchPendingProperties:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (propertyId: string) => {
    try {
      setActionLoading(true)
      const { success, error } = await approveProperty(propertyId)

      if (error) {
        setError("Failed to approve property")
        console.error("Error approving property:", error)
        return
      }

      if (success) {
        // Refresh the list
        fetchPendingProperties()
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Error in handleApprove:", err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (propertyId: string) => {
    try {
      setActionLoading(true)
      const { success, error } = await rejectProperty(propertyId)

      if (error) {
        setError("Failed to reject property")
        console.error("Error rejecting property:", error)
        return
      }

      if (success) {
        // Refresh the list
        fetchPendingProperties()
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Error in handleReject:", err)
    } finally {
      setActionLoading(false)
    }
  }

  const viewPropertyDetails = (property: PropertyData ) => {
    setSelectedProperty(property)
  }

  const closePropertyDetails = () => {
    setSelectedProperty(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#5A00F0]" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    )
  }

  // Check if the user is an admin
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertTriangle size={64} className="text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          You need to have admin privileges to access this page. Please contact the system administrator if you believe
          you should have access.
        </p>
        <Link
          href="/"
          className="bg-[#8300FF] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#7000DD] transition"
        >
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center">
          <Link href="/" className="text-[#5A00F0] mr-2">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center">
            <div className="rounded-full bg-[#5A00F0] w-10 h-10 flex items-center justify-center">
              <span className="text-white font-bold text-lg">HS</span>
            </div>
            <h1 className="ml-2 text-lg font-bold">Admin Dashboard</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Pending Property Approvals</h1>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

          {properties.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Building2 size={64} className="mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-bold mb-2">No Pending Properties</h2>
              <p className="text-gray-500">There are no properties waiting for approval at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    {property.images && property.images.length > 0 ? (
                      <Image
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.propertyName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <Building2 size={48} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-[#5A00F0] text-white px-3 py-1 rounded-full uppercase text-sm font-medium">
                        {property.propertyType}
                      </span>
                      <span
                        className={`text-white px-3 py-1 rounded-full uppercase text-sm font-medium ${
                          property.gender === "boys"
                            ? "bg-blue-500"
                            : property.gender === "girls"
                              ? "bg-pink-500"
                              : "bg-purple-500"
                        }`}
                      >
                        {property.gender}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{property.propertyName}</h2>
                    <div className="flex items-center mb-3">
                      <MapPin size={16} className="text-gray-500 mr-1" />
                      <span className="text-gray-500 text-sm">{property.address}</span>
                    </div>
                    <div className="flex items-center mb-3">
                      <Calendar size={16} className="text-gray-500 mr-1" />
                      <span className="text-gray-500 text-sm">
                        Submitted: {new Date(property.createdAt?.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.amenitiesList?.slice(0, 3).map((amenity: string, index: number) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {amenity === "WiFi" && <Wifi size={12} className="inline mr-1" />}
                          {amenity === "Mess" && <Utensils size={12} className="inline mr-1" />}
                          {amenity === "Security" && <Shield size={12} className="inline mr-1" />}
                          {amenity}
                        </span>
                      ))}
                      {property.amenitiesList?.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          +{property.amenitiesList.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-[#5A00F0]">₹{property.monthlyRent}</span>
                        <span className="text-gray-500 text-sm">/month</span>
                      </div>
                      <button
                        onClick={() => viewPropertyDetails(property)}
                        className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition"
                      >
                        View Details
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(property.id)}
                        disabled={actionLoading}
                        className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition flex items-center justify-center"
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check size={18} />}
                        <span className="ml-1">Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(property.id)}
                        disabled={actionLoading}
                        className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition flex items-center justify-center"
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X size={18} />}
                        <span className="ml-1">Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedProperty.propertyName}</h2>
                <button onClick={closePropertyDetails} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              {/* Property Images */}
              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <div className="mb-6">
                  <div className="relative h-64 mb-2">
                    <Image
                      src={selectedProperty.images[0] || "/placeholder.svg"}
                      alt={selectedProperty.propertyName}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  {selectedProperty.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedProperty.images.slice(1).map((image:string, index: number) => (
                        <div key={index} className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${selectedProperty.propertyName} - Image ${index + 2}`}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Property Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Building2 size={18} className="text-[#5A00F0] mr-2" />
                      <span>
                        {selectedProperty.propertyType === "hostel" ? "Hostel" : "Paying Guest (PG)"} for{" "}
                        {selectedProperty.gender === "boys"
                          ? "Boys"
                          : selectedProperty.gender === "girls"
                            ? "Girls"
                            : "Boys & Girls"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={18} className="text-[#5A00F0] mr-2" />
                      <span>
                        {selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state} -{" "}
                        {selectedProperty.pincode}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Bed size={18} className="text-[#5A00F0] mr-2" />
                      <span>₹{selectedProperty.monthlyRent} per month</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Owner Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Users size={18} className="text-[#5A00F0] mr-2" />
                      <span>{selectedProperty.ownerName}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={18} className="text-[#5A00F0] mr-2" />
                      <span>{selectedProperty.contactNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={18} className="text-[#5A00F0] mr-2" />
                      <span>{selectedProperty.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{selectedProperty.description}</p>
              </div>

              {/* Amenities */}
              {selectedProperty.amenitiesList && selectedProperty.amenitiesList.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedProperty.amenitiesList.map((amenity:string, index:number) => (
                      <div key={index} className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Types */}
              {selectedProperty.roomTypesList && selectedProperty.roomTypesList.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Room Types</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProperty.roomTypesList.map((roomType:string, index:number) => (
                      <div key={index} className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span>{roomType}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Colleges */}
              {selectedProperty.nearbyColleges && selectedProperty.nearbyColleges.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Nearby Colleges</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.nearbyColleges.map((college:string, index:number) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {college}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    handleApprove(selectedProperty.id)
                    closePropertyDetails()
                  }}
                  disabled={actionLoading}
                  className="flex-1 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition flex items-center justify-center"
                >
                  {actionLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Check size={20} className="mr-2" />
                  )}
                  Approve Property
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedProperty.id)
                    closePropertyDetails()
                  }}
                  disabled={actionLoading}
                  className="flex-1 bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition flex items-center justify-center"
                >
                  {actionLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <X size={20} className="mr-2" />}
                  Reject Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
