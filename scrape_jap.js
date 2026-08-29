const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('https://justanotherpanel.com/', { waitUntil: 'networkidle2' });
  await page.type('#username', 'Boss789');
  await page.type('#password', 'CDm4w4@@Fqte2rt');
  
  await Promise.all([
    page.click('input[type="submit"][value="Login"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);
  
  await page.goto('https://justanotherpanel.com/api', { waitUntil: 'networkidle2' });
  const apiKey = await page.evaluate(() => {
    const keyInput = document.querySelector('#key, input[name="key"]');
    return keyInput ? keyInput.value : null;
  });
  
  console.log("JAP API Key:", apiKey);
  if (apiKey) fs.writeFileSync('jap_api_key.txt', apiKey);

  await page.goto('https://justanotherpanel.com/services', { waitUntil: 'networkidle2' });
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
  
  fs.writeFileSync('jap_services_raw.json', JSON.stringify(servicesData, null, 2));
  console.log("Saved", servicesData.length, "services from JAP");
  
  await browser.close();
})();
