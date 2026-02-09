
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        if (!body.tripId || !body.fullName || !body.email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data, error } = await supabase
            .from('JoinRequest')
            .insert({
                tripId: body.tripId,
                fullName: body.fullName,
                email: body.email,
                phone: body.phone,
                seats: body.seats,
                notes: body.notes,
                updatedAt: new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase Error:', error)
            throw new Error(error.message)
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error creating join request:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
