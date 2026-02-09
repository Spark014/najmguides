
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

        // Env var validation
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing Supabase environment variables')
            return NextResponse.json({
                error: 'Server Configuration Error',
                details: 'Missing Supabase environment variables. Please check Vercel settings.'
            }, { status: 500 })
        }

        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data, error } = await supabase
            .from('TripRequest')
            .insert({
                id: crypto.randomUUID(),
                status: 'Pending',
                fullName: body.fullName,
                email: body.email,
                phone: body.phone || '',
                packageType: body.packageType || 'luxury',
                travelers: body.travelers || 1,
                tripLength: body.tripLength || 10,
                makkahDays: body.makkahDays || 5,
                madinahDays: body.madinahDays || 5,
                departureCountry: body.departureCountry || '',
                departureCity: body.departureCity || '',
                notes: body.notes || null,
                startDateRange: body.startDate ? new Date(body.startDate).toISOString() : null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase Error:', error)
            throw new Error(error.message)
        }

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Error creating trip request:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error', details: error },
            { status: 500 }
        )
    }
}
