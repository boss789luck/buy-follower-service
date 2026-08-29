const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log("Loading datasets...");
  
  const psRaw = JSON.parse(fs.readFileSync('services.json', 'utf8')).data;
  const psServices = [];
  
  // We take ALL PanelSocial services for IG and Line (and maybe others to be safe, let's take ALL)
  // Actually, to avoid clutter and overlap, let's take ONLY IG and Line from PanelSocial, and everything else from Ads4U.
  for (let i = 1; i < psRaw.length; i++) {
    if (psRaw[i].length < 5) continue;
    const originalId = parseInt(psRaw[i][0].replace(/\D/g, ''));
    if (!originalId) continue;
    const name = psRaw[i][1];
    const rate = parseFloat(psRaw[i][2].replace(/,/g, '').trim());
    const min = parseInt(psRaw[i][3]);
    const max = parseInt(psRaw[i][4]);
    
    // We prioritize PanelSocial for IG and LINE
    const isIG = /ไอจี|instagram|ig/i.test(name);
    const isLine = /line/i.test(name);
    
    if (isIG || isLine) {
      psServices.push({
        originalId,
        name,
        category: isIG ? "Instagram" : "LINE",
        price: rate * 2,
        originalPrice: rate,
        min,
        max,
        provider: "PANELSOCIAL"
      });
    }
  }

  const ads4u = JSON.parse(fs.readFileSync('ads4u_services_api.json', 'utf8'));
  const ads4uServices = [];
  
  for (const s of ads4u) {
    const name = s.name;
    const isIG = /ไอจี|instagram|ig/i.test(name);
    const isLine = /line/i.test(name);
    
    // We skip IG and LINE from Ads4U because PanelSocial is cheaper/better for those as discussed.
    // We take EVERYTHING else from Ads4U (Facebook, TikTok, Twitter, YouTube, Traffic, etc.)
    if (!isIG && !isLine) {
      let category = "Other";
      if (/facebook|เฟซบุ๊ค|เฟส/i.test(name)) category = "Facebook";
      else if (/tiktok|ติ๊กต๊อก/i.test(name)) category = "TikTok";
      else if (/twitter|ทวิต|x/i.test(name)) category = "Twitter";
      else if (/youtube|ยูทูป/i.test(name)) category = "YouTube";
      
      ads4uServices.push({
        originalId: parseInt(s.service),
        name: s.name,
        category: category,
        price: parseFloat(s.rate) * 2,
        originalPrice: parseFloat(s.rate),
        min: parseInt(s.min),
        max: parseInt(s.max),
        provider: "ADS4U"
      });
    }
  }

  const allServices = [...psServices, ...ads4uServices];
  console.log(`Found ${psServices.length} PanelSocial services and ${ads4uServices.length} Ads4U services. Total: ${allServices.length}`);

  console.log("Clearing old services...");
  await prisma.order.deleteMany();
  await prisma.service.deleteMany();
  
  console.log("Seeding ALL services in batches...");
  // SQLite has a parameter limit, so we insert in batches of 500
  const batchSize = 500;
  let inserted = 0;
  for (let i = 0; i < allServices.length; i += batchSize) {
    const batch = allServices.slice(i, i + batchSize).filter(s => !isNaN(s.price) && !isNaN(s.originalPrice) && !isNaN(s.min) && !isNaN(s.max));
    await prisma.service.createMany({
      data: batch
    });
    inserted += batch.length;
    console.log(`Inserted ${inserted} / ${allServices.length}...`);
  }

  console.log("Database seeded successfully with ALL services!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
