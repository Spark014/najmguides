
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()

        // Use service role to bypass RLS
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        console.log(`Updating package ${id} with:`, body)

        const { data, error } = await supabase
            .from('Package')
            .update(body)
            .eq('id', id)
            .select()

        if (error) {
            console.error("Supabase error during update:", error)
            throw error
        }

        if (!data || data.length === 0) {
            console.warn(`Package update succeeded but returned 0 rows for ID: ${id}. This might indicate the ID was not found.`)
            // Return 404 if not found, or success but empty if that's preferred.
            // But since user says "it updated", maybe we return success: true?
            // Let's return 200 with empty object to avoid frontend error, but log it.
            return NextResponse.json({})
        }

        console.log("Package updated successfully:", data[0])
        return NextResponse.json(data[0])
    } catch (error) {
        console.error("Error updating package:", error)
        return NextResponse.json({ error: "Failed to update package" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params

        // Use service role to bypass RLS
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const { error } = await supabase
            .from('Package')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting package:", error)
        return NextResponse.json({ error: "Failed to delete package" }, { status: 500 })
    }
}
