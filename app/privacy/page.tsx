"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import CommonNavbar from "@/components/common-navbar"
import CommonFooter from "@/components/common-footer"
import MobileNav from "@/components/mobile-nav"
import WhatsAppButton from "@/components/whatsapp-button"

export default function PrivacyPolicyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loggedInStatus = localStorage.getItem("isLoggedIn")
    if (loggedInStatus === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <CommonNavbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#5A00F0] to-[#B366FF] py-12 px-4 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-lg opacity-90">Last Updated: May 15, 2023</p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-[#5A00F0] mb-4">Introduction</h2>
              <p className="mb-4">
                At Hostel Sathi, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p className="mb-6">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
                please do not access the site.
              </p>

              <h2 className="text-2xl font-bold text-[#5A00F0] mb-4">Information We Collect</h2>
              <p className="mb-4">We may collect information about you in a variety of ways including:</p>
              <ul className="list-disc pl-6 mb-6">
                <li className="mb-2">
                  <strong>Personal Data:</strong> Voluntarily provided information which may include your name, email
                  address, phone number, etc., which may be necessary for providing services or improving your
                  experience.
                </li>
                <li className="mb-2">
                  <strong>Derivative Data:</strong> Information our servers automatically collect when you access our
                  platform, such as your IP address, browser type, operating system, access times, and the pages you
                  have viewed.
                </li>
                <li className="mb-2">
                  <strong>Financial Data:</strong> Information related to your payment method when you make a
                  transaction on our platform, such as credit card details, bank account information, etc.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[#5A00F0] mb-4">How We Use Your Information</h2>
              <p className="mb-4">We may use the information we collect about you for various purposes, including:</p>
              <ul className="list-disc pl-6 mb-6">
                <li className="mb-2">To provide and maintain our services</li>
                <li className="mb-2">To notify you about changes to our services</li>
                <li className="mb-2">To allow you to participate in interactive features of our platform</li>
                <li className="mb-2">To provide customer support</li>
                <li className="mb-2">To gather analysis or valuable information to improve our services</li>
                <li className="mb-2">To monitor the usage of our services</li>
                <li className="mb-2">To detect, prevent and address technical issues</li>
                <li className="mb-2">To fulfill any other purpose for which you provide it</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#5A00F0] mb-4">Disclosure of Your Information</h2>
              <p className="mb-4">We may share information we have collected about you in certain situations:</p>
              <ul className="list-disc pl-6 mb-6">
                <li className="mb-2">
                  <strong>Business Transfers:</strong> If we or our subsidiaries are involved in a merger, acquisition,
                  or sale of all or a portion of our assets.
                </li>
                <li className="mb-2">
                  <strong>Third-Party Service Providers:</strong> We may share your information with third-party service
                  providers to perform services on our behalf.
                </li>
                <li className="mb-2">
                  <strong>Legal Requirements:</strong> If required to do so by law or in response to valid requests by
                  public authorities.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[#5A00F0] mb-4">Security of Your Information</h2>
              <p className="mb-6">
                We use administrative, technical, and physical security measures to help protect your personal
                information. While we have taken reasonable steps to secure the personal information you provide to us,
                please be aware that despite our efforts, no security measures are perfect or impenetrable, and no
                method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>

              <h2 className="text-2xl font-bold text-[#5A00F0] mb-4">Contact Us</h2>
              <p className="mb-4">If you have questions or concerns about this Privacy Policy, please contact us at:</p>
              <p className="mb-6">
                <strong>Email:</strong> ayush@hostelsathi.com
                <br />
                <strong>Phone:</strong> +91 9499459310
                <br />
                <strong>Address:</strong> Knowledge Park, Greater Noida, Uttar Pradesh 201310
              </p>
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
