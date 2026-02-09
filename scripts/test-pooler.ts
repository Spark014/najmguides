
import { PrismaClient } from '@prisma/client'

// Try Singapore region pooler
const connectionString = "postgresql://postgres.bprcwjmxuhtlxiqdiczr:Firefoxess_786@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true"

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: connectionString
        }
    }
})

async function main() {
    console.log(`Testing connection to: ${connectionString}`)
    try {
        await prisma.$connect()
        console.log('Successfully connected to the database via Pooler!')

        const count = await prisma.plannedTrip.count()
        console.log(`Found ${count} trips.`)

    } catch (e) {
        console.error('Connection failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
