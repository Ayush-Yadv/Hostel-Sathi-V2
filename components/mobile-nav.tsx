"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Heart, Building2 } from "lucide-react"
import { onAuthChange } from "@/lib/auth"

export default function MobileNav() {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-20">
      <Link href="/" className={`flex flex-col items-center ${pathname === "/" ? "text-[#5A00F0]" : ""}`}>
        <Home size={20} />
        <span className="text-xs">Home</span>
      </Link>
      <Link
        href="/hostels"
        className={`flex flex-col items-center ${pathname.startsWith("/hostels") ? "text-[#5A00F0]" : ""}`}
      >
        <BookOpen size={20} />
        <span className="text-xs">Hostels/PG's</span>
      </Link>
      <Link
        href="/saved-hostels"
        className={`flex flex-col items-center ${pathname === "/saved-hostels" ? "text-[#5A00F0]" : ""}`}
      >
        <Heart size={20} />
        <span className="text-xs">Saved</span>
      </Link>
      <Link
        href="/list-property"
        className={`flex flex-col items-center ${pathname.startsWith("/list-property") ? "text-[#5A00F0]" : ""}`}
      >
        <Building2 size={20} />
        <span className="text-xs">List Property</span>
      </Link>
    </div>
  )
}
