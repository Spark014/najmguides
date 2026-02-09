"use client"

import { MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

export function WhatsAppButton() {
    return (
        <motion.a
            href="https://wa.me/18609348971" // Updated number
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20ba5a] transition-colors flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <MessageCircle className="w-8 h-8 fill-current" />
            <span className="sr-only">Chat on WhatsApp</span>
        </motion.a>
    )
}
