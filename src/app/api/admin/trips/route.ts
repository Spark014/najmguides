import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const trip = await prisma.plannedTrip.create({
            data: {
                title: body.title,
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
                packageType: body.packageType,
                makkahNights: body.makkahNights,
                madinahNights: body.madinahNights,
                hotelTier: body.hotelTier,
                totalSlots: body.totalSlots,
                availableSlots: body.totalSlots, // Initially all slots available
                priceDisplay: body.priceDisplay
            }
        })

        return NextResponse.json(trip)
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
        await prisma.plannedTrip.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting trip:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
