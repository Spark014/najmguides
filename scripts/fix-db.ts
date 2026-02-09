
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        await prisma.$connect()
        console.log('Successfully connected to the database!')

        // Check for Statistics table RLS
        const result = await prisma.$queryRaw`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      WHERE oid = 'public."Statistics"'::regclass;
    `
        console.log('RLS Status:', result)

        // Enable RLS if needed (this is usually done via migration, but we can try raw SQL for a quick fix if user has permissions)
        await prisma.$executeRaw`ALTER TABLE "Statistics" ENABLE ROW LEVEL SECURITY;`
        console.log('Enabled RLS on Statistics table.')

    } catch (e) {
        console.error('Connection failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
