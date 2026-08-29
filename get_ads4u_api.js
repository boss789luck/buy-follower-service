const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('https://ads4u.co/', { waitUntil: 'networkidle2' });
  
  await page.type('input[name="LoginForm[username]"], #username', 'Boss789');
  await page.type('input[name="LoginForm[password]"], #password', 'Pa3aZW+3givr5te');
  
  await Promise.all([
    page.click('button[type="submit"], input[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
  ]);
  
  await page.goto('https://ads4u.co/api', { waitUntil: 'networkidle2' });
  const apiKey = await page.evaluate(() => {
    const keyInput = document.querySelector('#key, input[name="key"]');
    return keyInput ? keyInput.value : null;
  });
  
  console.log("API Key from /api:", apiKey);
  
  await page.goto('https://ads4u.co/account', { waitUntil: 'networkidle2' });
  const accountApiKey = await page.evaluate(() => {
    const keyInput = document.querySelector('#key, input[name="key"]');
    return keyInput ? keyInput.value : null;
  });
  
  console.log("API Key from /account:", accountApiKey);
  
  // If no key, maybe we need to generate one
  if (!accountApiKey && !apiKey) {
    console.log("No key found. HTML of /account:");
    const html = await page.content();
    fs.writeFileSync('ads4u_account.html', html);
  } else {
    fs.writeFileSync('ads4u_api_key.txt', apiKey || accountApiKey);
  }
  
  await browser.close();
})();
