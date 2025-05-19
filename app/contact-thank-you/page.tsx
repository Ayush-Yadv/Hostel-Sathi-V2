"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, ArrowLeft } from "lucide-react"
import CommonNavbar from "@/components/common-navbar"
import CommonFooter from "@/components/common-footer"
import WhatsAppButton from "@/components/whatsapp-button"
import MobileNav from "@/components/mobile-nav"

export default function ContactThankYouPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <CommonNavbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto py-16 px-4">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Contacting Us!</h1>
            
            <p className="text-lg text-gray-600 mb-8">
              We have received your message and will get back to you within 24 hours.
              In the meantime, feel free to explore more hostels in Greater Noida.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#5A00F0] text-white font-semibold rounded-md hover:bg-[#4800C0] transition"
              >
                <ArrowLeft size={20} />
                Back to Home
              </Link>
              
              <Link
                href="/hostels"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#5A00F0] font-semibold rounded-md border-2 border-[#5A00F0] hover:bg-[#5A00F0] hover:text-white transition"
              >
                Explore Hostels
              </Link>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our team is available round the clock to assist you with any urgent queries.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Quick Response</h3>
              <p className="text-gray-600">
                We aim to respond to all inquiries within 24 hours of receiving them.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-600">
                Follow us on social media for the latest updates about hostels in Greater Noida.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <CommonFooter />

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
