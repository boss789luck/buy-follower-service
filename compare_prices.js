const fs = require('fs');

const ads4u = JSON.parse(fs.readFileSync('ads4u_services_api.json', 'utf8'));

const psRaw = JSON.parse(fs.readFileSync('services.json', 'utf8')).data;
const ps = [];
for(let i=1; i<psRaw.length; i++) {
  if (psRaw[i].length < 5) continue;
  ps.push({
    name: psRaw[i][1],
    rate: parseFloat(psRaw[i][2].replace(/,/g, '').trim())
  });
}

const findCheapest = (arr, regex) => {
  const matches = arr.filter(s => regex.test(s.name));
  if (matches.length === 0) return 'N/A';
  matches.sort((a,b) => parseFloat(a.rate) - parseFloat(b.rate));
  return `฿${parseFloat(matches[0].rate).toFixed(2)} (${matches[0].name})`;
};

console.log("=== THAI IG FOLLOWERS ===");
console.log("Ads4U:", findCheapest(ads4u, /ผู้ติดตาม.*(ไอจี|instagram).*(ไทย|thailand)/i));
console.log("PanelSocial:", findCheapest(ps, /ผู้ติดตาม.*(ไอจี|instagram).*(ไทย|thailand)/i));

console.log("\n=== THAI TIKTOK FOLLOWERS ===");
console.log("Ads4U:", findCheapest(ads4u, /ผู้ติดตาม.*(tiktok|ติ๊กต๊อก).*(ไทย|thailand)/i));
console.log("PanelSocial:", findCheapest(ps, /ผู้ติดตาม.*(tiktok|ติ๊กต๊อก).*(ไทย|thailand)/i));

console.log("\n=== THAI FB PAGE LIKES/FOLLOWERS ===");
console.log("Ads4U:", findCheapest(ads4u, /(ติดตาม|ผู้ติดตาม|ไลค์|ไลก์|ถูกใจ).*เพจ.*(facebook|เฟซบุ๊ค|เฟส).*(ไทย|thailand)/i));
console.log("PanelSocial:", findCheapest(ps, /(ติดตาม|ผู้ติดตาม|ไลค์|ไลก์|ถูกใจ).*เพจ.*(facebook|เฟซบุ๊ค|เฟส).*(ไทย|thailand)/i));
