"use client"

import * as React from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { PlannedTrip } from "@prisma/client"

interface JoinTripModalProps {
    trip: PlannedTrip | null
    isOpen: boolean
    onClose: () => void
}

export function JoinTripModal({ trip, isOpen, onClose }: JoinTripModalProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [formData, setFormData] = React.useState({
        fullName: "",
        email: "",
        phone: "",
        seats: 1,
        notes: ""
    })

    if (!isOpen || !trip) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/join-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tripId: trip.id,
                    ...formData
                })
            })

            if (res.ok) {
                alert("Request sent successfully! We will contact you shortly.")
                onClose()
                setFormData({ fullName: "", email: "", phone: "", seats: 1, notes: "" })
            } else {
                alert("Something went wrong.")
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-white/10 rounded-xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-white mb-1">Join Trip</h2>
                <p className="text-gray-400 text-sm mb-6">{trip.title}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Full Name</label>
                        <input
                            required
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-white focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Email</label>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-white focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Phone / WhatsApp</label>
                        <input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-white focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Number of Seats</label>
                        <input
                            required
                            type="number"
                            min="1"
                            max={trip.availableSlots}
                            value={formData.seats}
                            onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-white focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Notes (Optional)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-white focus:border-primary focus:outline-none h-20 resize-none"
                        />
                    </div>

                    <Button fullWidth type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Submit Request"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
