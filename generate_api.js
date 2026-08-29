const puppeteer = require('puppeteer');

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
  
  const hasKey = await page.evaluate(() => {
    const keyInput = document.querySelector('#key');
    return keyInput && keyInput.value ? keyInput.value : null;
  });
  
  if (hasKey) {
    console.log("Existing API Key found:", hasKey);
  } else {
    console.log("No API Key found, generating one...");
    await Promise.all([
      page.click('form[action="/account/newkey"] button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    const newKey = await page.evaluate(() => {
      const keyInput = document.querySelector('#key');
      return keyInput ? keyInput.value : null;
    });
    console.log("New API Key:", newKey);
  }
  
  await browser.close();
})();
