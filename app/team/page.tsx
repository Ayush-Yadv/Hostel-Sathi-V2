"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Linkedin, Mail, Twitter } from "lucide-react"
import CommonFooter from "@/components/common-footer"
import MobileNav from "@/components/mobile-nav"
import WhatsAppButton from "@/components/whatsapp-button"
import CommonNavbar from "@/components/common-navbar"

export default function TeamPage() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Check if user is logged in from localStorage
    const loggedInStatus = localStorage.getItem("isLoggedIn")
    if (loggedInStatus === "true") {
      setIsLoggedIn(true)
    }

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const developerTeam = [
    {
      name: "Ayush Yadav",
      role: "Full Stack Developer & Co-founder",
      bio: "Ayush is a passionate full stack developer with expertise in React, Node.js, and database technologies. He co-founded Hostel Sathi to solve accommodation problems for students.",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Rohit Kumar",
      role: "Full Stack Developer & Co-founder",
      bio: "Rohit brings extensive experience in full stack development with a focus on UI/UX and performance optimization. He's committed to creating a seamless experience for Hostel Sathi users.",
      image: "/placeholder.svg?height=400&width=400",
    },
  ]

  const operationalTeam = [
    {
      name: "Bineet Singh Rathor",
      role: "Founder",
      bio: "Bineet founded Hostel Sathi with a vision to revolutionize how students find accommodation. He oversees the strategic direction and growth of the platform.",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Muskan Singh",
      role: "Marketing Director",
      bio: "Muskan leads all marketing initiatives at Hostel Sathi, from digital campaigns to partnerships with colleges and universities across the region.",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Harshit Singh",
      role: "Co-founder & Operations Lead",
      bio: "Harshit manages the day-to-day operations of Hostel Sathi, ensuring that both students and property owners have a seamless experience on our platform.",
      image: "/placeholder.svg?height=400&width=400",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <CommonNavbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#5A00F0] to-[#B366FF] py-16 px-4 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Meet Our Team</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">The passionate people behind Hostel Sathi</p>
          </div>
        </section>

        {/* Developer Team Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-[#5A00F0]">Development Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {developerTeam.map((member, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="h-64 bg-gray-200">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#5A00F0]">{member.name}</h3>
                    <p className="text-gray-500 mb-3">{member.role}</p>
                    <p className="text-gray-600 mb-4">{member.bio}</p>
                    <div className="flex space-x-3">
                      <a href="#" className="text-gray-400 hover:text-[#5A00F0] transition">
                        <Linkedin size={20} />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-[#5A00F0] transition">
                        <Twitter size={20} />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-[#5A00F0] transition">
                        <Mail size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Operational Team Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-[#5A00F0]">Operational Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {operationalTeam.map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-xl shadow-md overflow-hidden">
                  <div className="h-64 bg-gray-200">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#5A00F0]">{member.name}</h3>
                    <p className="text-gray-500 mb-3">{member.role}</p>
                    <p className="text-gray-600 mb-4">{member.bio}</p>
                    <div className="flex space-x-3">
                      <a href="#" className="text-gray-400 hover:text-[#5A00F0] transition">
                        <Linkedin size={20} />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-[#5A00F0] transition">
                        <Twitter size={20} />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-[#5A00F0] transition">
                        <Mail size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Our Team Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#5A00F0]">Join Our Team</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who are passionate about making a difference in students'
              lives. Check out our current openings or send us your resume.
            </p>
            <Link
              href="/contact-us"
              className="inline-block bg-[#5A00F0] text-white px-6 py-3 rounded-md font-medium hover:bg-[#4800C0] transition"
            >
              View Open Positions
            </Link>
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
