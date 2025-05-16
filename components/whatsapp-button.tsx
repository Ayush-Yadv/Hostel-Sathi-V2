import { MessageCircle } from "lucide-react"

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/9499459310"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-10 lg:bottom-10 bg-[#25D366] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#20ba5a] transition-colors"
    >
      <MessageCircle size={24} className="text-white" />
    </a>
  )
}
