"use client"
import { User } from "firebase/auth"
import { useState, useEffect } from "react"
import type { ChangeEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  Upload,
  MapPin,
  Users,
  Bed,
  Wifi,
  Utensils,
  Shield,
  Power,
  Tv,
  Dumbbell,
  Library,
  ShowerHeadIcon as Shower,
  Loader2,
} from "lucide-react"
import { onAuthChange } from "@/lib/auth"
import { submitProperty } from "@/lib/propertyListings"
import CommonNavbar from "@/components/common-navbar"
import CommonFooter from "@/components/common-footer"
import WhatsAppButton from "@/components/whatsapp-button"
import MobileNav from "@/components/mobile-nav"

export default function ListPropertyPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    ownerName: "",
    contactNumber: "",
    email: "",
    propertyName: "",
    propertyType: "hostel", // hostel or pg
    gender: "boys", // boys, girls, or co-ed
    address: "",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    pincode: "",
    nearbyColleges: "",
    description: "",
    monthlyRent: "",
    amenities: {
      wifi: false,
      mess: false,
      security: false,
      powerBackup: false,
      tvLounge: false,
      gym: false,
      studyRoom: false,
      washingMachine: false,
      acRooms: false,
      attachedBathroom: false,
    },
    roomTypes: {
      single: false,
      double: false,
      triple: false,
      fourSharing: false,
    },
  })

  const [images, setImages] = useState<File[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in using Firebase Auth
    const unsubscribe = onAuthChange((currentUser: User | null) => {
      setUser(currentUser)

      if (currentUser) {
        // Pre-fill email if user is logged in
        setFormData((prev) => ({
          ...prev,
          email: currentUser.email || "",
        }))
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

   

const handleChange = (
  e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  if ("type" in e.target && e.target.type === "checkbox") {
    const inputTarget = e.target as HTMLInputElement;
    const checked = inputTarget.checked;

    if (name.startsWith("amenities.")) {
      const amenityName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        amenities: {
          ...prev.amenities,
          [amenityName]: checked,
        },
      }));
    } else if (name.startsWith("roomTypes.")) {
      const roomType = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        roomTypes: {
          ...prev.roomTypes,
          [roomType]: checked,
        },
      }));
    }
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};


  // const handleChange = (e:ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
  //   const { name, value, type, checked } = e.target

  //   if (type === "checkbox") {
  //     if (name.startsWith("amenities.")) {
  //       const amenityName = name.split(".")[1]
  //       setFormData({
  //         ...formData,
  //         amenities: {
  //           ...formData.amenities,
  //           [amenityName]: checked,
  //         },
  //       })
  //     } else if (name.startsWith("roomTypes.")) {
  //       const roomType = name.split(".")[1]
  //       setFormData({
  //         ...formData,
  //         roomTypes: {
  //           ...formData.roomTypes,
  //           [roomType]: checked,
  //         },
  //       })
  //     }
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     })
  //   }
  // }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setImages(files)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      // Check if at least 10 images are uploaded
      if (images.length < 10) {
        setError("Please upload at least 10 photos of your property")
        setSubmitting(false)
        return
      }

      // Format nearby colleges as an array
      const collegesArray = formData.nearbyColleges
        .split(",")
        .map((college) => college.trim())
        .filter((college) => college.length > 0)

      // Prepare data for submission
      const propertyData = {
        ...formData,
        nearbyColleges: collegesArray,
        ownerId: user ? user.uid : null,
        amenitiesList: Object.entries(formData.amenities)
          .filter(([_, value]) => value)
          .map(([key]) => {
            // Convert camelCase to readable format
            switch (key) {
              case "wifi":
                return "WiFi"
              case "tvLounge":
                return "TV Lounge"
              case "powerBackup":
                return "Power Backup"
              case "studyRoom":
                return "Study Room"
              case "washingMachine":
                return "Washing Machine"
              case "acRooms":
                return "AC Rooms"
              case "attachedBathroom":
                return "Attached Bathroom"
              default:
                return key.charAt(0).toUpperCase() + key.slice(1)
            }
          }),
        roomTypesList: Object.entries(formData.roomTypes)
          .filter(([_, value]) => value)
          .map(([key]) => {
            // Convert camelCase to readable format
            switch (key) {
              case "single":
                return "Single Room"
              case "double":
                return "Double Sharing"
              case "triple":
                return "Triple Sharing"
              case "fourSharing":
                return "Four Sharing"
              default:
                return key
            }
          }),
      }

      const { success, propertyId, error } = await submitProperty(propertyData, images)

      if (error) {
        throw new Error(error.message || "Failed to submit property")
      }

      if (success) {
        // Redirect to thank you page
        router.push("/list-property/thank-you")
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An error occurred while submitting your property")
      }
      console.error("Error submitting property:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#5A00F0]" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <CommonNavbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-30">
            <div className="flex items-center">
              <Link href="/" className="text-[#5A00F0] mr-2">
                <ArrowLeft size={24} />
              </Link>
              <Link href="/" className="flex items-center">
                <div className="rounded-full bg-[#5A00F0] w-10 h-10 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">HS</span>
                </div>
                <h1 className="ml-2 text-lg font-bold hidden md:block">Hostel Sathi</h1>
              </Link>
            </div>
          </header>

          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">List Your Property</h1>
              <p className="text-gray-600">Reach thousands of students looking for accommodation</p>
            </div>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Owner Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Users className="mr-2 text-[#5A00F0]" />
                  Owner Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Name*
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number*
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Property Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Building2 className="mr-2 text-[#5A00F0]" />
                  Property Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="propertyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Name*
                    </label>
                    <input
                      type="text"
                      id="propertyName"
                      name="propertyName"
                      value={formData.propertyName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type*
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      required
                    >
                      <option value="hostel">Hostel</option>
                      <option value="pg">Paying Guest (PG)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      For*
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      required
                    >
                      <option value="boys">Boys</option>
                      <option value="girls">Girls</option>
                      <option value="co-ed">Co-Ed</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Rent (₹)*
                    </label>
                    <input
                      type="number"
                      id="monthlyRent"
                      name="monthlyRent"
                      value={formData.monthlyRent}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <MapPin className="mr-2 text-[#5A00F0]" />
                  Property Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address*
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State*
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode*
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="nearbyColleges" className="block text-sm font-medium text-gray-700 mb-1">
                      Nearby Colleges (comma separated)
                    </label>
                    <input
                      type="text"
                      id="nearbyColleges"
                      name="nearbyColleges"
                      value={formData.nearbyColleges}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      placeholder="GCET, NIET, G L BAJAJ, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="wifi"
                      name="amenities.wifi"
                      checked={formData.amenities.wifi}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="wifi" className="ml-2 flex items-center text-sm text-gray-700">
                      <Wifi size={16} className="mr-1" /> WiFi
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="mess"
                      name="amenities.mess"
                      checked={formData.amenities.mess}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="mess" className="ml-2 flex items-center text-sm text-gray-700">
                      <Utensils size={16} className="mr-1" /> Mess/Food
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="security"
                      name="amenities.security"
                      checked={formData.amenities.security}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="security" className="ml-2 flex items-center text-sm text-gray-700">
                      <Shield size={16} className="mr-1" /> Security
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="powerBackup"
                      name="amenities.powerBackup"
                      checked={formData.amenities.powerBackup}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="powerBackup" className="ml-2 flex items-center text-sm text-gray-700">
                      <Power size={16} className="mr-1" /> Power Backup
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tvLounge"
                      name="amenities.tvLounge"
                      checked={formData.amenities.tvLounge}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="tvLounge" className="ml-2 flex items-center text-sm text-gray-700">
                      <Tv size={16} className="mr-1" /> TV Lounge
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="gym"
                      name="amenities.gym"
                      checked={formData.amenities.gym}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="gym" className="ml-2 flex items-center text-sm text-gray-700">
                      <Dumbbell size={16} className="mr-1" /> Gym
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="studyRoom"
                      name="amenities.studyRoom"
                      checked={formData.amenities.studyRoom}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="studyRoom" className="ml-2 flex items-center text-sm text-gray-700">
                      <Library size={16} className="mr-1" /> Study Room
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="washingMachine"
                      name="amenities.washingMachine"
                      checked={formData.amenities.washingMachine}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="washingMachine" className="ml-2 flex items-center text-sm text-gray-700">
                      Washing Machine
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="acRooms"
                      name="amenities.acRooms"
                      checked={formData.amenities.acRooms}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="acRooms" className="ml-2 flex items-center text-sm text-gray-700">
                      AC Rooms
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="attachedBathroom"
                      name="amenities.attachedBathroom"
                      checked={formData.amenities.attachedBathroom}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="attachedBathroom" className="ml-2 flex items-center text-sm text-gray-700">
                      <Shower size={16} className="mr-1" /> Attached Bathroom
                    </label>
                  </div>
                </div>
              </div>

              {/* Room Types */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Bed className="mr-2 text-[#5A00F0]" />
                  Room Types Available
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="single"
                      name="roomTypes.single"
                      checked={formData.roomTypes.single}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="single" className="ml-2 text-sm text-gray-700">
                      Single Room
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="double"
                      name="roomTypes.double"
                      checked={formData.roomTypes.double}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="double" className="ml-2 text-sm text-gray-700">
                      Double Sharing
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="triple"
                      name="roomTypes.triple"
                      checked={formData.roomTypes.triple}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="triple" className="ml-2 text-sm text-gray-700">
                      Triple Sharing
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fourSharing"
                      name="roomTypes.fourSharing"
                      checked={formData.roomTypes.fourSharing}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5A00F0] focus:ring-[#5A00F0] border-gray-300 rounded"
                    />
                    <label htmlFor="fourSharing" className="ml-2 text-sm text-gray-700">
                      Four Sharing
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                  placeholder="Describe your property, rules, facilities, etc."
                  required
                ></textarea>
              </div>

              {/* Images */}
              <div>
                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Images (Minimum 10 required) *
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB each)</p>
                      <p className="text-xs font-medium text-[#5A00F0] mt-1">Minimum 10 photos required</p>
                    </div>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="mt-2">
                    <p className={`text-sm ${images.length < 10 ? "text-red-500" : "text-green-600"}`}>
                      {images.length} files selected{" "}
                      {images.length < 10 ? `(${10 - images.length} more required)` : "(✓)"}
                    </p>
                    <ul className="mt-1 text-xs text-gray-500 list-disc list-inside max-h-32 overflow-y-auto">
                      {Array.from(images).map((image, index) => (
                        <li key={index}>{image.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full bg-[#8300FF] text-white font-semibold py-3 rounded-md hover:bg-[#7000DD] transition flex items-center justify-center ${
                    submitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Property"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
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
