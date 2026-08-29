const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const services = JSON.parse(fs.readFileSync('src/data/services.json', 'utf8'));
  
  console.log(`Seeding ${services.length} services...`);
  
  for (const s of services) {
    if (!s.id) continue;
    await prisma.service.create({
      data: {
        originalId: s.id,
        name: s.name,
        originalPrice: s.originalPrice,
        price: s.price,
        min: s.min,
        max: s.max,
        category: s.category
      }
    });
  }
  
  console.log("Seeding finished.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
