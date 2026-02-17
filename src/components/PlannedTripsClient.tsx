"use client"

import * as React from "react"
import { PlannedTrip } from "@prisma/client"
import { TripCard } from "@/components/TripCard"
import { JoinTripModal } from "@/components/JoinTripModal"
import { Button } from "@/components/ui/Button"

interface PlannedTripsClientProps {
    initialTrips: PlannedTrip[]
    availablePackageTypes: string[]
}

export function PlannedTripsClient({ initialTrips, availablePackageTypes }: PlannedTripsClientProps) {
    const [trips] = React.useState(initialTrips)
    const [selectedTrip, setSelectedTrip] = React.useState<PlannedTrip | null>(null)
    const [isModalOpen, setIsModalOpen] = React.useState(false)

    // Filters
    const [filterType, setFilterType] = React.useState<string>('all')

    const filteredTrips = trips.filter(trip => {
        if (filterType === 'all') return true
        return trip.packageType === filterType
    })

    const handleJoin = (trip: PlannedTrip) => {
        setSelectedTrip(trip)
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center">
                <Button
                    variant={filterType === 'all' ? 'primary' : 'outline'}
                    onClick={() => setFilterType('all')}
                    className="rounded-full px-6"
                >
                    All Trips
                </Button>
                {availablePackageTypes.map(type => (
                    <Button
                        key={type}
                        variant={filterType === type ? 'primary' : 'outline'}
                        onClick={() => setFilterType(type)}
                        className="rounded-full px-6 capitalize"
                    >
                        {type}
                    </Button>
                ))}
            </div>

            {/* Grid */}
            {filteredTrips.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No trips found matching your criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTrips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} onJoin={handleJoin} />
                    ))}
                </div>
            )}

            <JoinTripModal
                trip={selectedTrip}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}
