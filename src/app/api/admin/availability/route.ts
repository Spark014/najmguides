import { NextResponse } from 'next/server'
import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from '@/utils/supabase/server'
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Use service role to bypass RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data, error } = await supabase
            .from('BlockedDate')
            .select('*')
            .order('date', { ascending: true })

        if (error) throw error
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch blocked dates' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        // Use service role to bypass RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const body = await request.json()
        const { date, reason, dates } = body

        // Handle Bulk Blocking (Range)
        if (dates && Array.isArray(dates)) {
            const updates = dates.map(d => {
                // Generate a unique ID for each entry
                const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
                return {
                    id,
                    date: new Date(d).toISOString(),
                    reason: reason || "Admin Blocked Range"
                }
            })

            const { error } = await supabase
                .from('BlockedDate')
                .upsert(updates, { onConflict: 'date' })

            if (error) throw error

            return NextResponse.json({ success: true, count: updates.length })
        }

        const { data, error } = await supabase
            .from('BlockedDate')
            .insert({
                date: new Date(date).toISOString(),
                reason
            })
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(data)
    } catch (e: any) {
        console.error("Availability API Error:", e)
        return NextResponse.json({ error: e.message || 'Failed to block date' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        // Use service role to bypass RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        const { error } = await supabase
            .from('BlockedDate')
            .delete()
            .eq('id', id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Failed to unblock date' }, { status: 500 })
    }
}
