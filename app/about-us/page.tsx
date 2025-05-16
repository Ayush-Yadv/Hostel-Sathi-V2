"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MapPin, Phone, Mail, ChevronDown, ChevronUp } from "lucide-react"

export default function AboutUsPage() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

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

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "What is Hostel Sathi?",
      answer:
        "Hostel Sathi is a platform that helps students find affordable and quality hostels and PGs near their colleges. We verify all listings to ensure they meet our standards for safety, cleanliness, and amenities.",
    },
    {
      question: "How do I find a hostel on Hostel Sathi?",
      answer:
        "You can search for hostels by selecting your college from the dropdown menu on our homepage or by browsing through our listings. You can filter results by type (hostel or PG), gender preference, and other criteria.",
    },
    {
      question: "Is there a fee for using Hostel Sathi?",
      answer:
        "No, Hostel Sathi is completely free for students. We don't charge any brokerage or commission fees. Our goal is to make the hostel-finding process as easy and affordable as possible.",
    },
    {
      question: "How do I list my property on Hostel Sathi?",
      answer:
        "Property owners can list their hostels or PGs by clicking on the 'List Your Property' button on our website. You'll need to provide details about your property, including photos, amenities, and pricing.",
    },
    {
      question: "Are the hostels on Hostel Sathi verified?",
      answer:
        "Yes, all hostels and PGs listed on Hostel Sathi are verified by our team. We ensure that they meet our standards for safety, cleanliness, and amenities before they are listed on our platform.",
    },
  ]

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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">About Hostel Sathi</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Connecting students with their perfect accommodation since 2023
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-1 p-8">
                  <h2 className="text-2xl font-bold mb-4 text-[#5A00F0]">Our Story</h2>
                  <p className="text-gray-600 mb-4">
                    Hostel Sathi was born out of a simple observation: finding good accommodation near colleges is
                    unnecessarily difficult and stressful for students.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Our founder, a former student who struggled to find decent housing, decided to create a solution
                    that would make the process easier, more transparent, and completely free of brokerage fees.
                  </p>
                  <p className="text-gray-600">
                    Today, Hostel Sathi has grown into a trusted platform that connects thousands of students with
                    quality hostels and PGs across Greater Noida and beyond.
                  </p>
                </div>
                <div className="md:flex-1 bg-gray-200 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Hostel Sathi Team"
                    width={400}
                    height={400}
                    className="object-cover h-full w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8 text-[#5A00F0]">Our Mission</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-[#5A00F0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#5A00F0] text-2xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Connect</h3>
                <p className="text-gray-600">
                  Connect students with verified, quality accommodation options near their colleges
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-[#5A00F0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#5A00F0] text-2xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Simplify</h3>
                <p className="text-gray-600">Make the hostel-finding process simple, transparent, and stress-free</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-[#5A00F0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#5A00F0] text-2xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Support</h3>
                <p className="text-gray-600">
                  Support students throughout their accommodation journey with responsive service
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-[#5A00F0]">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    className="w-full flex justify-between items-center p-4 text-left font-medium focus:outline-none"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="text-[#5A00F0]" />
                    ) : (
                      <ChevronDown className="text-[#5A00F0]" />
                    )}
                  </button>
                  <div className={`px-4 pb-4 ${expandedFaq === index ? "block" : "hidden"}`}>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-[#5A00F0]">Get in Touch</h2>
            <div className="bg-gray-50 rounded-xl shadow-md p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="text-[#5A00F0] mt-1 mr-3" />
                      <p className="text-gray-600">
                        123 College Road, Knowledge Park
                        <br />
                        Greater Noida, Uttar Pradesh 201310
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="text-[#5A00F0] mr-3" />
                      <p className="text-gray-600">+91 98765 43210</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="text-[#5A00F0] mr-3" />
                      <p className="text-gray-600">info@hostelsathi.com</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/contact-us"
                      className="inline-block bg-[#5A00F0] text-white px-6 py-3 rounded-md font-medium hover:bg-[#4800C0] transition"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
                <div className="h-64 md:h-auto bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Office Location"
                    width={400}
                    height={300}
                    className="object-cover h-full w-full"
                  />
                </div>
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
