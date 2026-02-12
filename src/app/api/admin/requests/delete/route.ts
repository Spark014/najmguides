import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url)
        const id = url.searchParams.get('id')
        const type = url.searchParams.get('type') // 'trip' or 'join'

        if (!id || !type) {
            return NextResponse.json({ error: "Missing id or type" }, { status: 400 })
        }

        // Use service role to bypass RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const table = type === 'trip' ? 'TripRequest' : 'JoinRequest'

        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting request:", error)
        return NextResponse.json({ error: "Failed to delete request" }, { status: 500 })
    }
}
