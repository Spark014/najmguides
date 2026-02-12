
import { NextResponse } from 'next/server'
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Use service role to bypass RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

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
        // Use service role to bypass RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

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
