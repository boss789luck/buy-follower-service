const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.on('dialog', async dialog => {
    console.log("Dialog message:", dialog.message());
    await dialog.accept();
  });
  await page.goto('https://panelsocial.club/', { waitUntil: 'networkidle2' });
  await page.type('#username', 'Boss789');
  await page.type('#password', 'ZXb3ksEQ@veH@bu');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);
  await page.goto('https://panelsocial.club/account', { waitUntil: 'networkidle2' });
  
  await Promise.all([
    page.click('form[action="/account/newkey"] button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
  
  const html = await page.content();
  const alertText = await page.evaluate(() => {
    const el = document.querySelector('.alert');
    return el ? el.innerText : null;
  });
  console.log("Alert on page after submit:", alertText);
  
  await browser.close();
})();
