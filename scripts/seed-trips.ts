import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding placeholder trips...')

    const trips = [
        {
            title: 'Ramadan 2026 - First 10 Days',
            startDate: new Date('2026-02-18'),
            endDate: new Date('2026-02-28'),
            packageType: 'Luxury',
            makkahNights: 5,
            madinahNights: 5,
            hotelTier: '5-star',
            totalSlots: 20,
            availableSlots: 15,
            description: 'Experience the spiritual beginning of Ramadan in the holy cities with premium guidance.',
            priceDisplay: '$3,500',
            imageUrl: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?q=80&w=1000&auto=format&fit=crop'
        },
        {
            title: 'Spring Umrah Retreat',
            startDate: new Date('2026-04-10'),
            endDate: new Date('2026-04-20'),
            packageType: 'Comfort',
            makkahNights: 5,
            madinahNights: 5,
            hotelTier: '4-star',
            totalSlots: 30,
            availableSlots: 28,
            description: 'A balanced journey focusing on comfort and spiritual growth during the pleasant spring season.',
            priceDisplay: '$2,200',
            imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1000&auto=format&fit=crop'
        },
        {
            title: 'Summer Youth Group',
            startDate: new Date('2026-07-15'),
            endDate: new Date('2026-07-25'),
            packageType: 'Budget',
            makkahNights: 5,
            madinahNights: 5,
            hotelTier: 'Economy',
            totalSlots: 40,
            availableSlots: 35,
            description: 'An affordable group trip designed for students and young professionals.',
            priceDisplay: '$1,500',
            imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000&auto=format&fit=crop'
        }
    ]

    for (const trip of trips) {
        await prisma.plannedTrip.create({
            data: trip
        })
    }

    console.log('Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
