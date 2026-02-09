import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"



export async function POST() {
    try {
        // 1. Find Completed trips to count them before deletion
        const completedTripRequests = await prisma.tripRequest.count({
            where: { status: 'Completed' }
        })
        const completedJoinRequests = await prisma.joinRequest.count({
            where: { status: 'Completed' }
        })

        const totalCompletedToAdd = completedTripRequests + completedJoinRequests

        // 2. Update Statistics
        if (totalCompletedToAdd > 0) {
            await prisma.statistics.upsert({
                where: { id: 'global' },
                update: { totalCompletedTrips: { increment: totalCompletedToAdd } },
                create: { id: 'global', totalCompletedTrips: totalCompletedToAdd }
            })
        }

        // 3. Delete Archived and Completed trips (TripRequests)
        const deletedTripRequests = await prisma.tripRequest.deleteMany({
            where: {
                status: { in: ['Archived', 'Completed'] }
            }
        })

        // 4. Delete Archived and Completed trips (JoinRequests)
        const deletedJoinRequests = await prisma.joinRequest.deleteMany({
            where: {
                status: { in: ['Archived', 'Completed'] }
            }
        })

        return NextResponse.json({
            success: true,
            deletedTripRequests: deletedTripRequests.count,
            deletedJoinRequests: deletedJoinRequests.count,
            addedToStats: totalCompletedToAdd
        })
    } catch (error) {
        console.error('Cleanup error:', error)
        return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
    }
}
