"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, ArrowRight, Edit, Loader2 } from "lucide-react"
import { onAuthChange } from "@/lib/auth"
import { getAllBlogs, type Blog} from "@/lib/blogs"
import CommonNavbar from "@/components/common-navbar"
import CommonFooter from "@/components/common-footer"
import MobileNav from "@/components/mobile-nav"
import WhatsAppButton from "@/components/whatsapp-button"

export default function BlogsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = onAuthChange((user) => {
      setIsLoggedIn(!!user)
    })

    // Fetch blogs
    const fetchBlogs = async () => {
      try {
        const { blogs, error } = await getAllBlogs(20)
        if (error) {
          throw new Error(error)
        }
        setBlogs(blogs)
      } catch (err) {
        setError("Failed to load blogs. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()

    return unsubscribe
  }, [])

  // Format date
  const formatDate = (date : string | number | Date | null | undefined): string  => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <CommonNavbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#5A00F0] to-[#B366FF] py-16 px-4 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Hostel Sathi Blog</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Insights, tips, and stories about student accommodation
            </p>
            {isLoggedIn && (
              <Link
                href="/blogs/write"
                className="mt-6 inline-flex items-center bg-white text-[#5A00F0] px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
              >
                <Edit size={18} className="mr-2" />
                Write a Blog
              </Link>
            )}
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#5A00F0]" />
                <span className="ml-2 text-lg">Loading blogs...</span>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">No blogs yet</h2>
                <p className="text-gray-600 mb-6">Be the first to share your experience!</p>
                {isLoggedIn && (
                  <Link
                    href="/blogs/write"
                    className="inline-flex items-center bg-[#5A00F0] text-white px-6 py-3 rounded-md font-medium hover:bg-[#4800C0] transition"
                  >
                    <Edit size={18} className="mr-2" />
                    Write a Blog
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {blogs.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="h-48 md:h-64 relative">
                      <Image
                        src={post.coverImage || "/placeholder.svg?height=400&width=600"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-[#5A00F0] text-white text-xs px-3 py-1 rounded-full">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <Calendar size={14} className="mr-1" />
                        <span className="mr-4">{formatDate(post.createdAt)}</span>
                        <User size={14} className="mr-1" />
                        <span>{post.authorName || "Anonymous"}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-[#5A00F0]">{post.title}</h3>
                      <p className="text-gray-600 mb-4">
                        {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                      </p>
                      <Link
                        href={`/blogs/${post.id}`}
                        className="inline-flex items-center text-[#5A00F0] font-medium hover:underline"
                      >
                        Read More <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
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
