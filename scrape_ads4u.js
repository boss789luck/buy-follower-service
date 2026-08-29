const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  console.log("Navigating to ads4u.co...");
  await page.goto('https://ads4u.co/', { waitUntil: 'networkidle2' });
  
  console.log("Typing credentials...");
  await page.type('input[name="LoginForm[username]"], #username', 'Boss789');
  await page.type('input[name="LoginForm[password]"], #password', 'Pa3aZW+3givr5te');
  
  console.log("Clicking submit...");
  await Promise.all([
    page.click('button[type="submit"], input[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => console.log("Navigation timeout")),
  ]);
  
  console.log("URL after login:", page.url());
  
  console.log("Navigating to /services...");
  await page.goto('https://ads4u.co/services', { waitUntil: 'networkidle2' });
  
  const servicesData = await page.evaluate(() => {
    if (window.modules && window.modules.services) {
      return window.modules.services;
    }
    const rows = Array.from(document.querySelectorAll('tr'));
    return rows.slice(1).map(row => {
      const cells = row.querySelectorAll('td');
      return cells.length >= 5 ? {
        id: cells[0].innerText.trim(),
        name: cells[1].innerText.trim(),
        price: cells[2].innerText.trim()
      } : null;
    }).filter(x => x);
  });
  
  fs.writeFileSync('ads4u_services_raw.json', JSON.stringify(servicesData, null, 2));
  console.log("Saved", servicesData.length, "services from ads4u.co");
  
  await browser.close();
})();
