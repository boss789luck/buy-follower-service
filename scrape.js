const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Navigating to login page...");
  await page.goto('https://panelsocial.club/', { waitUntil: 'networkidle2' });
  
  console.log("Typing credentials...");
  await page.type('#username', 'Boss789');
  await page.type('#password', 'ZXb3ksEQ@veH@bu');
  
  console.log("Submitting login form...");
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);
  
  console.log("Navigating to services page...");
  await page.goto('https://panelsocial.club/services', { waitUntil: 'networkidle2' });
  
  // Extract services
  console.log("Extracting services...");
  const data = await page.evaluate(() => {
    // Attempt to extract window.modules.services if it exists
    if (window.modules && window.modules.services) {
      return { source: 'window', data: window.modules.services };
    }
    
    // Otherwise try to extract from table
    const services = [];
    const rows = document.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      services.push(Array.from(cells).map(cell => cell.innerText.trim()));
    });
    return { source: 'table', data: services };
  });

  fs.writeFileSync('services.json', JSON.stringify(data, null, 2));
  console.log("Services extracted and saved to services.json!");
  
  await browser.close();
})();
