import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-primary rounded-sm rotate-45 flex items-center justify-center">
                                <div className="w-3 h-3 bg-black rotate-45" />
                            </div>
                            <span className="text-lg font-bold tracking-wider text-white">
                                NAJM <span className="text-primary">GUIDES</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Premium Umrah planning and on-ground guidance. We handle the logistics so you can focus on your worship.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/plan-a-trip" className="text-gray-400 hover:text-primary text-sm">Plan a Trip</Link></li>
                            <li><Link href="/planned-trips" className="text-gray-400 hover:text-primary text-sm">Planned Trips</Link></li>
                            <li><Link href="/packages" className="text-gray-400 hover:text-primary text-sm">Packages</Link></li>
                            <li><Link href="/how-it-works" className="text-gray-400 hover:text-primary text-sm">How It Works</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><Link href="/faq" className="text-gray-400 hover:text-primary text-sm">FAQ</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-primary text-sm">Contact Us</Link></li>
                            <li><Link href="/terms" className="text-gray-400 hover:text-primary text-sm">Terms & Policies</Link></li>
                            <li><Link href="/admin/login" className="text-gray-400 hover:text-primary text-sm">Admin Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3 text-gray-400 text-sm">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>+1 (860) 934-8971</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400 text-sm">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>info@najmguides.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Najm Guides. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-primary"><Facebook className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-primary"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-primary"><Twitter className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
