"use client"

import { ChangeEvent } from "react";
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Phone, Mail, Send } from "lucide-react"

export default function ContactUsPage() {
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleChange = (e:ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      router.push("/contact-thank-you")
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen">
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

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#5A00F0] to-[#B366FF] py-16 px-4 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              We're here to help with any questions or concerns
            </p>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#5A00F0]/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-[#5A00F0]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Our Location</h3>
                <p className="text-gray-600">
                  123 College Road, Knowledge Park
                  <br />
                  Greater Noida, Uttar Pradesh 201310
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#5A00F0]/10 rounded-full flex items-center justify-center mb-4">
                  <Phone className="text-[#5A00F0]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Phone Number</h3>
                <p className="text-gray-600">+91 98765 43210</p>
                <p className="text-gray-600 mt-1">Mon-Fri, 9am-6pm</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#5A00F0]/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="text-[#5A00F0]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Address</h3>
                <p className="text-gray-600">info@hostelsathi.com</p>
                <p className="text-gray-600 mt-1">We respond within 24 hours</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-[#5A00F0]">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl shadow-md p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                    placeholder="Your message here..."
                    required
                  ></textarea>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#8300FF] text-white font-semibold py-3 rounded-md hover:bg-[#7000DD] transition flex items-center justify-center gap-2 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Sending..." : "Send Message"} <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Map will be displayed here</p>
                {/* In a real implementation, you would embed a Google Map or similar here */}
              </div>
            </div>
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
          <p className="mt-6 text-sm text-gray-400">© 2023 Hostel Sathi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
