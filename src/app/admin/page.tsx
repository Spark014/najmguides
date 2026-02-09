import { prisma } from "@/lib/prisma"
import { PlannedTrip, TripRequest, JoinRequest, Statistics } from "@prisma/client"
import { AdminDashboard } from "@/components/AdminDashboard"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const cookieStore = await cookies()
    const auth = cookieStore.get("admin_auth")

    if (!auth || auth.value !== "true") {
        redirect("/admin/login")
    }

    let trips: PlannedTrip[] = [], tripRequests: TripRequest[] = [], joinRequests: JoinRequest[] = [], stats: Statistics | null = null
    let dbError = null

    try {
        [trips, tripRequests, joinRequests, stats] = await Promise.all([
            prisma.plannedTrip.findMany({ orderBy: { startDate: 'desc' } }),
            prisma.tripRequest.findMany({ orderBy: { createdAt: 'desc' } }),
            prisma.joinRequest.findMany({ orderBy: { createdAt: 'desc' } }),
            prisma.statistics.findUnique({ where: { id: 'global' } })
        ])
    } catch (error) {
        console.error("Database connection failed:", error)
        dbError = "Failed to connect to the database. Please check your connection string."
    }

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <div className="text-sm text-gray-400">Welcome, Admin</div>
                </div>

                {dbError ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                        <h2 className="text-xl font-bold text-red-500 mb-2">Connection Error</h2>
                        <p className="text-gray-400">{dbError}</p>
                    </div>
                ) : (
                    <AdminDashboard
                        initialTrips={trips}
                        initialTripRequests={tripRequests}
                        initialJoinRequests={joinRequests}
                        initialStats={stats}
                    />
                )}
            </div>
        </div>
    )
}
