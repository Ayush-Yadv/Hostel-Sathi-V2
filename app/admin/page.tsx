"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = [
  { email: "admin1@hostelsathi.com", password: "Admin@123" },
  { email: "admin2@hostelsathi.com", password: "Admin@123" },
  { email: "admin3@hostelsathi.com", password: "Admin@123" },
  { email: "admin4@hostelsathi.com", password: "Admin@123" },
  { email: "admin5@hostelsathi.com", password: "Admin@123" }
];

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in from session storage
    const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn')
    
    if (isAdminLoggedIn === 'true') {
      // If admin is logged in, redirect to pending properties
      router.push("/admin/pending-properties")
    } else {
      // If not logged in, redirect to login
      router.push("/auth/login?redirect=/admin/pending-properties")
    }
    
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#5A00F0]" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    )
  }

  return null
} 