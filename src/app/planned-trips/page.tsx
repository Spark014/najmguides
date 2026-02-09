
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { PlannedTrip } from "@prisma/client"
import { PlannedTripsClient } from "@/components/PlannedTripsClient"

export const dynamic = 'force-dynamic'

export default async function PlannedTripsPage() {
    let trips: PlannedTrip[] = []
    let error = null

    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data, error: supabaseError } = await supabase
            .from('PlannedTrip')
            .select('*')
            .gte('endDate', new Date().toISOString())
            .order('startDate', { ascending: true })

        if (supabaseError) {
            console.error("Supabase Error:", supabaseError)
            throw new Error(supabaseError.message)
        }

        if (data) {
            // Cast data to match PlannedTrip interface, converting date strings to Date objects if necessary
            // Supabase returns dates as strings. Prisma types expect Date objects.
            trips = data.map((trip: any) => ({
                ...trip,
                startDate: new Date(trip.startDate),
                endDate: new Date(trip.endDate),
                createdAt: new Date(trip.createdAt),
                updatedAt: new Date(trip.updatedAt)
            })) as PlannedTrip[]
        }
    } catch (e) {
        console.error("Failed to fetch trips:", e)
        error = "Unable to load trips at this time."
    }

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Upcoming Group Trips</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Join our guided groups for a worry-free spiritual journey. Expert led, fully managed.
                    </p>
                </div>

                {error ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">{error}</p>
                    </div>
                ) : (
                    <PlannedTripsClient initialTrips={trips} />
                )}
            </div>
        </div>
    )
}
