const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('https://ads4u.co/', { waitUntil: 'networkidle2' });
  
  // Click the CTA button to open the login sheet
  try {
    await page.click('[data-a4-login], a[href="#login"]');
    await page.waitForTimeout(1000); // wait for animation
  } catch (e) {
    console.log("No custom login button found, proceeding normally...");
  }
  
  await page.type('#a4LoginSheet input[name="LoginForm[username]"], form.login-form input[name="LoginForm[username]"]', 'Boss789');
  await page.type('#a4LoginSheet input[name="LoginForm[password]"], form.login-form input[name="LoginForm[password]"]', 'Pa3aZW+3givr5te');
  
  await Promise.all([
    page.click('#a4LoginSheet input[type="submit"], form.login-form input[type="submit"], form.login-form button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
  ]);
  
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
  
  if (servicesData && servicesData.length > 20) {
    fs.writeFileSync('ads4u_services_raw.json', JSON.stringify(servicesData, null, 2));
    console.log("Saved", servicesData.length, "services from ads4u.co");
  } else {
    console.log("Failed to get full services. Only got:", servicesData ? servicesData.length : 0);
  }
  
  await browser.close();
})();
