import Link from "next/link"
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react"

export default function CommonFooter() {
  return (
    <footer className="bg-[#1A0D2F] text-white p-6">
      <div className="mb-6 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-white w-10 h-10 flex items-center justify-center">
            <span className="text-[#5A00F0] font-bold text-lg">HS</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">Hostel Sathi</h3>
            <p className="text-sm italic">Your Second Home</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto md:grid-cols-4 md:max-w-2xl lg:max-w-4xl">
        <div className="space-y-2">
          <Link href="/about-us" className="block text-center md:text-left hover:text-[#B366FF] transition-colors">
            About us
          </Link>
          <Link href="/contact-us" className="block text-center md:text-left hover:text-[#B366FF] transition-colors">
            Contact us
          </Link>
        </div>
        <div className="space-y-2">
          <Link href="/team" className="block text-center md:text-left hover:text-[#B366FF] transition-colors">
            Team
          </Link>
          <Link href="/blogs" className="block text-center md:text-left hover:text-[#B366FF] transition-colors">
            Blogs
          </Link>
        </div>
        <div className="space-y-2">
          <Link href="/privacy" className="block text-center md:text-left hover:text-[#B366FF] transition-colors">
            Privacy policy
          </Link>
        </div>
        <div className="space-y-2 col-span-2 md:col-span-1">
          <p className="text-center md:text-left mb-2">Follow us:</p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link href="#" className="hover:text-[#B366FF] transition-colors">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="hover:text-[#B366FF] transition-colors">
              <Facebook size={20} />
            </Link>
            <Link href="#" className="hover:text-[#B366FF] transition-colors">
              <Linkedin size={20} />
            </Link>
            <Link href="#" className="hover:text-[#B366FF] transition-colors">
              <Youtube size={20} />
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-400 text-center">© 2023 Hostel Sathi. All rights reserved.</p>
    </footer>
  )
}
