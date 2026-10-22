const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const venues = await prisma.venue.findMany();
    console.log('SUCCESS: Found ' + venues.length + ' venues');
    console.log(venues);
  } catch (error) {
    console.error('ERROR:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
