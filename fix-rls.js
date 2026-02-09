const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.$connect();
  console.log('Connected!');
  // Fix RLS Warnings
  await prisma.$executeRaw`DROP POLICY IF EXISTS "Enable insert access for all users" ON "JoinRequest";`;
  await prisma.$executeRaw`CREATE POLICY "Enable insert access for all users" ON "JoinRequest" FOR INSERT WITH CHECK (auth.role() = 'anon');`;
  console.log('Fixed JoinRequest policy');
  
  await prisma.$executeRaw`DROP POLICY IF EXISTS "Enable insert access for all users" ON "TripRequest";`;
  await prisma.$executeRaw`CREATE POLICY "Enable insert access for all users" ON "TripRequest" FOR INSERT WITH CHECK (auth.role() = 'anon');`;
  console.log('Fixed TripRequest policy');
}
main().catch(console.error).finally(() => prisma.$disconnect());
