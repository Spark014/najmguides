import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

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
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const body = await request.json()
        const { date, reason } = body

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
    } catch {
        return NextResponse.json({ error: 'Failed to block date' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
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
