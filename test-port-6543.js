
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Construct URL with port 6543
// Original: postgresql://postgres:[PWD]@db.[REF].supabase.co:5432/postgres
// New:      postgresql://postgres.[REF]:[PWD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
// Or:       postgresql://postgres:[PWD]@db.[REF].supabase.co:6543/postgres (Supavisor)

// Let's try the direct host at 6543 first, as Supavisor listens there too often.
const originalUrl = process.env.DATABASE_URL;
const url6543 = originalUrl.replace(':5432', ':6543');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: url6543
        }
    }
});

async function testPort6543() {
    console.log('--- Testing Port 6543 ---');
    console.log('URL (masked):', url6543.replace(/:[^:]*@/, ':****@'));

    try {
        await prisma.$connect();
        console.log('TCP 6543 Connection: SUCCESS');
        await prisma.$disconnect();
    } catch (e) {
        console.error('TCP 6543 Connection: FAILED');
        console.error('Message:', e.message);
    }
}

testPort6543();
