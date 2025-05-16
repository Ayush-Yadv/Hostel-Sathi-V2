"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import { signIn, signUp, signInWithGoogle, resetPassword, initRecaptchaVerifier, sendOTP, verifyOTP } from "@/lib/auth"
import type { ChangeEvent } from "react"
import { FormEvent } from "react";
import { MouseEvent } from "react";

// declare global {
//   interface Window {
//     recaptchaVerifier: any
//     confirmationResult: any
//   }
// }

// Somewhere in your types or at the top of your file
declare global {
  interface Window {
    recaptchaVerifier: any; // or the specific type of your recaptchaVerifier object
  }
}


export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [redirectPath, setRedirectPath] = useState("/")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    otp: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isPhoneAuth, setIsPhoneAuth] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isPhoneVerificationStep, setIsPhoneVerificationStep] = useState(false)

  const recaptchaContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get the redirect path from localStorage if it exists
    const storedRedirectPath = localStorage.getItem("redirectAfterLogin")
    if (storedRedirectPath) {
      setRedirectPath(storedRedirectPath)
    }
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const toggleView = () => {
    setIsLogin(!isLogin)
    setError("")
    setSuccess("")
    setIsForgotPassword(false)
    setIsPhoneAuth(false)
    setOtpSent(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleAuthMethod = () => {
    setIsPhoneAuth(!isPhoneAuth)
    setError("")
    setSuccess("")
    setOtpSent(false)
  }

  const handleChange = (e:  ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGoogleSignIn = async () => {
    setError("")
    setLoading(true)

    try {
      const { user, error } = await signInWithGoogle()

      if (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to sign in with Google");
      }

      if (user) {
        // Show success message
        setSuccess("Successfully signed in with Google!")

        // Redirect after a short delay
        setTimeout(() => {
          const path = redirectPath || "/"
          localStorage.removeItem("redirectAfterLogin") // Clear the stored path
          router.push(path)
        }, 1000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSendOTPForPhoneLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!formData.phoneNumber) {
        throw new Error("Please enter your phone number")
      }

      // Format phone number to E.164 format
      let phoneNumber = formData.phoneNumber
      if (!phoneNumber.startsWith("+")) {
        phoneNumber = `+91${phoneNumber}` // Assuming India country code
      }

      // Initialize reCAPTCHA verifier
      if (!window.recaptchaVerifier && recaptchaContainerRef.current) {
        const { verifier, error } = initRecaptchaVerifier("recaptcha-container")
        if (error) {
          throw new Error("Failed to initialize reCAPTCHA")
        }
      }

      // Send OTP
      //const { success, error } = await sendOTP(phoneNumber, window.recaptchaVerifier)
      const { success, error } = await sendOTP(phoneNumber)

      if (error) {
        throw new Error(error instanceof Error ? error.message :"Failed to send OTP")
      }

      if (success) {
        setOtpSent(true)
        setSuccess("OTP sent successfully!")
        setCountdown(30) // 30 seconds countdown for resend
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e:  ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!formData.otp) {
        throw new Error("Please enter the OTP")
      }

      const { user, error } = await verifyOTP(formData.otp)

      if (error) {
        throw new Error(error instanceof Error ? error.message :"Failed to verify OTP")
      }

      if (user) {
        // Show success message
        setSuccess("Successfully signed in!")

        // Redirect after a short delay
        setTimeout(() => {
          const path = redirectPath || "/"
          localStorage.removeItem("redirectAfterLogin") // Clear the stored path
          router.push(path)
        }, 1000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!formData.email) {
        throw new Error("Please enter your email address")
      }

      const { success, error } = await resetPassword(formData.email)

      if (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to send password reset email")
      }

      setSuccess("Password reset email sent! Please check your inbox.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
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
      if (isForgotPassword) {
        return handleForgotPassword(e)
      }

      if (isLogin) {
        // Handle login
        const { user, error } = await signIn(formData.email, formData.password)

        if (error) {
          throw new Error(error instanceof Error ? error.message :"Failed to sign in")
        }

        if (user) {
          // Show success message
          setSuccess("Successfully signed in!")

          // Redirect after a short delay
          setTimeout(() => {
            const path = redirectPath || "/"
            localStorage.removeItem("redirectAfterLogin") // Clear the stored path
            router.push(path)
          }, 1000)
        }
      } else {
        if (isPhoneVerificationStep) {
          if (otpSent) {
            // Verify OTP
            const { success, error } = await verifyOTP(formData.otp)

            if (error) {
              throw new Error(error instanceof Error ? error.message : "Failed to verify code")
            }

            if (success) {
              // Now complete the signup
              const { user, error } = await signUp(
                formData.email,
                formData.password,
                formData.name,
                formData.phoneNumber,
              )

              if (error) {
                throw new Error(error instanceof Error ? error.message : "Failed to sign up")
              }

              if (user) {
                setSuccess("Account created successfully! You are now logged in.")

                setTimeout(() => {
                  const path = redirectPath || "/"
                  localStorage.removeItem("redirectAfterLogin")
                  router.push(path)
                }, 1500)
              }
            }
          } else {
            // Send OTP
            const { success, error } = await sendOTP(formData.phoneNumber)

            if (error) {
              throw new Error(error instanceof Error ? error.message : "Failed to send verification code")
            }

            if (success) {
              setOtpSent(true)
              setSuccess("Verification code sent!")
              setCountdown(30) // 30 seconds countdown for resend
            }
          }
        } else {
          // Move to phone verification step
          setIsPhoneVerificationStep(true)
          setLoading(false)
          return
        }
      }
    } catch (err) { 
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword)
    setError("")
    setSuccess("")
    setIsPhoneAuth(false)
  }

  const handleSendOTP = async () => {
    setError("")
    setLoading(true)

    try {
      // Initialize reCAPTCHA verifier if not already initialized
      if (!window.recaptchaVerifier) {
        const { verifier, error } = initRecaptchaVerifier("recaptcha-container")
        if (error) {
          throw new Error("Failed to initialize reCAPTCHA")
        }
      }

      // Format phone number if needed
      let phoneNumber = formData.phoneNumber
      if (!phoneNumber.startsWith("+")) {
        phoneNumber = `+91${phoneNumber}` // Assuming India country code
      }

      // const { success, error } = await sendOTP(phoneNumber, window.recaptchaVerifier)
      const { success, error } = await sendOTP(phoneNumber)

      if (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to send OTP")
      }

      if (success) {
        setOtpSent(true)
        setSuccess("Verification code sent!")
        setCountdown(30) // 30 seconds countdown for resend
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const verifyOTPFunc = async (otp: string) => {
    try {
      const { user, error } = await verifyOTP(otp)
      if (error) {
        throw error
      }
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5A00F0] via-[#9747FF] to-[#f5eeff] flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="text-white inline-flex items-center">
          <ArrowLeft size={24} className="mr-2" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-[#5A00F0] w-16 h-16 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">HS</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">
            {isForgotPassword
              ? "Reset Your Password"
              : isPhoneAuth
                ? otpSent
                  ? "Enter OTP"
                  : "Login with Phone"
                : isLogin
                  ? "Welcome Back!"
                  : "Create an Account"}
          </h1>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isPhoneAuth ? (
              // Phone Authentication Form
              <>
                {!otpSent ? (
                  // Phone Number Input
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                    <div id="recaptcha-container" ref={recaptchaContainerRef} className="mt-4"></div>
                  </div>
                ) : (
                  // OTP Input
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter OTP sent to {formData.phoneNumber}
                    </label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                      placeholder="123456"
                      required
                    />
                    {countdown > 0 ? (
                      <p className="text-sm text-gray-500 mt-2">Resend OTP in {countdown} seconds</p>
                    ) : (
                      <button
                        type="button"
                        onClick={(e)=>handleSendOTPForPhoneLogin(e)}
                        className="text-sm text-[#5A00F0] hover:underline mt-2"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              // Email/Password Authentication Form
              <>
                {!isLogin && !isForgotPassword && !isPhoneVerificationStep && (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                          placeholder="+91 9876543210"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {isPhoneVerificationStep && (
                  <div>
                    <div className="mb-4 text-center">
                      <h3 className="text-lg font-medium">Verify Your Phone Number</h3>
                      <p className="text-sm text-gray-500">
                        {otpSent
                          ? `We've sent a verification code to ${formData.phoneNumber}`
                          : `We'll send a verification code to ${formData.phoneNumber}`}
                      </p>
                    </div>

                    {otpSent ? (
                      <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                          Enter Verification Code
                        </label>
                        <input
                          type="text"
                          id="otp"
                          name="otp"
                          value={formData.otp}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                          placeholder="123456"
                          required
                        />
                        {countdown > 0 ? (
                          <p className="text-sm text-gray-500 mt-2">Resend code in {countdown} seconds</p>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOTP}
                            className="text-sm text-[#5A00F0] hover:underline mt-2"
                          >
                            Resend code
                          </button>
                        )}
                      </div>
                    ) : (
                      <div
                        id="recaptcha-container"
                        ref={recaptchaContainerRef}
                        className="flex justify-center my-4"
                      ></div>
                    )}
                  </div>
                )}

                {!isForgotPassword && !isPhoneAuth && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                )}

                {isForgotPassword && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                )}

                {!isForgotPassword && !isPhoneAuth && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 pr-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
                        placeholder="••••••••"
                        required={!isForgotPassword}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {isLogin && !isForgotPassword && !isPhoneAuth && (
              <div className="flex justify-between">
                <button type="button" onClick={toggleForgotPassword} className="text-sm text-[#5A00F0] hover:underline">
                  Forgot password?
                </button>
                <button type="button" onClick={toggleAuthMethod} className="text-sm text-[#5A00F0] hover:underline">
                  Login with phone
                </button>
              </div>
            )}

            {isPhoneAuth && !otpSent && (
              <div className="flex justify-end">
                <button type="button" onClick={toggleAuthMethod} className="text-sm text-[#5A00F0] hover:underline">
                  Login with email
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#8300FF] text-white font-semibold py-3 rounded-md hover:bg-[#7000DD] transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? "Please wait..."
                : isForgotPassword
                  ? "Send Reset Link"
                  : isLogin
                    ? "Sign In"
                    : isPhoneVerificationStep
                      ? otpSent
                        ? "Verify Code"
                        : "Send Verification Code"
                      : "Continue"}
            </button>

            {/* Google Sign In Button */}
            {!isPhoneAuth && !isForgotPassword && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-3 rounded-md hover:bg-gray-50 transition"
                >
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </>
            )}
          </form>

          {!isForgotPassword && !isPhoneAuth && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button type="button" onClick={toggleView} className="ml-1 text-[#5A00F0] hover:underline font-medium">
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          )}

          {(isForgotPassword || isPhoneAuth) && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={isForgotPassword ? toggleForgotPassword : toggleAuthMethod}
                className="text-[#5A00F0] hover:underline font-medium"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {isPhoneVerificationStep && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsPhoneVerificationStep(false)}
                className="text-sm text-[#5A00F0] hover:underline"
              >
                Back to signup
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-white">
        <p className="text-sm">© 2023 Hostel Sathi. All rights reserved.</p>
      </footer>
    </div>
  )
}
