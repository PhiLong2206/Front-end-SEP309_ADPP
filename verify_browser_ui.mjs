import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:5173";
const SCREENSHOT_DIR = "d:\\Kì_9_FPT\\KLTN\\Front-end-ADPP\\test-screenshots-final";

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runBrowserTest() {
  console.log("Starting Browser End-to-End Verification...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,800"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // 1. Visit Login Page
    console.log("Navigating to login page...");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01_login_page.png` });

    // 2. Login User A
    console.log("Logging in as nguyenphilong226@gmail.com...");
    await page.type('input[type="email"], input[name="email"]', "nguyenphilong226@gmail.com");
    await page.type('input[type="password"], input[name="password"]', "12345678");
    await page.click('button[type="submit"]');

    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02_after_login_userA.png` });
    console.log("Logged in successfully, current URL:", page.url());

    // 3. Visit Competitions
    console.log("Visiting Competitions page...");
    await page.goto(`${BASE_URL}/learner/competitions`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/03_competitions.png` });

    // 4. Visit Debate Practice Setup
    console.log("Visiting Debate Practice page...");
    await page.goto(`${BASE_URL}/learner/debate`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/04_debate_practice.png` });

    // 5. Visit 1v1 Challenges
    console.log("Visiting Debate 1v1 page...");
    await page.goto(`${BASE_URL}/learner/debate-1v1`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/05_debate_1v1_userA.png` });

    // 6. Visit Debate History
    console.log("Visiting Debate History page...");
    await page.goto(`${BASE_URL}/learner/debate-history`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06_debate_history_userA.png` });

    // 7. Clear storage to switch to User B
    console.log("Switching to User B (longnpse180044@fpt.edu.vn)...");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1000));
    await page.type('input[type="email"], input[name="email"]', "longnpse180044@fpt.edu.vn");
    await page.type('input[type="password"], input[name="password"]', "12345678");
    await page.click('button[type="submit"]');

    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/07_after_login_userB.png` });

    // 8. Visit 1v1 Challenges for User B
    console.log("Visiting Debate 1v1 page for User B...");
    await page.goto(`${BASE_URL}/learner/debate-1v1`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/08_debate_1v1_userB.png` });

    console.log("All UI Browser tests completed successfully!");
  } catch (err) {
    console.error("Browser test error:", err);
  } finally {
    await browser.close();
  }
}

runBrowserTest();
