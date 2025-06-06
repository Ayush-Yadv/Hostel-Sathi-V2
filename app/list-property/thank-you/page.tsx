"use client"

import Link from "next/link"
import { CheckCircle, Home, ArrowRight } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-[#5A00F0]/10 via-[#9747FF]/10 to-[#f5eeff]/10">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-green-500" />
          </div>

          <h1 className="text-2xl font-bold mb-4">Thank You!</h1>

          <p className="text-gray-600 mb-6">
            Your property listing request has been submitted successfully. Our team will review your information and get
            back to you shortly.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="font-semibold text-gray-700 mb-2">What happens next?</h2>
            <ol className="text-left text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="bg-[#5A00F0] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  1
                </span>
                <span>Our team will review your property details</span>
              </li>
              <li className="flex items-start">
                <span className="bg-[#5A00F0] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  2
                </span>
                <span>We may contact you for additional information or to schedule a visit</span>
              </li>
              <li className="flex items-start">
                <span className="bg-[#5A00F0] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  3
                </span>
                <span>Once approved, your property will be listed on our platform</span>
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              // className="block w-full bg-[#8300FF] text-white font-semibold py-3 rounded-md hover:bg-[#7000DD] transition flex items-center justify-center gap-2"
              className="w-full bg-[#8300FF] text-white font-semibold py-3 rounded-md hover:bg-[#7000DD] transition flex items-center justify-center gap-2"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/list-property"
              // className="block w-full bg-white text-[#5A00F0] font-semibold py-3 rounded-md border border-[#5A00F0] hover:bg-[#5A00F0]/5 transition flex items-center justify-center gap-2"
              className="w-full bg-white text-[#5A00F0] font-semibold py-3 rounded-md border border-[#5A00F0] hover:bg-[#5A00F0]/5 transition flex items-center justify-center gap-2"
            >
              <span>List Another Property</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A0D2F] text-white p-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="rounded-full bg-white w-10 h-10 flex items-center justify-center">
              <span className="text-[#5A00F0] font-bold text-lg">HS</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Hostel Sathi</h3>
              <p className="text-sm italic">Your secret home</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-400">© 2023 Hostel Sathi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
