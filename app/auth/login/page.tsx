"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { signIn } from "@/lib/auth"
import type { ChangeEvent } from "react"
import { FormEvent } from "react"
import CommonNavbar from "@/components/common-navbar"
import CommonFooter from "@/components/common-footer"
import WhatsAppButton from "@/components/whatsapp-button"
import MobileNav from "@/components/mobile-nav"

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = [
  { email: "admin1@hostelsathi.com", password: "Admin@123" },
  { email: "admin2@hostelsathi.com", password: "Admin@123" },
  { email: "admin3@hostelsathi.com", password: "Admin@123" },
  { email: "admin4@hostelsathi.com", password: "Admin@123" },
  { email: "admin5@hostelsathi.com", password: "Admin@123" }
];

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/"
  const isAdminRedirect = redirectPath.includes("/admin/")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields")
      }

      if (isAdminRedirect) {
        // Check against hardcoded admin credentials
        const isValidAdmin = ADMIN_CREDENTIALS.some(
          admin => admin.email === formData.email && admin.password === formData.password
        )

        if (!isValidAdmin) {
          throw new Error("Invalid admin credentials")
        }

        // Set admin login status in session storage
        sessionStorage.setItem('isAdminLoggedIn', 'true')
        setSuccess("Successfully logged in as admin!")
        setTimeout(() => {
          router.push(redirectPath)
        }, 1000)
      } else {
        // Handle regular user login with Firebase
        const { user, error } = await signIn(formData.email, formData.password)

        if (error) {
          throw new Error(error instanceof Error ? error.message : "Failed to sign in")
        }

        if (user) {
          setSuccess("Successfully logged in!")
          setTimeout(() => {
            router.push(redirectPath)
          }, 1000)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <CommonNavbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
            {/* Back Button */}
            <div className="flex items-center">
              <Link href="/" className="text-[#5A00F0] hover:text-[#4800C0]">
                <ArrowLeft size={24} />
              </Link>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
            </div>

            {/* Admin Access Note */}
            {isAdminRedirect && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                <h3 className="text-sm font-semibold text-blue-800 mb-1">Admin Access Required</h3>
                <p className="text-xs text-blue-600 mb-2">
                  You're trying to access an admin page. Only authorized admin accounts can access this section.
                </p>
                <p className="text-xs text-blue-600 mb-1">Admin accounts (Password: Admin@123):</p>
                <ul className="text-xs list-disc list-inside text-blue-600">
                  <li>admin1@hostelsathi.com</li>
                  <li>admin2@hostelsathi.com</li>
                  <li>admin3@hostelsathi.com</li>
                  <li>admin4@hostelsathi.com</li>
                  <li>admin5@hostelsathi.com</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2">
                  <strong>Note:</strong> All admin accounts use the same password for simplicity.
                </p>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                {success}
              </div>
            )}

            {/* Form */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#5A00F0] focus:border-[#5A00F0]"
                    placeholder="you@example.com"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#5A00F0] focus:border-[#5A00F0]"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-sm text-[#5A00F0] hover:text-[#4800C0]">
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#5A00F0] hover:bg-[#4800C0]"
                  }`}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="font-medium text-[#5A00F0] hover:text-[#4800C0]">
                  Sign up here
                </Link>
              </p>
            </div>
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
