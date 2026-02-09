"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Mail, Phone, MessageCircle, Check } from "lucide-react"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setIsSuccess(true)
                setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Us</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Have questions? We are here to help you plan your spiritual journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
                            <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Phone</p>
                                        <p className="text-white font-medium">+1 (860) 934-8971</p>
                                        <p className="text-xs text-gray-500 mt-1">Available 9am - 9pm EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                        <MessageCircle className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">WhatsApp</p>
                                        <p className="text-white font-medium">+1 (860) 934-8971</p>
                                        <p className="text-xs text-gray-500 mt-1">Fastest response time</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Email</p>
                                        <p className="text-white font-medium">info@najmguides.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-2 h-64 relative overflow-hidden">
                            <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                                <span className="text-gray-500">Map Placeholder</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
                        {isSuccess ? (
                            <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-green-500" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
                                <p className="text-gray-400">We&apos;ll get back to you shortly.</p>
                                <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-6">Send Another</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">First Name</label>
                                        <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Last Name</label>
                                        <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Email</label>
                                    <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Subject</label>
                                    <input required name="subject" value={formData.subject} onChange={handleChange} type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Message</label>
                                    <textarea required name="message" value={formData.message} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none h-32 resize-none"></textarea>
                                </div>

                                <Button fullWidth size="lg" disabled={isSubmitting} className="rounded-full">
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
