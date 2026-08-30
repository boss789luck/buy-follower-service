const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const panelKey = process.env.PROVIDER_API_KEY;
  const panelUrl = process.env.PROVIDER_URL;

  console.log("Fetching from PanelSocial...");
  const params = new URLSearchParams({ key: panelKey, action: "services" });
  const res = await fetch(panelUrl, { method: 'POST', body: params });
  const services = await res.json();

  let count = 0;
  for (const s of services) {
    const name = String(s.name).toLowerCase();
    const category = String(s.category).toLowerCase();
    
    // Check if it's the premium Thai/Gender FB comments we missed
    if (category.includes('คอมเม้นต์') || category.includes('รีวิว') || name.includes('คนไทย') || name.includes('ผู้ชาย') || name.includes('ผู้หญิง')) {
      // Upsert into DB
      await prisma.service.upsert({
        where: { id: parseInt(s.service) + 10000 }, // Avoid conflict
        update: {
          originalId: parseInt(s.service),
          provider: "PANELSOCIAL",
          name: s.name,
          category: s.category,
          originalPrice: parseFloat(s.rate),
          price: parseFloat(s.rate) * 2, // arbitrary markup
          min: parseInt(s.min),
          max: parseInt(s.max),
        },
        create: {
          originalId: parseInt(s.service),
          provider: "PANELSOCIAL",
          name: s.name,
          category: s.category,
          originalPrice: parseFloat(s.rate),
          price: parseFloat(s.rate) * 2,
          min: parseInt(s.min),
          max: parseInt(s.max),
        }
      });
      count++;
    }
  }
  console.log(`Synced ${count} premium PanelSocial services!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
