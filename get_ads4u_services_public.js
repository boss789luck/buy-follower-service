const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('https://ads4u.co/services', { waitUntil: 'networkidle2' });
  
  const servicesData = await page.evaluate(() => {
    if (window.modules && window.modules.services) {
      return window.modules.services;
    }
    return null;
  });
  
  if (servicesData) {
    fs.writeFileSync('ads4u_services_raw.json', JSON.stringify(servicesData, null, 2));
    console.log("Saved", servicesData.length, "services from ads4u.co directly from window.modules");
  } else {
    console.log("window.modules.services not found");
  }
  
  await browser.close();
})();
