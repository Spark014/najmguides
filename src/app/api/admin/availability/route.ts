import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const blockedDates = await prisma.blockedDate.findMany({
            orderBy: { date: 'asc' }
        })
        return NextResponse.json(blockedDates)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch blocked dates' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { date, reason } = body

        const blockedDate = await prisma.blockedDate.create({
            data: {
                date: new Date(date),
                reason
            }
        })
        return NextResponse.json(blockedDate)
    } catch {
        return NextResponse.json({ error: 'Failed to block date' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        await prisma.blockedDate.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Failed to unblock date' }, { status: 500 })
    }
}
