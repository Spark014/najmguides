import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const { id, status } = await req.json()

        // Try updating TripRequest first
        const { data: updatedTrip, error: tripError } = await supabase
            .from('TripRequest')
            .update({ status, updatedAt: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (updatedTrip && !tripError) {
            return NextResponse.json(updatedTrip)
        }

        // If not found, try JoinRequest
        const { data: updatedJoin, error: joinError } = await supabase
            .from('JoinRequest')
            .update({ status, updatedAt: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (joinError) throw joinError

        return NextResponse.json(updatedJoin)
    } catch (error) {
        console.error("Error updating request:", error)
        return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
    }
}
