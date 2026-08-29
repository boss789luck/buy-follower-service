const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('services.json', 'utf8'));
const table = raw.data;

const services = [];

// Skip header (index 0)
for (let i = 1; i < table.length; i++) {
  const row = table[i];
  // [ "ID", "Name", "Rate", "Min", "Max", "Desc" ]
  // rate can be e.g. "1750.00", min can be "50", max can be "5 000" (contains non-breaking space)
  
  if (row.length < 5) continue;
  
  const id = parseInt(row[0].replace(/\D/g, ''));
  const name = row[1];
  const originalPrice = parseFloat(row[2].replace(/,/g, '').trim());
  const newPrice = originalPrice * 2;
  const min = parseInt(row[3].replace(/\D/g, ''));
  const max = parseInt(row[4].replace(/\D/g, ''));
  
  services.push({
    id,
    name,
    originalPrice,
    price: newPrice,
    min,
    max,
    category: "General" // Will categorize later if needed
  });
}

fs.writeFileSync('src/data/services.json', JSON.stringify(services, null, 2));
console.log(`Saved ${services.length} services with x2 pricing to src/data/services.json`);
