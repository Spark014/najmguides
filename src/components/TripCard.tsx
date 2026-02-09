"use client"

import { Calendar, Star, Users, Clock } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { format } from "date-fns"
import { PlannedTrip } from "@prisma/client"

interface TripCardProps {
    trip: PlannedTrip
    onJoin: (trip: PlannedTrip) => void
}

export function TripCard({ trip, onJoin }: TripCardProps) {
    const isSoldOut = trip.availableSlots <= 0

    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:bg-zinc-900 transition-all duration-300 group">
            {/* Image Placeholder - In real app this would be dynamic */}
            <div className="h-56 bg-zinc-800 relative overflow-hidden">
                {trip.imageUrl ? (
                    <Image
                        src={trip.imageUrl}
                        alt={trip.title}
                        fill
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{trip.packageType}</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{trip.title}</h3>
                    <div className="flex items-center text-gray-300 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </div>
                </div>
            </div>

            <div className="p-8 flex-grow flex flex-col justify-between">
                <div className="space-y-6">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                            <Clock className="w-4 h-4 mr-2 text-primary" />
                            <span>{trip.makkahNights + trip.madinahNights} Nights</span>
                        </div>
                        <div className="flex items-center text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                            <Star className="w-4 h-4 mr-2 text-primary" />
                            <span>{trip.hotelTier}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm border-t border-white/5 pt-6">
                        <div className="text-center flex-1 border-r border-white/5">
                            <span className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1">Makkah</span>
                            <span className="text-white font-bold text-lg">{trip.makkahNights} <span className="text-xs font-normal text-gray-500">Nights</span></span>
                        </div>
                        <div className="text-center flex-1">
                            <span className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1">Madinah</span>
                            <span className="text-white font-bold text-lg">{trip.madinahNights} <span className="text-xs font-normal text-gray-500">Nights</span></span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm bg-black/40 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center text-gray-300">
                            <Users className="w-4 h-4 mr-2" />
                            <span>Available Slots</span>
                        </div>
                        <span className={isSoldOut ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                            {trip.availableSlots} / {trip.totalSlots}
                        </span>
                    </div>
                </div>

                <div className="mt-8">
                    <Button
                        fullWidth
                        onClick={() => onJoin(trip)}
                        disabled={isSoldOut}
                        variant={isSoldOut ? "ghost" : "primary"}
                        className="rounded-full py-6 text-lg shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all"
                    >
                        {isSoldOut ? "Sold Out" : "Join This Trip"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
