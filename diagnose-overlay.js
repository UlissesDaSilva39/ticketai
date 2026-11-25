const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to http://127.0.0.1:3000/home...');
  await page.goto('http://127.0.0.1:3000/home', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  // Find the Me button
  const meBtn = await page.locator('button:has-text("Me")').first();
  const btnExists = await meBtn.count() > 0;
  console.log('\n=== Me button found:', btnExists);
  
  if (btnExists) {
    const box = await meBtn.boundingBox();
    console.log('Button position:', JSON.stringify(box));
    
    // Check what's on top at the button's center
    if (box) {
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;
      
      const topEl = await page.evaluate(({x, y}) => {
        const el = document.elementFromPoint(x, y);
        return el ? {
          tag: el.tagName,
          className: el.className,
          id: el.id,
          text: el.textContent?.substring(0, 50)
        } : null;
      }, { x: centerX, y: centerY });
      
      console.log('\n=== Element ON TOP of button:');
      console.log(JSON.stringify(topEl, null, 2));
      
      // Check if it's the button
      const isButtonOnTop = await page.evaluate(({x, y}) => {
        const el = document.elementFromPoint(x, y);
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.trim().startsWith('Me'));
        return el === btn || btn?.contains(el);
      }, { x: centerX, y: centerY });
      
      console.log('\nIs button actually on top?', isButtonOnTop);
    }
    
    // Try clicking
    console.log('\n=== Clicking Me...');
    await meBtn.click({ timeout: 5000 }).catch(e => console.log('Click failed:', e.message));
    await page.waitForTimeout(500);
    
    // Check for dropdown
    const dropdown = await page.locator('a:has-text("View Profile")').first();
    const dropdownExists = await dropdown.count() > 0;
    console.log('Dropdown visible after click:', dropdownExists);
    
    if (dropdownExists) {
      const ddBox = await dropdown.boundingBox();
      console.log('Dropdown position:', JSON.stringify(ddBox));
    }
  }
  
  // Check console errors
  console.log('\n=== Checking for hydration errors...');
  
  await browser.close();
})().catch(e => console.error('Error:', e.message));