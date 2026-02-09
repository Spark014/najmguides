
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const trips = await prisma.plannedTrip.findMany()
    console.log('Trips found:', trips.length)
    trips.forEach(trip => {
        console.log(`- ${trip.title}: ${trip.imageUrl ? 'Has Image' : 'No Image'} (${trip.imageUrl})`)
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
