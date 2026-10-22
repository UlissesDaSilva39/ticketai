const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const venues = [
    { name: 'The Blue Note Venue', type: 'Jazz Club', city: 'Shoreditch, London', capacity: 500, rating: 4.9, reviews: 12, bookings: 8, verified: true, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop' },
    { name: 'Fabric', type: 'Nightclub', city: 'Farringdon, London', capacity: 1600, rating: 4.8, reviews: 45, bookings: 22, verified: true, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=800&auto=format&fit=crop' },
    { name: 'The Warehouse Project', type: 'Warehouse', city: 'Manchester', capacity: 10000, rating: 4.7, reviews: 89, bookings: 15, verified: true, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop' },
    { name: 'Village Underground', type: 'Warehouse', city: 'Shoreditch, London', capacity: 700, rating: 4.6, reviews: 34, bookings: 12, verified: false, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop' },
  ];

  // Como a tabela foi limpa com TRUNCATE, createMany é seguro
  const result = await prisma.venue.createMany({ data: venues });
  console.log('✅ Inseridos ' + result.count + ' venues com UUIDs válidos.');
}
main().catch(e => { console.error('❌ Erro:', e.message); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
