
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const prisma = new PrismaClient();
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnections() {
    console.log('--- Testing Connectivity ---');

    // 1. Test HTTPS Connection (Supabase API)
    console.log('\n[HTTPS] Testing Supabase API connection...');
    try {
        const { data, error } = await supabase.from('Statistics').select('*').limit(1);
        if (error) {
            // If table doesn't exist, it might still return error, but connection worked.
            // If connection failed, error will be network related.
            console.log('HTTPS Connection: CONNECTED (but query error):', error.message);
        } else {
            console.log('HTTPS Connection: SUCCESS');
        }
    } catch (e) {
        console.error('HTTPS Connection: FAILED', e.message);
    }

    // 2. Test TCP Connection (Prisma)
    console.log('\n[TCP] Testing Prisma connection (Port 5432)...');
    try {
        await prisma.$connect();
        console.log('TCP Connection: SUCCESS');
        await prisma.$disconnect();
    } catch (e) {
        console.error('TCP Connection: FAILED');
        console.error('Error Code:', e.code);
        console.error('Message:', e.message);
    }
}

testConnections();
