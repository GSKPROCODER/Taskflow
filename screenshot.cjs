const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
    const page = await context.newPage();
    
    console.log("Navigating to login...");
    await page.goto('http://localhost:5173/login');
    
    console.log("Bypassing auth...");
    // Just inject a fake user session into localStorage to bypass AuthProvider
    await page.evaluate(() => {
      localStorage.setItem('taskflow-auth-storage', JSON.stringify({
        state: { user: { id: "1", name: "Sarah Chen", email: "sarah@example.com", role: "developer" }, token: "fake-token" },
        version: 0
      }));
    });
    
    console.log("Navigating to Reports...");
    await page.goto('http://localhost:5173/reports');
    await page.waitForTimeout(2000); // wait for UI and fonts to load
    
    console.log("Taking screenshot...");
    await page.screenshot({ path: 'C:\\Users\\ARIYAN\\.gemini\\antigravity-ide\\brain\\f798e8ac-c02b-4f4e-9e65-f8beed2f96ae\\reports_dashboard_preview.png', fullPage: true });
    
    await browser.close();
    console.log("Done.");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
