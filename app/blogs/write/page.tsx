"use client"

import { ChangeEvent } from "react"
import { User } from "firebase/auth"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, ImageIcon, Loader2 } from "lucide-react"
import { onAuthChange } from "@/lib/auth"
import { submitBlog } from "@/lib/blogs"
import CommonNavbar from "@/components/common-navbar"
import CommonFooter from "@/components/common-footer"
import MobileNav from "@/components/mobile-nav"
import WhatsAppButton from "@/components/whatsapp-button"
import { any } from "zod"

export default function WriteBlogPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    category: "Student Life",
  })

  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = onAuthChange((currentUser) => {
      setIsLoggedIn(!!currentUser)
      setUser(currentUser)

      if (!currentUser) {
        // Redirect to login if not logged in
        router.push("/auth/login")
      }

      setLoading(false)
    })

    return unsubscribe
  }, [router])

 

const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target
  setBlogData((prev) => ({
    ...prev,
    [name]: value,
  }))
}


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    setCoverImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setCoverImagePreview(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }
}

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    try {
      if (!blogData.title.trim()) {
        throw new Error("Please enter a title for your blog")
      }

      if (!blogData.content.trim()) {
        throw new Error("Please enter content for your blog")
      }

      if (!coverImage) {
        throw new Error("Please upload a cover image for your blog")
      }

      if (!user) {
        throw new Error("Please give author details")
      }

      const { success, blogId, error } = await submitBlog(
        {
          ...blogData,
          authorId: user.uid,
          authorName: user.displayName || user.email || "Anonymous",
          authorPhoto: user.photoURL || null,
        },
        coverImage,
      )

      if (error) {
        throw new Error(error.message || "Failed to submit blog")
      }

      if (success) {
        setSuccess("Blog submitted successfully!")
        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/blogs/${blogId}`)
        }, 1500)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
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
      {/* Navbar */}
      <CommonNavbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center">
            <Link href="/blogs" className="text-[#5A00F0] mr-4">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Write a Blog</h1>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={blogData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                placeholder="Enter a catchy title"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={blogData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                required
              >
                <option value="Student Life">Student Life</option>
                <option value="Accommodation Tips">Accommodation Tips</option>
                <option value="College Experience">College Experience</option>
                <option value="Budget Living">Budget Living</option>
                <option value="City Guide">City Guide</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image*
              </label>
              <div className="flex items-center">
                <label
                  htmlFor="coverImage"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white hover:bg-gray-50"
                >
                  <ImageIcon size={18} className="mr-2" />
                  <span>Upload Image</span>
                  <input type="file" id="coverImage" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {coverImagePreview && (
                  <div className="ml-4">
                    <img
                      src={coverImagePreview || "/placeholder.svg"}
                      alt="Cover preview"
                      className="h-16 w-24 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Recommended size: 1200 x 630 pixels</p>
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Content*
              </label>
              <textarea
                id="content"
                name="content"
                value={blogData.content}
                onChange={handleChange}
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                placeholder="Write your blog content here..."
                required
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`bg-[#8300FF] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#7000DD] transition flex items-center ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Publish Blog
                  </>
                )}
              </button>
            </div>
          </form>
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
