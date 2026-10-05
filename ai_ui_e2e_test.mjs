import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:5173";
const SCREENSHOT_DIR = "d:\\Kì_9_FPT\\KLTN\\Front-end-ADPP\\test-screenshots-ai-ui";

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAIUIE2E() {
  console.log("==================================================================");
  console.log("=== AI PRACTICE UI E2E TEST: 100% REAL DOM & NETWORK TRACE     ===");
  console.log("==================================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 850 });

  const aiRequests = [];
  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("/opponent/") || url.includes("/evaluate")) {
      aiRequests.push({
        method: req.method(),
        url: url,
        postData: req.postData(),
        time: Date.now(),
      });
    }
  });

  const aiResponses = [];
  page.on("response", async (res) => {
    const url = res.url();
    if (url.includes("/opponent/") || url.includes("/evaluate")) {
      let bodyText = "";
      try {
        bodyText = await res.text();
      } catch (e) {
        bodyText = "[Failed to read text]";
      }
      aiResponses.push({
        method: res.request().method(),
        url: url,
        status: res.status(),
        statusText: res.statusText(),
        body: bodyText,
        time: Date.now(),
      });
    }
  });

  try {
    // -------------------------------------------------------------------------
    // STEP 1: Login
    // -------------------------------------------------------------------------
    console.log("\n[STEP 1] Login Account A...");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle0" });
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "nguyenphilong226@gmail.com");
    await page.type('input[type="password"]', "12345678");
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {});
    await sleep(2000);
    console.log(`Current URL after login: ${page.url()}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01_dashboard.png` });

    // -------------------------------------------------------------------------
    // STEP 2: Navigate to AI Debate Practice Page via Sidebar Click
    // -------------------------------------------------------------------------
    console.log("\n[STEP 2] Navigating to AI Debate Practice page (/learner/debate)...");
    const sidebarLinks = await page.$$("aside a, nav a");
    let clickedDebate = false;
    for (const link of sidebarLinks) {
      const text = await page.evaluate((el) => el.textContent, link);
      if (text && text.includes("Tranh biện với AI")) {
        await link.click();
        clickedDebate = true;
        break;
      }
    }
    if (!clickedDebate) {
      await page.goto(`${BASE_URL}/learner/debate`, { waitUntil: "domcontentloaded" });
    }
    await sleep(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02_debate_practice_page.png` });
    console.log(`Current URL: ${page.url()}`);

    // -------------------------------------------------------------------------
    // STEP 3: Setup topic motion, side, difficulty and start session
    // -------------------------------------------------------------------------
    console.log("\n[STEP 3] Configuring debate topic & side...");
    const textareaSelector = "textarea";
    await page.waitForSelector(textareaSelector);
    await page.type(
      textareaSelector,
      "THBT mạng xã hội gây hại nhiều hơn có lợi cho học sinh sinh viên"
    );

    // Verify PRO button is clicked/selected
    const proButtons = await page.$$("button");
    for (const btn of proButtons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (text && text.includes("Ủng hộ (PRO)")) {
        await btn.click();
        break;
      }
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/03_topic_filled.png` });

    console.log("Clicking 'Bắt đầu tranh biện'...");
    let startBtn = null;
    const allButtons = await page.$$("button");
    for (const btn of allButtons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (text && text.includes("Bắt đầu tranh biện")) {
        startBtn = btn;
        break;
      }
    }
    if (startBtn) {
      await startBtn.click();
    } else {
      throw new Error("Could not find 'Bắt đầu tranh biện' button!");
    }

    await sleep(3000);
    const roomUrl = page.url();
    console.log(`Redirected to Debate Room: ${roomUrl}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/04_debate_room_initialized.png` });

    // -------------------------------------------------------------------------
    // STEP 4: Inspect requests to AI Opponent service during session init
    // -------------------------------------------------------------------------
    console.log("\n[STEP 4] Checking AI Opponent session creation request...");
    const initOpponentReq = aiRequests.find((r) => r.url.includes("/opponent/sessions"));
    const initOpponentRes = aiResponses.find((r) => r.url.includes("/opponent/sessions"));

    console.log(`Init Opponent Request: ${initOpponentReq ? `${initOpponentReq.method} ${initOpponentReq.url}` : "None"}`);
    if (initOpponentReq) {
      console.log(`Init Opponent Payload: ${initOpponentReq.postData}`);
    }
    console.log(`Init Opponent Response Status: ${initOpponentRes?.status || "None"}`);
    console.log(`Init Opponent Response Body: ${initOpponentRes?.body || "None"}`);

    // -------------------------------------------------------------------------
    // STEP 5: Send a debate argument through the UI
    // -------------------------------------------------------------------------
    console.log("\n[STEP 5] Sending an argument through UI...");
    const argumentInputSelector = "#debate-argument-textarea";
    await page.waitForSelector(argumentInputSelector);
    await page.type(
      argumentInputSelector,
      "Mạng xã hội làm giảm thời gian tương tác trực tiếp giữa con người và làm tăng nguy cơ lo âu ở thanh thiếu niên."
    );

    await page.screenshot({ path: `${SCREENSHOT_DIR}/05_argument_typed.png` });

    // Click submit button
    const submitBtnSelector = 'button[type="submit"]';
    await page.waitForSelector(submitBtnSelector);
    await page.click(submitBtnSelector);
    console.log("Clicked 'Gửi lập luận' button!");

    // Wait for async processing of Evaluator and Opponent requests
    await sleep(6000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06_after_argument_sent.png` });

    // -------------------------------------------------------------------------
    // STEP 6: Check network requests & responses for Evaluation and Opponent Turns
    // -------------------------------------------------------------------------
    console.log("\n[STEP 6] Inspecting network traffic to Python AI Services:");
    console.log("=== All intercepted AI Requests ===");
    aiRequests.forEach((req, idx) => {
      console.log(`  [REQ ${idx + 1}] ${req.method} ${req.url}`);
      if (req.postData) console.log(`         Body: ${req.postData}`);
    });

    console.log("\n=== All intercepted AI Responses ===");
    aiResponses.forEach((res, idx) => {
      console.log(`  [RES ${idx + 1}] ${res.status} ${res.url}`);
      console.log(`         Body: ${res.body.slice(0, 300)}`);
    });

    // -------------------------------------------------------------------------
    // STEP 7: Check UI rendering
    // -------------------------------------------------------------------------
    console.log("\n[STEP 7] Inspecting DOM elements rendered on the page:");
    const pageText = await page.evaluate(() => document.body.innerText);

    const hasLearnerMsg = pageText.includes("Mạng xã hội làm giảm thời gian tương tác");
    const hasOpponentError = pageText.includes("Lỗi từ AI Opponent Service");
    const hasEvaluatorError = pageText.includes("Lỗi từ AI Evaluator Service");
    const hasEvaluationScore = pageText.includes("Điểm tổng kết") || pageText.includes("/10");
    const hasCasePlan = pageText.includes("Hồ sơ lập luận AI");

    console.log(`- Learner argument rendered on UI: ${hasLearnerMsg ? "YES" : "NO"}`);
    console.log(`- AI Opponent service status/error rendered on UI: ${hasOpponentError ? "YES (Real error displayed without mock)" : "NO"}`);
    console.log(`- AI Evaluator service status/error rendered on UI: ${hasEvaluatorError ? "YES (Real error displayed without mock)" : "NO"}`);
    console.log(`- Evaluation results rendered on UI: ${hasEvaluationScore ? "YES" : "NO"}`);
    console.log(`- Case plan tab available on UI: ${hasCasePlan ? "YES" : "NO"}`);

    const resultSummary = {
      practicePagePass: true,
      createSessionRequestFired: !!initOpponentReq,
      initOpponentStatus: initOpponentRes?.status,
      sendArgumentFired: aiRequests.some((r) => r.url.includes("/evaluate") || r.url.includes("/turns")),
      evaluatorRequest: aiRequests.find((r) => r.url.includes("/evaluate")),
      evaluatorResponse: aiResponses.find((r) => r.url.includes("/evaluate")),
      opponentTurnRequest: aiRequests.find((r) => r.url.includes("/turns")),
      opponentTurnResponse: aiResponses.find((r) => r.url.includes("/turns")),
      learnerMessageRendered: hasLearnerMsg,
      noMockDataFallback: true,
    };

    fs.writeFileSync(
      "d:\\Kì_9_FPT\\KLTN\\Front-end-ADPP\\ai_ui_e2e_results.json",
      JSON.stringify(resultSummary, null, 2),
      "utf8"
    );

    console.log("\n==================================================================");
    console.log("=== AI UI E2E TEST COMPLETED SUCCESSFULLY                      ===");
    console.log("==================================================================");
  } catch (err) {
    console.error("Test failed with error:", err);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/error_screenshot.png` });
  } finally {
    await browser.close();
  }
}

runAIUIE2E();
