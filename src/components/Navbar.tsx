"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
    { name: "Home", href: "/" },
    { name: "Plan a Trip", href: "/plan-a-trip" },
    { name: "Planned Trips", href: "/planned-trips" },
    { name: "Packages", href: "/packages" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const pathname = usePathname()

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-5xl z-50 water-capsule px-2"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-sm rotate-45 flex items-center justify-center">
                            <div className="w-4 h-4 bg-black rotate-45" />
                        </div>
                        <span className="text-xl font-bold tracking-wider text-white">
                            NAJM <span className="text-primary">GUIDES</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.href} legacyBehavior passHref>
                                <motion.a
                                    whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
                                    whileTap={{ scale: 0.9, y: 2, filter: "brightness(0.8)" }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                                        pathname === item.href
                                            ? "water-capsule text-primary shadow-lg"
                                            : "text-gray-300 hover:text-white"
                                    )}
                                >
                                    {item.name}
                                </motion.a>
                            </Link>
                        ))}
                        <div className="pl-4">
                            <Button size="sm" className="rounded-full shadow-[0_4px_14px_rgba(212,175,55,0.2)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.3)]">
                                Plan My Umrah
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <motion.button
                            whileTap={{ scale: 0.8, y: 2 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="md:hidden origin-top overflow-hidden mt-2 water-capsule"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "block px-4 py-3 rounded-2xl text-base font-medium transition-all active:scale-95",
                                        pathname === item.href
                                            ? "text-primary bg-white/10"
                                            : "text-gray-300 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4">
                                <Button fullWidth onClick={() => setIsOpen(false)} className="rounded-full shadow-lg">
                                    Plan My Umrah
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
