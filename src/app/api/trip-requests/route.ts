
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Basic validation
        if (!body.fullName || !body.email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data, error } = await supabase
            .from('TripRequest')
            .insert({
                fullName: body.fullName,
                email: body.email,
                phone: body.phone,
                packageType: body.packageType,
                travelers: body.travelers,
                tripLength: body.tripLength,
                makkahDays: body.makkahDays,
                madinahDays: body.madinahDays,
                departureCountry: body.departureCountry,
                departureCity: body.departureCity,
                notes: body.notes,
                startDateRange: body.startDate ? new Date(body.startDate).toISOString() : null,
                updatedAt: new Date().toISOString() // Manually set updatedAt as Supabase doesn't auto-set it on insert like Prisma sometimes does depending on DB triggers
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase Error:', error)
            throw new Error(error.message)
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error creating trip request:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
