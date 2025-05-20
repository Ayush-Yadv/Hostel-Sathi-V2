"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import CommonNavbar from "@/components/common-navbar"
import CommonFooter from "@/components/common-footer"
import WhatsAppButton from "@/components/whatsapp-button"
import MobileNav from "@/components/mobile-nav"
import { toast } from "sonner"

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  college: z.string().min(2, "College name must be at least 2 characters"),
  contact: z.string()
    .regex(/^(\+91|0)?[6789]\d{9}$/, "Please enter a valid Indian phone number")
    .transform((val) => (val.startsWith("+91") ? val : `+91${val}`)),
  message: z.string().min(10, "Message must be at least 10 characters")
})

type ContactFormData = z.infer<typeof contactFormSchema>

export default function ContactUsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      college: "",
      contact: "",
      message: ""
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true)

    try {
      // Add document to Firestore
      const docRef = await addDoc(collection(db, "contacts"), {
        ...data,
        createdAt: serverTimestamp(),
        status: "new",
        source: "contact_form"
      })

      console.log("Document written with ID: ", docRef.id)
      
      // Show success message
      toast.success("Form submitted successfully!")
      
      // Reset form
      reset()

      // Redirect to thank you page
      router.push("/contact-thank-you")
    } catch (error) {
      console.error("Error adding document: ", error)
      toast.error("Error submitting form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <CommonNavbar />

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

        {/* Contact Form Section */}
        <section className="py-12 px-4">
          <div className="max-w-md mx-auto">
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="bg-white rounded-lg shadow-md p-6 space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0] ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
                  Your College
                </label>
                <input
                  type="text"
                  id="college"
                  {...register("college")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0] ${
                    errors.college ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="College Name"
                />
                {errors.college && (
                  <p className="mt-1 text-sm text-red-500">{errors.college.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contact"
                  {...register("contact")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0] ${
                    errors.contact ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="9876543210"
                />
                {errors.contact && (
                  <p className="mt-1 text-sm text-red-500">{errors.contact.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  {...register("message")}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0] ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your message here..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#8300FF] text-white font-semibold py-3 rounded-md hover:bg-[#7000DD] transition flex items-center justify-center gap-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </section>
      </main>

      <CommonFooter />
      <WhatsAppButton />
      <MobileNav />
    </div>
  )
}
