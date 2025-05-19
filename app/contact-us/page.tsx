"use client"

import { ChangeEvent } from "react";
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Phone, Mail, Send } from "lucide-react"
import CommonNavbar from "@/components/common-navbar"
import CommonFooter from "@/components/common-footer"
import WhatsAppButton from "@/components/whatsapp-button"
import MobileNav from "@/components/mobile-nav"
import ContactForm from "@/components/ui/contactform";

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
      <CommonNavbar />

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
        <ContactForm/>

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

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Footer */}
      <CommonFooter />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
