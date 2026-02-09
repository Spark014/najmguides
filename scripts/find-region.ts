
import { PrismaClient } from '@prisma/client'

const regions = [
    'aws-0-us-east-1',
    'aws-0-us-west-1',
    'aws-0-eu-central-1',
    'aws-0-eu-west-1',
    'aws-0-eu-west-2',
    'aws-0-eu-west-3',
    'aws-0-ap-south-1',
    'aws-0-ap-southeast-1',
    'aws-0-ap-southeast-2',
    'aws-0-ap-northeast-1',
    'aws-0-ap-northeast-2',
    'aws-0-sa-east-1',
    'aws-0-ca-central-1'
]

async function testRegion(region: string) {
    const connectionString = `postgresql://postgres.bprcwjmxuhtlxiqdiczr:Firefoxess_786@${region}.pooler.supabase.com:5432/postgres?pgbouncer=true`
    console.log(`Testing ${region}...`)

    const prisma = new PrismaClient({
        datasources: { db: { url: connectionString } },
        log: [] // quiet
    })

    try {
        await prisma.$connect()
        console.log(`SUCCESS: Connected to ${region}!`)
        await prisma.$disconnect()
        return connectionString
    } catch (e: any) {
        if (e.message.includes('Tenant or user not found')) {
            console.log(`Failed ${region}: Tenant not found`)
        } else if (e.message.includes('Can\'t reach database server')) {
            console.log(`Failed ${region}: Unreachable`)
        } else {
            console.log(`Failed ${region}: ${e.message.split('\n')[0]}`)
        }
        await prisma.$disconnect()
        return null
    }
}

async function main() {
    for (const region of regions) {
        const result = await testRegion(region)
        if (result) {
            console.log('\nFOUND WORKING CONNECTION STRING:')
            console.log(result)
            break
        }
    }
}

main()
