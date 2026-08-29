const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://panelsocial.club/', { waitUntil: 'networkidle2' });
  await page.type('#username', 'Boss789');
  await page.type('#password', 'ZXb3ksEQ@veH@bu');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);
  await page.goto('https://panelsocial.club/account', { waitUntil: 'networkidle2' });
  
  const content = await page.content();
  fs.writeFileSync('account_page.html', content);
  console.log("HTML saved to account_page.html");
  
  await browser.close();
})();
