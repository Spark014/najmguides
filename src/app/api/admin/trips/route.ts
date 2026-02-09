
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data, error } = await supabase
            .from('PlannedTrip')
            .insert({
                title: body.title,
                startDate: new Date(body.startDate).toISOString(),
                endDate: new Date(body.endDate).toISOString(),
                packageType: body.packageType,
                makkahNights: body.makkahNights,
                madinahNights: body.madinahNights,
                hotelTier: body.hotelTier,
                totalSlots: body.totalSlots,
                availableSlots: body.totalSlots, // Initially all slots available
                priceDisplay: body.priceDisplay,
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
        console.error('Error creating trip:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { error } = await supabase
            .from('PlannedTrip')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Supabase Delete Error:', error)
            throw new Error(error.message)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting trip:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
