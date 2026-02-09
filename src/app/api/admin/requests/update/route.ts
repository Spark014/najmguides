import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const { id, status } = await req.json()

        // Try updating TripRequest first
        const updatedTrip = await prisma.tripRequest.update({
            where: { id },
            data: { status }
        }).catch(() => null)

        if (updatedTrip) {
            return NextResponse.json(updatedTrip)
        }

        // If not found, try JoinRequest
        const updatedJoin = await prisma.joinRequest.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json(updatedJoin)
    } catch (error) {
        console.error("Error updating request:", error)
        return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
    }
}
