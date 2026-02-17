const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    try {
        const sqlPath = path.join(__dirname, '../prisma/fix_rls.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing RLS fix...');

        // Split by statement and execute one by one
        const statements = sql.split(';').filter(s => s.trim() !== '');

        for (const statement of statements) {
            if (statement.trim()) {
                await prisma.$executeRawUnsafe(statement);
            }
        }

        console.log('RLS policies updated successfully.');
    } catch (e) {
        console.error('Error executing SQL:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
