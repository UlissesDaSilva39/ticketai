const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Capture console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  
  console.log('Opening http://127.0.0.1:3000/home...');
  await page.goto('http://127.0.0.1:3000/home', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  // =====================================================
  // TEST 1: Find Me button
  // =====================================================
  console.log('\n=== TEST 1: Me button ===');
  const meBtn = page.locator('button:has-text("Me")').first();
  const meCount = await meBtn.count();
  console.log('Me button found:', meCount > 0);
  
  if (meCount > 0) {
    const box = await meBtn.boundingBox();
    console.log('Button rect:', JSON.stringify(box));
    
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      
      // Check what's on top
      const topEl = await page.evaluate(({x, y}) => {
        const el = document.elementFromPoint(x, y);
        return el ? { tag: el.tagName, className: el.className?.substring(0, 100), id: el.id } : null;
      }, { x: cx, y: cy });
      
      console.log('Element ON TOP of button:', JSON.stringify(topEl));
      
      const isBtnOnTop = await page.evaluate(({x, y}) => {
        const el = document.elementFromPoint(x, y);
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.trim().startsWith('Me'));
        return el === btn || btn?.contains(el);
      }, { x: cx, y: cy });
      
      console.log('Is button on top?', isBtnOnTop);
    }
    
    // Try clicking
    console.log('\nClicking Me...');
    await meBtn.click({ timeout: 5000 }).catch(e => console.log('Click failed:', e.message));
    await page.waitForTimeout(500);
    
    // Check for dropdown
    const dropdown = page.locator('a:has-text("View Profile")').first();
    const ddCount = await dropdown.count();
    console.log('Dropdown appeared after click:', ddCount > 0);
    
    if (ddCount > 0) {
      const ddBox = await dropdown.boundingBox();
      console.log('Dropdown visible at:', JSON.stringify(ddBox));
    }
  }
  
  // =====================================================
  // TEST 2: For Business button
  // =====================================================
  console.log('\n=== TEST 2: For Business button ===');
  const bizBtn = page.locator('button:has-text("For Business")').first();
  const bizCount = await bizBtn.count();
  console.log('For Business button found:', bizCount > 0);
  
  if (bizCount > 0) {
    const box = await bizBtn.boundingBox();
    console.log('Button rect:', JSON.stringify(box));
    
    console.log('\nClicking For Business...');
    await bizBtn.click({ timeout: 5000 }).catch(e => console.log('Click failed:', e.message));
    await page.waitForTimeout(500);
    
    // Check for business dropdown content
    const bizDropdown = page.locator('text=Venue Dashboard').first();
    const bizDdCount = await bizDropdown.count();
    console.log('Business dropdown appeared:', bizDdCount > 0);
  }
  
  // =====================================================
  // TEST 3: Console errors
  // =====================================================
  console.log('\n=== TEST 3: Console errors ===');
  if (consoleErrors.length === 0) {
    console.log('No console errors');
  } else {
    console.log('Found', consoleErrors.length, 'errors:');
    consoleErrors.slice(0, 5).forEach(e => console.log('  -', e.substring(0, 200)));
  }
  
  // =====================================================
  // TEST 4: List all elements at Me button position
  // =====================================================
  console.log('\n=== TEST 4: All elements at Me position ===');
  if (meCount > 0) {
    const box = await meBtn.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      
      const elements = await page.evaluate(({x, y}) => {
        const results = [];
        const stack = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [document.elementFromPoint(x, y)];
        stack.slice(0, 10).forEach(el => {
          if (el) {
            results.push({ tag: el.tagName, className: el.className?.substring(0, 80), id: el.id });
          }
        });
        return results;
      }, { x: cx, y: cy });
      
      elements.forEach((el, i) => {
        console.log(`  ${i}: ${el.tag} .${el.className} #${el.id}`);
      });
    }
  }
  
  await browser.close();
  console.log('\n=== TEST COMPLETE ===');
  
})().catch(e => {
  console.error('Fatal error:', e.message);
  process.exit(1);
});