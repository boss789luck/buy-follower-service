const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log("Loading datasets...");
  
  const psRaw = JSON.parse(fs.readFileSync('services.json', 'utf8')).data;
  const psThaiIGLine = [];
  for (let i = 1; i < psRaw.length; i++) {
    if (psRaw[i].length < 5) continue;
    const originalId = parseInt(psRaw[i][0].replace(/\D/g, ''));
    if (!originalId) continue;
    const name = psRaw[i][1];
    const rate = parseFloat(psRaw[i][2].replace(/,/g, '').trim());
    const min = parseInt(psRaw[i][3]);
    const max = parseInt(psRaw[i][4]);
    
    const isThai = /thai|th|ไทย|🇹🇭/i.test(name);
    const isIG = /ไอจี|instagram/i.test(name);
    const isLine = /line/i.test(name);
    
    if (isThai && (isIG || isLine)) {
      psThaiIGLine.push({
        originalId,
        name,
        category: isIG ? "Instagram คนไทย" : "LINE คนไทย",
        price: rate * 2,
        originalPrice: rate,
        min,
        max,
        provider: "PANELSOCIAL"
      });
    }
  }

  const ads4u = JSON.parse(fs.readFileSync('ads4u_services_api.json', 'utf8'));
  const ads4uThaiFBTikTok = [];
  for (const s of ads4u) {
    const isThai = /thai|thailand|ไทย|🇹🇭/i.test(s.name);
    const isFB = /facebook|เฟซบุ๊ค|เฟส/i.test(s.name);
    const isTikTok = /tiktok|ติ๊กต๊อก/i.test(s.name);
    
    if (isThai && (isFB || isTikTok)) {
      ads4uThaiFBTikTok.push({
        originalId: parseInt(s.service),
        name: s.name,
        category: isFB ? "Facebook คนไทย" : "TikTok คนไทย",
        price: parseFloat(s.rate) * 2,
        originalPrice: parseFloat(s.rate),
        min: parseInt(s.min),
        max: parseInt(s.max),
        provider: "ADS4U"
      });
    }
  }

  const allServices = [...psThaiIGLine, ...ads4uThaiFBTikTok];
  console.log(`Found ${psThaiIGLine.length} PanelSocial services and ${ads4uThaiFBTikTok.length} Ads4U services.`);

  console.log("Clearing old services...");
  await prisma.order.deleteMany();
  await prisma.service.deleteMany();
  
  console.log("Seeding curated services...");
  for (const service of allServices) {
    if (isNaN(service.price) || isNaN(service.originalPrice) || isNaN(service.min) || isNaN(service.max)) continue;
    await prisma.service.create({
      data: service
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
