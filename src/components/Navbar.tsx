"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
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
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === item.href ? "text-primary" : "text-gray-300"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Button size="sm" className="ml-4">
                            Plan My Umrah
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-black border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "block px-3 py-2 rounded-md text-base font-medium",
                                    pathname === item.href
                                        ? "text-primary bg-white/5"
                                        : "text-gray-300 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-4 pb-2">
                            <Button fullWidth onClick={() => setIsOpen(false)}>
                                Plan My Umrah
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
