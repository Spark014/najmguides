import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const { id, status } = await req.json()

        const updateData: any = { status, updatedAt: new Date().toISOString() }
        if (status === 'Deleted') {
            updateData.deletedAt = new Date().toISOString()
        }

        const { data: updatedTrip, error: tripError } = await supabase
            .from('TripRequest')
            .update(updateData)
            .eq('id', id)
            .select()
            .maybeSingle() // Use maybeSingle to avoid error if not found

        if (updatedTrip) {
            return NextResponse.json(updatedTrip)
        }

        // If not found in TripRequest, try JoinRequest
        const { data: updatedJoin, error: joinError } = await supabase
            .from('JoinRequest')
            .update(updateData)
            .eq('id', id)
            .select()
            .maybeSingle()

        if (joinError) throw joinError

        if (!updatedJoin) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 })
        }

        return NextResponse.json(updatedJoin)
    } catch (error) {
        console.error("Error updating request:", error)
        return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
    }
}
