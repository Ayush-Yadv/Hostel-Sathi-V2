"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone, Loader2 } from "lucide-react"
import { signUp, initRecaptchaVerifier, sendOTP, verifyOTP } from "@/lib/auth"
import type { ChangeEvent } from "react"
import { FormEvent } from "react"
import CommonNavbar from "@/components/common-navbar"
import CommonFooter from "@/components/common-footer"
import WhatsAppButton from "@/components/whatsapp-button"
import MobileNav from "@/components/mobile-nav"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    otp: "",
  })
  // We'll keep these state variables for internal tracking but use toast for display
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [isPasswordActive, setIsPasswordActive] = useState(false)
  const [isCartoonHovered, setIsCartoonHovered] = useState(false)

  const recaptchaContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

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

  const handleSendOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!formData.phoneNumber) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter your phone number",
        })
        throw new Error("Please enter your phone number")
      }

      // Format phone number to E.164 format
      let phoneNumber = formData.phoneNumber
      if (!phoneNumber.startsWith("+")) {
        phoneNumber = `+91${phoneNumber}` // Assuming India country code
      }

      // Initialize reCAPTCHA verifier
      if (!window.recaptchaVerifier) {
        try {
          console.log("Initializing reCAPTCHA verifier...");
          const { verifier, error } = initRecaptchaVerifier("recaptcha-container");
          
          if (error) {
            console.error("Failed to initialize reCAPTCHA:", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to initialize reCAPTCHA",
            });
            throw new Error("Failed to initialize reCAPTCHA");
          }
          
          console.log("reCAPTCHA verifier initialized successfully");
          window.recaptchaVerifier = verifier;
        } catch (error) {
          console.error("Exception initializing reCAPTCHA:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to initialize reCAPTCHA. Please refresh the page and try again.",
          });
          throw new Error("Failed to initialize reCAPTCHA");
        }
      } else {
        console.log("Using existing reCAPTCHA verifier");
      }

      const { success, error } = await sendOTP(phoneNumber)

      if (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to send OTP"
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        })
        throw new Error(errorMessage)
      }

      if (success) {
        setOtpSent(true)
        setSuccess("OTP sent successfully!")
        toast({
          title: "Success",
          description: "OTP sent successfully!",
        })
        setCountdown(30) // 30 seconds countdown for resend
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!formData.otp) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter the OTP",
        })
        throw new Error("Please enter the OTP")
      }

      const { success, user, error } = await verifyOTP(formData.otp)

      if (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to verify OTP"
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        })
        throw new Error(errorMessage)
      }

      if (success && user) {
        setPhoneVerified(true)
        setSuccess("Phone number verified successfully!")
        toast({
          title: "Success",
          description: "Phone number verified successfully!",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!phoneVerified) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please verify your phone number first",
        })
        throw new Error("Please verify your phone number first")
      }

      if (!formData.name || !formData.email || !formData.password || !formData.phoneNumber) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all fields",
        })
        throw new Error("Please fill in all fields")
      }

      console.log("Submitting signup form with data:", {
        email: formData.email,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        // Don't log password for security
      });
      
      const { user, error } = await signUp(formData.email, formData.password, formData.name, formData.phoneNumber)

      if (error) {
        // Handle specific Firebase errors
        let errorMessage = "Failed to sign up"
        
        if (error instanceof Error) {
          errorMessage = error.message
          console.error("Signup error:", error);
          
          // Check for specific Firebase error codes
          if (error.message.includes("auth/email-already-in-use")) {
            errorMessage = "This email is already registered. Please use a different email or login."
          } else if (error.message.includes("auth/invalid-email")) {
            errorMessage = "Invalid email format. Please enter a valid email address."
          } else if (error.message.includes("auth/weak-password")) {
            errorMessage = "Password is too weak. Please use a stronger password."
          } else if (error.message.includes("firestore")) {
            // If it's a Firestore error but auth succeeded, we can still proceed
            console.warn("Firestore error but continuing:", error);
            // Don't throw, just show a warning
            toast({
              variant: "default",
              title: "Account Created",
              description: "Your account was created but there was an issue saving some details. You can update them later.",
            });
            // Return early to avoid the error
            setTimeout(() => {
              router.push("/")
            }, 1000);
            return;
          }
        }
        
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: errorMessage,
        })
        
        throw new Error(errorMessage)
      }

      if (user) {
        setSuccess("Successfully signed up!")
        toast({
          title: "Success",
          description: "Your account has been created successfully!",
        })
        setTimeout(() => {
          router.push("/")
        }, 1000)
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

          {/* Back Button */}
          <div className="flex items-center">
            <Link href="/" className="text-[#5A00F0] hover:text-[#4800C0]">
              <ArrowLeft size={24} />
            </Link>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">Join Hostel Sathi today</p>
          </div>

          {/* We've replaced these with toast messages */}

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#5A00F0] focus:border-[#5A00F0]"
                  placeholder="John Doe"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#5A00F0] focus:border-[#5A00F0]"
                  placeholder="+91 1234567890"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {!otpSent && (
                <button
                  onClick={handleSendOTP}
                  disabled={loading || !formData.phoneNumber || countdown > 0}
                  className={`mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading || !formData.phoneNumber || countdown > 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#5A00F0] hover:bg-[#4800C0]"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : countdown > 0 ? (
                    `Resend OTP in ${countdown}s`
                  ) : (
                    "Send OTP"
                  )}
                </button>
              )}
            </div>

            {/* OTP Input */}
            {otpSent && !phoneVerified && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={formData.otp}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#5A00F0] focus:border-[#5A00F0]"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || !formData.otp}
                  className={`mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading || !formData.otp ? "bg-gray-400 cursor-not-allowed" : "bg-[#5A00F0] hover:bg-[#4800C0]"
                  }`}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify OTP"}
                </button>
              </div>
            )}

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
                  value={formData.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleChange(e)
                    setIsPasswordActive(e.target.value.length > 0)
                  }}
                  required
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

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !phoneVerified}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading || !phoneVerified ? "bg-gray-400 cursor-not-allowed" : "bg-[#5A00F0] hover:bg-[#4800C0]"
                }`}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-[#5A00F0] hover:text-[#4800C0]">
                Login here
              </Link>
            </p>
          </div>

          {/* reCAPTCHA Container */}
          <div id="recaptcha-container" ref={recaptchaContainerRef} className="mt-4 flex justify-center"></div>
        </div>
      </main>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Footer */}
      <CommonFooter />

      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Toast Messages */}
      <Toaster />

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