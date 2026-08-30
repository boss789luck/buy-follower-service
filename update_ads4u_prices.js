const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany({
    where: { provider: "ADS4U" }
  });
  
  console.log(`Updating ${services.length} ADS4U services to x3 markup...`);
  
  // Doing it in a transaction for speed
  const updates = services.map(s => 
    prisma.service.update({
      where: { id: s.id },
      data: { price: s.originalPrice * 3 }
    })
  );
  
  // Process in chunks of 500 to avoid SQLite limits
  let count = 0;
  const chunkSize = 500;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    await prisma.$transaction(chunk);
    count += chunk.length;
    console.log(`Processed ${count} / ${updates.length}`);
  }
  
  console.log("Done updating ADS4U prices to x3.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
