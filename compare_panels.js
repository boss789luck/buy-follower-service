const fs = require('fs');
const https = require('https');

const API_URL = 'https://ads4u.co/api/v2';
const API_KEY = '4162425a89e6e3994b71c7d02102d82d';

async function fetchAds4u() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      key: API_KEY,
      action: 'services'
    });
    
    const req = https.request(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } 
        catch (e) { resolve(body); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log("Fetching ads4u.co services...");
  const ads4u = await fetchAds4u();
  
  if (!Array.isArray(ads4u)) {
    console.log("Failed to fetch ads4u array. Response:", ads4u);
    return;
  }
  
  fs.writeFileSync('ads4u_services_api.json', JSON.stringify(ads4u, null, 2));
  console.log(`Saved ${ads4u.length} services from ads4u.co`);
  
  // Load panelsocial services
  // The original one is in src/data/services.json but prices are x2. 
  // Let's use the original 'services.json' which has raw data from panelsocial.
  const panelsocialRaw = JSON.parse(fs.readFileSync('services.json', 'utf8')).data;
  const panelsocial = [];
  for (let i = 1; i < panelsocialRaw.length; i++) {
    if (panelsocialRaw[i].length < 5) continue;
    panelsocial.push({
      id: parseInt(panelsocialRaw[i][0].replace(/\D/g, '')),
      name: panelsocialRaw[i][1],
      rate: parseFloat(panelsocialRaw[i][2].replace(/,/g, '').trim()),
    });
  }
  console.log(`Loaded ${panelsocial.length} services from panelsocial.club`);
  
  // Filtering for Thai services
  const isThai = (name) => /thai|th|ไทย|🇹🇭/i.test(name);
  
  const ads4uThai = ads4u.filter(s => isThai(s.name));
  const psThai = panelsocial.filter(s => isThai(s.name));
  
  console.log(`\n--- Thai Services Count ---`);
  console.log(`Ads4U: ${ads4uThai.length} Thai services`);
  console.log(`PanelSocial: ${psThai.length} Thai services`);
  
  // Let's do some keyword matching for comparison
  const keywords = [
    { key: 'ไอจี', desc: 'IG' },
    { key: 'เฟซบุ๊ค|facebook|เฟส', desc: 'Facebook' },
    { key: 'ติ๊กต๊อก|tiktok', desc: 'TikTok' },
    { key: 'line', desc: 'LINE' },
    { key: 'ทวิต|twitter|x', desc: 'Twitter/X' }
  ];
  
  console.log(`\n--- Thai Services by Platform ---`);
  for (const kw of keywords) {
    const regex = new RegExp(kw.key, 'i');
    const aCount = ads4uThai.filter(s => regex.test(s.name)).length;
    const pCount = psThai.filter(s => regex.test(s.name)).length;
    console.log(`${kw.desc}: Ads4U = ${aCount} | PanelSocial = ${pCount}`);
  }
  
  // Price Comparison on common services
  // We will print a few cheap services from each
  console.log(`\n--- Cheapest Thai Services Sample ---`);
  
  const printCheap = (platform, items) => {
    console.log(`\n${platform} Top 5 Cheapest Thai Services:`);
    items.sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate))
         .slice(0, 5)
         .forEach(s => console.log(`- ฿${parseFloat(s.rate).toFixed(2)} | ${s.name}`));
  }
  
  printCheap('Ads4U', ads4uThai);
  printCheap('PanelSocial', psThai);
  
}

main().catch(console.error);
