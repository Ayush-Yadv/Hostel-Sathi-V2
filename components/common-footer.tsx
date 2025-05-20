import Link from "next/link"
import { Instagram, Facebook, Linkedin, Youtube, Phone, MapPin } from "lucide-react"

export default function CommonFooter() {
  return (
    <footer className="bg-[#1A0D2F] text-white px-4 py-8 md:px-6 md:py-10 lg:py-12">
      <div className="container mx-auto max-w-7xl">
        {/* Logo Section */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-full overflow-hidden w-10 h-10 flex items-center justify-center">
              <img src="/hostelsathi-logo.jpg" alt="Hostel Sathi Logo" className="w-10 h-10 object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Hostel Sathi</h3>
              <p className="text-sm italic">Your Second Home</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col items-center mb-8 md:mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Phone size={20} />
            <span>+91 9499459310</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={20} />
            <span>Knowledge Park, Greater Noida, Uttar Pradesh 201310</span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 max-w-md mx-auto md:grid-cols-4 md:max-w-2xl lg:max-w-4xl xl:gap-x-8">
          <div className="flex flex-col items-center md:items-start space-y-3">
            <Link href="/about-us" className="hover:text-[#B366FF] transition-colors">
              About us
            </Link>
            <Link href="/contact-us" className="hover:text-[#B366FF] transition-colors">
              Contact us
            </Link>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-3">
            <Link href="/team" className="hover:text-[#B366FF] transition-colors">
              Team
            </Link>
            <Link href="/blogs" className="hover:text-[#B366FF] transition-colors">
              Blogs
            </Link>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-3">
            <Link href="/privacy" className="hover:text-[#B366FF] transition-colors">
              Privacy policy
            </Link>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-center md:text-left mb-4">Follow us:</p>
            <div className="flex gap-6 justify-center md:justify-start">
              <Link href="https://www.instagram.com/hostel_sathi?igsh=MWdycHdnd3libTkybg==" target="_blank" rel="noopener noreferrer" className="hover:text-[#B366FF] transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="https://www.linkedin.com/company/hostel-sath/" target="_blank" rel="noopener noreferrer" className="hover:text-[#B366FF] transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="https://youtube.com/@unfilteredreviews-ur?si=sTZKuEfPAgTCSMPQ" target="_blank" rel="noopener noreferrer" className="hover:text-[#B366FF] transition-colors">
                <Youtube size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 md:mt-10 pt-6 border-t border-gray-800">
          <p className="text-sm text-gray-400 text-center">© 2023 Hostel Sathi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
