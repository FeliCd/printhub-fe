const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: false
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  console.log('Navigating to https://makerworld.com/en ...');
  
  try {
    const response = await page.goto('https://makerworld.com/en', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    
    console.log('Status code:', response ? response.status() : 'None');
    console.log('\n==================================================================');
    console.log('Vui lòng kiểm tra cửa sổ trình duyệt Chromium vừa mở.');
    console.log('Nếu gặp trang xác thực Cloudflare (Verify you are human), hãy click/hoàn thành nó.');
    console.log('Sau khi trang MakerWorld đã load xong trang chủ, nhấn [ENTER] trong terminal này để lưu HTML.');
    console.log('==================================================================\n');
    
    // Wait for user to press Enter in terminal
    await new Promise(resolve => process.stdin.once('data', resolve));
    
    const htmlContent = await page.content();
    const outputDir = path.join(__dirname, 'makerworld_static');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(outputDir, 'index.html'), htmlContent, 'utf-8');
    console.log('HTML saved to makerworld_static/index.html');
  } catch (error) {
    console.error('Error during navigation:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
