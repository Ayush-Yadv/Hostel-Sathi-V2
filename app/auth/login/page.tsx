"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { signIn } from "@/lib/auth"
import type { ChangeEvent } from "react"
import { FormEvent } from "react"
import CommonNavbar from "@/components/common-navbar"
import CommonFooter from "@/components/common-footer"
import WhatsAppButton from "@/components/whatsapp-button"
import MobileNav from "@/components/mobile-nav"
import Image from "next/image"

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = [
  { email: "admin1@hostelsathi.com", password: "Admin@123" },
  { email: "admin2@hostelsathi.com", password: "Admin@123" },
  { email: "admin3@hostelsathi.com", password: "Admin@123" },
  { email: "admin4@hostelsathi.com", password: "Admin@123" },
  { email: "admin5@hostelsathi.com", password: "Admin@123" }
]

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordActive, setIsPasswordActive] = useState(false)
  const [isCartoonHovered, setIsCartoonHovered] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Check if it's an admin login
      const isAdmin = ADMIN_CREDENTIALS.some(
        (admin) => admin.email === email && admin.password === password
      )

      if (isAdmin) {
        // Handle admin login
        const result = await signIn(email, password)
        if (result.user) {
          router.push("/admin/dashboard")
        } else {
          setError(typeof result.error === "string" ? result.error : "Failed to login as admin")
        }
      } else {
        // Handle regular user login
        const result = await signIn(email, password)
        if (result.user) {
          const redirectTo = searchParams.get("redirectTo") || "/"
          router.push(redirectTo)
        } else {
          setError(typeof result.error === "string" ? result.error : "Invalid email or password")
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1A0D2F]">
      {/* Header */}
      <CommonNavbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Cartoon Character Animation */}
          <div
            className="relative flex flex-col items-center mb-8"
            onMouseEnter={() => setIsCartoonHovered(true)}
            onMouseLeave={() => setIsCartoonHovered(false)}
          >
            {/* Cartoon SVG (placeholder.svg for now) with round border */}
            <div
              className="w-32 h-32 flex items-center justify-center sway-animation rounded-full overflow-hidden bg-[#c19a6b]"
              style={{ position: "relative" }}
            >
              <Image
                src="/placeholder.svg"
                alt="Cartoon Character"
                width={128}
                height={128}
                className="select-none"
                draggable={false}
                priority
              />
              {/* Eyes and Smile Logic */}
              {isPasswordActive ? (
                // Eyes closed, smile visible when password is active
                <>
                  <div className="absolute left-1/2 top-[48%] -translate-x-1/2 flex gap-6">
                    <div className="w-6 h-0.5 bg-black rounded-full" />
                    <div className="w-6 h-0.5 bg-black rounded-full" />
                  </div>
                  <div className="absolute left-1/2 top-[60%] -translate-x-1/2">
                    <svg width="36" height="16" viewBox="0 0 36 16">
                      <path d="M2 2 Q18 18 34 2" stroke="#222" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                </>
              ) : isCartoonHovered ? (
                // Eyes closed, no smile on hover
                <div className="absolute left-1/2 top-[48%] -translate-x-1/2 flex gap-6">
                  <div className="w-6 h-0.5 bg-black rounded-full" />
                  <div className="w-6 h-0.5 bg-black rounded-full" />
                </div>
              ) : (
                <>
                  {/* Eyes open by default */}
                  <div className="absolute left-1/2 top-[44%] -translate-x-1/2 flex gap-6">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-black flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-black flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                  </div>
                  {/* Smile by default */}
                  <div className="absolute left-1/2 top-[60%] -translate-x-1/2">
                    <svg width="36" height="16" viewBox="0 0 36 16">
                      <path d="M2 2 Q18 18 34 2" stroke="#222" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                </>
              )}
              {/* Blue theme cover slides down further to fully cover the eyes when password is active */}
              <div
                className={`absolute left-0 z-20 transition-transform duration-500 pointer-events-none`}
                style={{
                  top: 0,
                  width: "100%",
                  height: "70%", // covers eyes and a bit more
                  background: "#5A00F0",
                  borderRadius: "1rem 1rem 50% 50%/1.5rem 1.5rem 100% 100%",
                  transform: isPasswordActive ? "translateY(0%)" : "translateY(-100%)",
                  opacity: isPasswordActive ? 0.95 : 0,
                }}
              />
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
              <p className="mt-2 text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-[#5A00F0] hover:text-[#4800C0]">
                  Create Account
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              autoComplete="off"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0] focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-[#5A00F0] hover:text-[#4800C0]">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setPassword(e.target.value)
                      setIsPasswordActive(e.target.value.length > 0)
                    }}
                    required
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0] focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5A00F0] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#4800C0] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
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

      <style jsx global>{`
        .sway-animation {
          animation: sway 2.5s ease-in-out infinite alternate;
        }
        @keyframes sway {
          0% { transform: translateX(-8px) rotate(-2deg); }
          100% { transform: translateX(8px) rotate(2deg); }
        }
      `}</style>
    </div>
  )
}
