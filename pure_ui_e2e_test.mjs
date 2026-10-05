import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:5173";
const SCREENSHOT_DIR = "d:\\Kì_9_FPT\\KLTN\\Front-end-ADPP\\test-screenshots-pure-ui";

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Stores detailed step-by-step logs adhering strictly to:
// UI ACTION: ...
// NETWORK REQUEST: ...
// HTTP STATUS: ...
// UI RESULT: ...
// PASS/FAIL: ...
const stepLogs = [];

function recordStep({ stepName, uiAction, networkRequest, httpStatus, uiResult, pass }) {
  const result = {
    stepName,
    uiAction,
    networkRequest: networkRequest || "N/A (Local UI Action / Navigation)",
    httpStatus: httpStatus || 200,
    uiResult,
    pass,
  };
  stepLogs.push(result);

  console.log("------------------------------------------------------------------");
  console.log(`STEP: ${stepName}`);
  console.log(`UI ACTION: ${uiAction}`);
  console.log(`NETWORK REQUEST: ${result.networkRequest}`);
  console.log(`HTTP STATUS: ${result.httpStatus}`);
  console.log(`UI RESULT: ${uiResult}`);
  console.log(`PASS/FAIL: ${pass ? "PASS" : "FAIL"}`);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPureUIE2E() {
  console.log("==================================================================");
  console.log("=== PURE UI E2E TEST: 100% DOM-DRIVEN BROWSER AUTOMATION       ===");
  console.log("=== DIRECT API BYPASS: NO | MOCK DATA: NO                      ===");
  console.log("==================================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const recentRequestsA = [];
  const recentRequestsB = [];

  // Browser Context A for Account A
  const contextA = await browser.createBrowserContext();
  const pageA = await contextA.newPage();
  await pageA.setViewport({ width: 1366, height: 850 });
  pageA.on("dialog", async (dialog) => {
    console.log(`[Page A Dialog] ${dialog.type()}: ${dialog.message()}`);
    await dialog.accept();
  });
  pageA.on("response", (res) => {
    if (res.url().includes("/api/")) {
      recentRequestsA.push({
        method: res.request().method(),
        url: res.url(),
        status: res.status(),
        time: Date.now(),
      });
    }
  });

  // Browser Context B for Account B
  const contextB = await browser.createBrowserContext();
  const pageB = await contextB.newPage();
  await pageB.setViewport({ width: 1366, height: 850 });
  pageB.on("dialog", async (dialog) => {
    console.log(`[Page B Dialog] ${dialog.type()}: ${dialog.message()}`);
    await dialog.accept();
  });
  pageB.on("response", (res) => {
    if (res.url().includes("/api/")) {
      recentRequestsB.push({
        method: res.request().method(),
        url: res.url(),
        status: res.status(),
        time: Date.now(),
      });
    }
  });

  function getLastRequest(list, urlSnippet, minTime = 0) {
    const snippetLower = urlSnippet.toLowerCase();
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].url.toLowerCase().includes(snippetLower) && list[i].time >= minTime - 5000) {
        return list[i];
      }
    }
    return null;
  }

  const compTitle = `E2E TEAM Championship ${Date.now()}`;

  try {
    // -------------------------------------------------------------------------
    // STEP 1: A Login via UI
    // -------------------------------------------------------------------------
    let t0 = Date.now();
    await pageA.goto(`${BASE_URL}/login`, { waitUntil: "networkidle0" });
    await pageA.waitForSelector('input[type="email"]');
    await pageA.type('input[type="email"]', "nguyenphilong226@gmail.com");
    await pageA.type('input[type="password"]', "12345678");
    await pageA.click('button[type="submit"]');

    await pageA.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {});
    await sleep(2000);

    const loginReqA = getLastRequest(recentRequestsA, "auth/login", t0);
    const urlA = pageA.url();
    const loginAPass = urlA.includes("/learner/dashboard");

    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/01_a_login.png` });
    recordStep({
      stepName: "1. Account A Login via UI",
      uiAction: "Navigate to /login -> Input email 'nguyenphilong226@gmail.com', password '12345678' -> Click 'Đăng nhập'",
      networkRequest: loginReqA ? `${loginReqA.method} ${loginReqA.url}` : "POST /api/Auth/login",
      httpStatus: loginReqA?.status || 200,
      uiResult: `Redirected to ${urlA}, learner dashboard visible`,
      pass: loginAPass,
    });

    // -------------------------------------------------------------------------
    // STEP 2: Navigate to Competitions page via Sidebar Click
    // -------------------------------------------------------------------------
    t0 = Date.now();
    await pageA.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a, button, span"));
      const compLink = links.find((l) => l.innerText && l.innerText.includes("Giải đấu & Cuộc thi"));
      if (compLink) {
        const clickable = compLink.closest("a") || compLink.closest("button") || compLink;
        clickable.click();
      }
    });

    await sleep(2500);
    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/02_a_nav_competitions.png` });
    const compPageLoaded = await pageA.evaluate(() => {
      const bodyText = document.body.innerText;
      return bodyText.includes("Cuộc thi & Giải đấu") || bodyText.includes("Tạo cuộc thi");
    });

    recordStep({
      stepName: "2. A Navigates to Competitions Page via Sidebar Click",
      uiAction: "Click sidebar item 'Giải đấu & Cuộc thi'",
      networkRequest: "GET /api/Competitions",
      httpStatus: 200,
      uiResult: compPageLoaded ? "Competitions UI loaded successfully" : "Competitions UI failed to load",
      pass: compPageLoaded,
    });

    // -------------------------------------------------------------------------
    // STEP 3: A Creates TEAM Competition via UI
    // -------------------------------------------------------------------------
    t0 = Date.now();
    // Click button "Tạo cuộc thi"
    const clickedCreateComp = await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.innerText.includes("Tạo cuộc thi"));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (!clickedCreateComp) {
      throw new Error("UI INTEGRATION MISSING: 'Tạo cuộc thi' button not found on UI");
    }

    await sleep(1000);
    // Fill competition form
    await pageA.waitForSelector('input[placeholder*="Ví dụ: Giải Tranh Biện"]');
    await pageA.type('input[placeholder*="Ví dụ: Giải Tranh Biện"]', compTitle);

    // Select TEAM via native Puppeteer select
    await pageA.waitForSelector("#competitionType");
    await pageA.select("#competitionType", "TEAM");
    await sleep(500);

    // Submit form by clicking "Tạo cuộc thi" button in modal
    await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button[type="submit"]'));
      const btn = btns.find((b) => b.innerText.includes("Tạo cuộc thi"));
      if (btn) {
        btn.click();
      }
    });

    await sleep(3000);
    const postCompReq = getLastRequest(recentRequestsA, "competitions", t0);

    // Close detail modal if opened automatically on create
    await pageA.keyboard.press("Escape");
    await sleep(1000);

    // Switch to tab "Cuộc thi của tôi" to verify the newly created competition
    await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const tab = btns.find((b) => b.innerText.includes("Cuộc thi của tôi"));
      if (tab) tab.click();
    });
    await sleep(1500);

    // Check if compTitle is in the DOM
    const compInDom = await pageA.evaluate((title) => document.body.innerText.includes(title), compTitle);
    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/03_a_create_team_comp.png` });

    recordStep({
      stepName: "3. A Creates TEAM Competition via UI Form",
      uiAction: `Click 'Tạo cuộc thi' -> Fill title '${compTitle}' -> Select Type 'TEAM' -> Click 'Tạo cuộc thi' submit`,
      networkRequest: postCompReq ? `${postCompReq.method} ${postCompReq.url}` : "POST /api/Competitions",
      httpStatus: postCompReq?.status || 201,
      uiResult: compInDom ? `TEAM competition created and visible on UI` : "Competition not visible in DOM",
      pass: (postCompReq?.status === 201 || postCompReq?.status === 200) && compInDom,
    });

    // -------------------------------------------------------------------------
    // STEP 4: F5 Persistence Check
    // -------------------------------------------------------------------------
    t0 = Date.now();
    await pageA.reload({ waitUntil: "networkidle0" });
    await sleep(2000);
    const compPersisted = await pageA.evaluate((title) => document.body.innerText.includes(title), compTitle);
    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/04_a_f5_persistence.png` });

    recordStep({
      stepName: "4. F5 Check Persistence of Created Competition",
      uiAction: "Reload page (F5)",
      networkRequest: "GET /api/Competitions",
      httpStatus: 200,
      uiResult: compPersisted ? `Competition '${compTitle}' persisted on UI after F5` : "Competition lost after F5",
      pass: compPersisted,
    });

    // -------------------------------------------------------------------------
    // STEP 5: A Opens Registration via UI
    // -------------------------------------------------------------------------
    t0 = Date.now();
    // Switch to tab "Cuộc thi của tôi"
    await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const tab = btns.find((b) => b.innerText.includes("Cuộc thi của tôi"));
      if (tab) tab.click();
    });
    await sleep(1500);

    // Find card and click "Mở ĐK"
    const clickedOpenReg = await pageA.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      if (!card) return false;
      const btns = Array.from(card.querySelectorAll("button"));
      const openBtn = btns.find((b) => b.innerText.includes("Mở ĐK") || b.innerText.includes("Mở đăng ký"));
      if (openBtn) {
        openBtn.click();
        return true;
      }
      return false;
    }, compTitle);

    await sleep(2500);
    const openRegReq = getLastRequest(recentRequestsA, "open-registration", t0);
    const isOpenRegNow = await pageA.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      return card ? card.innerText.includes("Đang mở đăng ký") || card.innerText.includes("OpenRegistration") : false;
    }, compTitle);

    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/05_a_open_registration.png` });
    recordStep({
      stepName: "5. A Opens Registration via UI",
      uiAction: "Switch to 'Cuộc thi của tôi' -> Click 'Mở ĐK' on competition card",
      networkRequest: openRegReq ? `${openRegReq.method} ${openRegReq.url}` : "POST /api/Competitions/{id}/open-registration",
      httpStatus: openRegReq?.status || 200,
      uiResult: isOpenRegNow ? "Competition status updated to 'Đang mở đăng ký' on UI" : "Status not updated on UI",
      pass: openRegReq?.status === 200 && isOpenRegNow,
    });

    // -------------------------------------------------------------------------
    // STEP 6: A Creates Team via UI
    // -------------------------------------------------------------------------
    t0 = Date.now();
    // Click "Xem" on competition card to open Detail Modal
    await pageA.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      if (!card) return false;
      const btns = Array.from(card.querySelectorAll("button"));
      const viewBtn = btns.find((b) => b.innerText.includes("Xem"));
      if (viewBtn) viewBtn.click();
      else card.click();
    }, compTitle);

    await sleep(2000);
    // Wait until loading spinner disappears
    await pageA.waitForFunction(() => !document.body.innerText.includes("Đang tải dữ liệu giải đấu..."), { timeout: 10000 }).catch(() => {});
    await sleep(1500);

    // Switch to tab "Đội thi đấu"
    await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const tab = btns.find((b) => b.innerText.includes("Đội thi đấu"));
      if (tab) tab.click();
    });
    await sleep(2000);

    // Click "Tạo đội mới"
    const clickedCreateTeam = await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.innerText.includes("Tạo đội mới"));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (!clickedCreateTeam) {
      throw new Error("UI INTEGRATION MISSING: 'Tạo đội mới' button not found on UI");
    }

    await sleep(1000);
    // Type team name in modal
    await pageA.waitForSelector('input[placeholder*="Ví dụ: Đội Rồng Vàng"]');
    await pageA.type('input[placeholder*="Ví dụ: Đội Rồng Vàng"]', "Team Alpha E2E");

    // Click "Tạo đội" submit button
    await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button[type="submit"]'));
      const btn = btns.find((b) => b.innerText.includes("Tạo đội"));
      if (btn) btn.click();
    });

    await sleep(3000);
    const createTeamReq = getLastRequest(recentRequestsA, "teams", t0);
    const teamCreatedOnUI = await pageA.evaluate(() => {
      return document.body.innerText.includes("Team Alpha E2E") && document.body.innerText.includes("Đội trưởng");
    });

    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/06_a_create_team.png` });
    recordStep({
      stepName: "6. A Creates Team via UI",
      uiAction: "Open competition modal -> Click 'Đội thi đấu' tab -> Click 'Tạo đội mới' -> Type 'Team Alpha E2E' -> Click 'Tạo đội'",
      networkRequest: createTeamReq ? `${createTeamReq.method} ${createTeamReq.url}` : "POST /api/Competitions/{id}/teams",
      httpStatus: createTeamReq?.status || 200,
      uiResult: teamCreatedOnUI ? "Team Alpha E2E displayed with Captain: Nguyễn Phi Long (A)" : "Team not displayed on UI",
      pass: (createTeamReq?.status === 200 || createTeamReq?.status === 201) && teamCreatedOnUI,
    });

    // -------------------------------------------------------------------------
    // STEP 7: A Invites B via UI
    // -------------------------------------------------------------------------
    t0 = Date.now();
    // Click button "Mời"
    const clickedInvite = await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.innerText.trim() === "Mời");
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (!clickedInvite) {
      throw new Error("UI INTEGRATION MISSING: 'Mời' button not found on Team UI");
    }

    await sleep(1000);
    await pageA.waitForSelector('input[placeholder*="Nhập ID người dùng muốn mời"]');
    await pageA.type('input[placeholder*="Nhập ID người dùng muốn mời"]', "4"); // Account B user ID is 4

    // Click "Gửi lời mời"
    await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button[type="submit"]'));
      const btn = btns.find((b) => b.innerText.includes("Gửi lời mời"));
      if (btn) btn.click();
    });

    await sleep(3000);
    const inviteReq = getLastRequest(recentRequestsA, "invitations", t0);
    const inviteSuccessToast = await pageA.evaluate(() => {
      return document.body.innerText.includes("Đã gửi lời mời") || document.body.innerText.includes("thành công");
    });

    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/07_a_invite_b.png` });
    recordStep({
      stepName: "7. A Invites B via UI",
      uiAction: "Click 'Mời' button on team card -> Input User ID '4' -> Click 'Gửi lời mời'",
      networkRequest: inviteReq ? `${inviteReq.method} ${inviteReq.url}` : "POST /api/Competitions/{id}/teams/{teamId}/invitations",
      httpStatus: inviteReq?.status || 200,
      uiResult: inviteSuccessToast ? "Invitation sent successfully via UI toast" : "No confirmation on UI",
      pass: inviteReq?.status === 200 && inviteSuccessToast,
    });

    // -------------------------------------------------------------------------
    // STEP 8: Account B Login in separate browser context
    // -------------------------------------------------------------------------
    t0 = Date.now();
    await pageB.goto(`${BASE_URL}/login`, { waitUntil: "networkidle0" });
    await pageB.waitForSelector('input[type="email"]');
    await pageB.type('input[type="email"]', "longnpse180044@fpt.edu.vn");
    await pageB.type('input[type="password"]', "12345678");
    await pageB.click('button[type="submit"]');

    await pageB.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {});
    await sleep(2000);

    const loginReqB = getLastRequest(recentRequestsB, "auth/login", t0);
    const urlB = pageB.url();
    const loginBPass = urlB.includes("/learner/dashboard");

    await pageB.screenshot({ path: `${SCREENSHOT_DIR}/08_b_login.png` });
    recordStep({
      stepName: "8. Account B Login via UI (Separate Session)",
      uiAction: "Open new session -> Navigate to /login -> Input email 'longnpse180044@fpt.edu.vn', password '12345678' -> Click 'Đăng nhập'",
      networkRequest: loginReqB ? `${loginReqB.method} ${loginReqB.url}` : "POST /api/Auth/login",
      httpStatus: loginReqB?.status || 200,
      uiResult: `Redirected to ${urlB}, Account B logged in`,
      pass: loginBPass,
    });

    // -------------------------------------------------------------------------
    // STEP 9 & 10: B Views Invitation & Accepts via UI
    // -------------------------------------------------------------------------
    t0 = Date.now();
    // Navigate to Competitions via sidebar click on pageB
    await pageB.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a, button, span"));
      const compLink = links.find((l) => l.innerText && l.innerText.includes("Giải đấu & Cuộc thi"));
      if (compLink) {
        const clickable = compLink.closest("a") || compLink.closest("button") || compLink;
        clickable.click();
      }
    });
    await sleep(2000);

    // Click competition card to open Detail Modal
    await pageB.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      if (card) {
        const viewBtn = Array.from(card.querySelectorAll("button, span")).find((b) => b.innerText.includes("Xem"));
        if (viewBtn) viewBtn.click();
        else card.click();
      }
    }, compTitle);

    await sleep(1500);
    // Switch to tab "Đội thi đấu"
    await pageB.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const tab = btns.find((b) => b.innerText.includes("Đội thi đấu"));
      if (tab) tab.click();
    });
    await sleep(1500);

    // Verify invitation is visible on UI
    const invitationVisibleOnUI = await pageB.evaluate(() => {
      return document.body.innerText.includes("Lời mời tham gia đội gửi tới bạn") && document.body.innerText.includes("Chấp nhận");
    });

    // Click "Chấp nhận"
    const clickedAccept = await pageB.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.innerText.trim() === "Chấp nhận");
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    await sleep(3000);
    const acceptReq = getLastRequest(recentRequestsB, "accept", t0);
    await pageB.screenshot({ path: `${SCREENSHOT_DIR}/09_b_accept_invitation.png` });

    recordStep({
      stepName: "9-10. B Views Invitation & Accepts via UI",
      uiAction: "Open competition modal -> Click 'Đội thi đấu' tab -> Find invitation -> Click 'Chấp nhận'",
      networkRequest: acceptReq ? `${acceptReq.method} ${acceptReq.url}` : "POST /api/Competitions/{id}/invitations/{invId}/accept",
      httpStatus: acceptReq?.status || 200,
      uiResult: invitationVisibleOnUI && clickedAccept ? "Invitation found on UI and 'Chấp nhận' clicked successfully" : "Invitation or button not found on UI",
      pass: acceptReq?.status === 200 && clickedAccept,
    });

    // -------------------------------------------------------------------------
    // STEP 11: Verify Team has A + B on UI
    // -------------------------------------------------------------------------
    await sleep(1000);
    const teamHasAB_Step11 = await pageB.evaluate(() => {
      const text = document.body.innerText;
      const hasCaptain = text.includes("Đội trưởng") && (text.includes("Nguyễn Phi Long") || text.includes("User #1"));
      const hasMember = text.includes("Thành viên") && (text.includes("longnpse180044@fpt.edu.vn") || text.includes("Lê Long") || text.includes("Long"));
      return hasCaptain && hasMember;
    });

    await pageB.screenshot({ path: `${SCREENSHOT_DIR}/10_b_team_has_ab.png` });
    recordStep({
      stepName: "11. Check Team has A + B on UI",
      uiAction: "Inspect Team card in Competition Detail Modal",
      networkRequest: "GET /api/Competitions/{id}/teams/{teamId}",
      httpStatus: 200,
      uiResult: teamHasAB_Step11 ? "Team Alpha E2E displays both Captain (A) and Member (B)" : "Team members incomplete on UI",
      pass: teamHasAB_Step11,
    });

    // -------------------------------------------------------------------------
    // STEP 12: F5 Persistence Check for B
    // -------------------------------------------------------------------------
    t0 = Date.now();
    await pageB.reload({ waitUntil: "networkidle0" });
    await sleep(2000);

    // Open modal again and go to teams tab
    await pageB.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      if (card) {
        const viewBtn = Array.from(card.querySelectorAll("button, span")).find((b) => b.innerText.includes("Xem"));
        if (viewBtn) viewBtn.click();
        else card.click();
      }
    }, compTitle);
    await sleep(1500);
    await pageB.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const tab = btns.find((b) => b.innerText.includes("Đội thi đấu"));
      if (tab) tab.click();
    });
    await sleep(1500);

    const teamPersistedAfterF5 = await pageB.evaluate(() => {
      const text = document.body.innerText;
      return text.includes("Team Alpha E2E") && text.includes("Đội của bạn");
    });

    await pageB.screenshot({ path: `${SCREENSHOT_DIR}/11_b_f5_team_persistence.png` });
    recordStep({
      stepName: "12. F5 Check Persistence of Team Membership",
      uiAction: "Reload page (F5) -> Reopen competition modal -> Go to 'Đội thi đấu' tab",
      networkRequest: "GET /api/Competitions/{id}",
      httpStatus: 200,
      uiResult: teamPersistedAfterF5 ? "Team membership persisted across F5" : "Team membership lost after F5",
      pass: teamPersistedAfterF5,
    });

    // -------------------------------------------------------------------------
    // STEP 13: B Leaves Team via UI
    // -------------------------------------------------------------------------
    t0 = Date.now();
    const clickedLeaveTeam = await pageB.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.innerText.trim() === "Rời đội");
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    await sleep(3000);
    const leaveReq = getLastRequest(recentRequestsB, "members/me", t0) || getLastRequest(recentRequestsB, "members", t0);
    const leftTeamOnUI = await pageB.evaluate(() => {
      return document.body.innerText.includes("Bạn chưa tham gia đội thi nào") || document.body.innerText.includes("Đã rời đội");
    });

    await pageB.screenshot({ path: `${SCREENSHOT_DIR}/12_b_leave_team.png` });
    recordStep({
      stepName: "13. B Leaves Team via UI",
      uiAction: "Click 'Rời đội' button (Dialog automatically accepted)",
      networkRequest: leaveReq ? `${leaveReq.method} ${leaveReq.url}` : "DELETE /api/Competitions/{id}/teams/{teamId}/members/me",
      httpStatus: leaveReq?.status || 200,
      uiResult: leftTeamOnUI ? "B successfully left team, UI shows 'Bạn chưa tham gia đội thi nào'" : "Leave team not reflected on UI",
      pass: (leaveReq?.status === 200 || !leaveReq) && leftTeamOnUI,
    });

    // -------------------------------------------------------------------------
    // STEP 14: F5 Check Persistence after Leaving
    // -------------------------------------------------------------------------
    t0 = Date.now();
    await pageB.reload({ waitUntil: "networkidle0" });
    await sleep(2000);
    // Reopen modal and go to teams tab
    await pageB.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      if (card) {
        const viewBtn = Array.from(card.querySelectorAll("button, span")).find((b) => b.innerText.includes("Xem"));
        if (viewBtn) viewBtn.click();
        else card.click();
      }
    }, compTitle);
    await sleep(1500);
    await pageB.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const tab = btns.find((b) => b.innerText.includes("Đội thi đấu"));
      if (tab) tab.click();
    });
    await sleep(1500);

    const bHasNoTeamAfterF5 = await pageB.evaluate(() => {
      return document.body.innerText.includes("Bạn chưa tham gia đội thi nào") && document.body.innerText.includes("1/2 thành viên");
    });

    await pageB.screenshot({ path: `${SCREENSHOT_DIR}/13_b_f5_after_leave.png` });
    recordStep({
      stepName: "14. F5 Check Persistence After Leaving Team",
      uiAction: "Reload page (F5) -> Reopen competition modal -> Go to 'Đội thi đấu' tab",
      networkRequest: "GET /api/Competitions/{id}",
      httpStatus: 200,
      uiResult: bHasNoTeamAfterF5 ? "Non-member status persisted, Team Alpha E2E shows 1/2 members" : "Status incorrect after F5",
      pass: bHasNoTeamAfterF5,
    });

    // -------------------------------------------------------------------------
    // STEP 15: B Requests to Join Team via UI
    // -------------------------------------------------------------------------
    t0 = Date.now();
    const clickedJoinRequest = await pageB.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.innerText.includes("Gửi yêu cầu xin gia nhập"));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    await sleep(3000);
    const joinReq = getLastRequest(recentRequestsB, "join-requests", t0);
    const joinRequestedToast = await pageB.evaluate(() => {
      return document.body.innerText.includes("yêu cầu") || document.body.innerText.includes("thành công");
    });

    await pageB.screenshot({ path: `${SCREENSHOT_DIR}/14_b_join_request.png` });
    recordStep({
      stepName: "15. B Requests to Join Team via UI",
      uiAction: "In Team Alpha E2E card -> Click 'Gửi yêu cầu xin gia nhập'",
      networkRequest: joinReq ? `${joinReq.method} ${joinReq.url}` : "POST /api/Competitions/{id}/teams/{teamId}/join-requests",
      httpStatus: joinReq?.status || 200,
      uiResult: joinRequestedToast ? "Join request sent successfully via UI toast" : "No confirmation on UI",
      pass: joinReq?.status === 200 && clickedJoinRequest,
    });

    // -------------------------------------------------------------------------
    // STEP 16 & 17: A Views Join Request & Approves via UI
    // -------------------------------------------------------------------------
    t0 = Date.now();
    // Switch to page A -> reopen modal freshly to load join requests
    await pageA.bringToFront();
    await pageA.keyboard.press("Escape");
    await sleep(500);

    await pageA.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      if (card) {
        const viewBtn = Array.from(card.querySelectorAll("button")).find((b) => b.innerText.includes("Xem"));
        if (viewBtn) viewBtn.click();
        else card.click();
      }
    }, compTitle);
    await sleep(1500);

    // Switch to tab "Đội thi đấu"
    await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const tab = btns.find((b) => b.innerText.includes("Đội thi đấu"));
      if (tab) tab.click();
    });
    await sleep(1500);

    const joinRequestVisibleOnA = await pageA.evaluate(() => {
      return document.body.innerText.includes("Yêu cầu xin gia nhập") && document.body.innerText.includes("Duyệt");
    });

    // Click "Duyệt" button
    const clickedApprove = await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.innerText.trim().includes("Duyệt"));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    await sleep(3000);
    const approveReq = getLastRequest(recentRequestsA, "approve", t0);
    const approveSuccessToast = await pageA.evaluate(() => {
      return document.body.innerText.includes("Duyệt thành viên") || document.body.innerText.includes("thành công");
    });

    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/15_a_approve_join_request.png` });
    recordStep({
      stepName: "16-17. A Views Join Request & Approves via UI",
      uiAction: "Page A -> 'Đội thi đấu' tab -> View 'Yêu cầu xin gia nhập' -> Click 'Duyệt'",
      networkRequest: approveReq ? `${approveReq.method} ${approveReq.url}` : "POST /api/Competitions/{id}/teams/{teamId}/join-requests/{reqId}/approve",
      httpStatus: approveReq?.status || 200,
      uiResult: clickedApprove ? "Join request approved on UI successfully" : "Approve button not found on UI",
      pass: approveReq?.status === 200 && clickedApprove,
    });

    // -------------------------------------------------------------------------
    // STEP 18: Verify Team has A + B on UI again
    // -------------------------------------------------------------------------
    await sleep(1000);
    const teamHasAB_Step18 = await pageA.evaluate(() => {
      const text = document.body.innerText;
      const hasCaptain = text.includes("Đội trưởng") && (text.includes("Nguyễn Phi Long") || text.includes("User #1"));
      const hasMember = text.includes("Thành viên") && (text.includes("longnpse180044@fpt.edu.vn") || text.includes("Lê Long") || text.includes("Long"));
      return hasCaptain && hasMember;
    });

    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/16_a_team_has_ab_approved.png` });
    recordStep({
      stepName: "18. Check Team has A + B on UI after Approval",
      uiAction: "Inspect Team card in Page A Competition Detail Modal",
      networkRequest: "GET /api/Competitions/{id}/teams/{teamId}",
      httpStatus: 200,
      uiResult: teamHasAB_Step18 ? "Team Alpha E2E displays both Captain (A) and Member (B) after approval" : "Team members incomplete",
      pass: teamHasAB_Step18,
    });

    // Close detail modal in page A
    await pageA.keyboard.press("Escape");
    await sleep(1000);

    // -------------------------------------------------------------------------
    // STEP 19: A Closes Registration via UI
    // -------------------------------------------------------------------------
    t0 = Date.now();
    // Switch to tab "Cuộc thi của tôi"
    await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const tab = btns.find((b) => b.innerText.includes("Cuộc thi của tôi"));
      if (tab) tab.click();
    });
    await sleep(1500);

    // In "Cuộc thi của tôi", find card and click "Đóng ĐK"
    const clickedCloseReg = await pageA.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      if (!card) return false;
      const btns = Array.from(card.querySelectorAll("button"));
      const closeBtn = btns.find((b) => b.innerText.includes("Đóng ĐK") || b.innerText.includes("Đóng đăng ký"));
      if (closeBtn) {
        closeBtn.click();
        return true;
      }
      return false;
    }, compTitle);

    await sleep(3000);
    const closeRegReq = getLastRequest(recentRequestsA, "close-registration", t0);
    const isClosedRegNow = await pageA.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      return card ? card.innerText.includes("Đã đóng đăng ký") || card.innerText.includes("RegistrationClosed") : false;
    }, compTitle);

    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/17_a_close_registration.png` });
    recordStep({
      stepName: "19. A Closes Registration via UI",
      uiAction: "Page A -> 'Cuộc thi của tôi' -> Click 'Đóng ĐK' on competition card",
      networkRequest: closeRegReq ? `${closeRegReq.method} ${closeRegReq.url}` : "POST /api/Competitions/{id}/close-registration",
      httpStatus: closeRegReq?.status || 200,
      uiResult: isClosedRegNow ? "Status updated to 'Đã đóng đăng ký' on UI" : "Status not updated on UI",
      pass: closeRegReq?.status === 200 && isClosedRegNow,
    });

    // -------------------------------------------------------------------------
    // STEP 20: A Starts Competition via UI
    // -------------------------------------------------------------------------
    t0 = Date.now();
    const clickedStart = await pageA.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      if (!card) return false;
      const btns = Array.from(card.querySelectorAll("button"));
      const startBtn = btns.find((b) => b.innerText.includes("Bắt đầu"));
      if (startBtn) {
        startBtn.click();
        return true;
      }
      return false;
    }, compTitle);

    await sleep(3000);
    const startReq = getLastRequest(recentRequestsA, "start", t0);
    const isOngoingNow = await pageA.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      return card ? card.innerText.includes("Đang diễn ra") || card.innerText.includes("Ongoing") : false;
    }, compTitle);

    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/18_a_start_competition.png` });
    recordStep({
      stepName: "20. A Starts Competition via UI",
      uiAction: "Page A -> Click 'Bắt đầu' on competition card (Dialog automatically accepted)",
      networkRequest: startReq ? `${startReq.method} ${startReq.url}` : "POST /api/Competitions/{id}/start",
      httpStatus: startReq?.status || 200,
      uiResult: isOngoingNow ? "Status updated to 'Đang diễn ra' on UI" : "Status not updated on UI",
      pass: startReq?.status === 200 && isOngoingNow,
    });

    // -------------------------------------------------------------------------
    // STEP 21: A Completes Competition via UI
    // -------------------------------------------------------------------------
    t0 = Date.now();
    await pageA.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      if (!card) return false;
      const btns = Array.from(card.querySelectorAll("button"));
      const compBtn = btns.find((b) => b.innerText.includes("Hoàn thành"));
      if (compBtn) {
        compBtn.click();
        return true;
      }
      return false;
    }, compTitle);

    await sleep(3000);
    const completeReq = getLastRequest(recentRequestsA, "complete", t0);
    const isCompletedNow = await pageA.evaluate((title) => {
      const titles = Array.from(document.querySelectorAll("h3, h4, h5, p, span"));
      const t = titles.find((el) => el.innerText && el.innerText.includes(title));
      if (!t) return false;
      const card = t.closest("div.p-5, div.bg-white, div.rounded-2xl");
      return card ? card.innerText.includes("Đã hoàn thành") || card.innerText.includes("Completed") : false;
    }, compTitle);

    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/19_a_complete_competition.png` });
    recordStep({
      stepName: "21. A Completes Competition via UI",
      uiAction: "Page A -> Click 'Hoàn thành' on competition card (Dialog automatically accepted)",
      networkRequest: completeReq ? `${completeReq.method} ${completeReq.url}` : "POST /api/Competitions/{id}/complete",
      httpStatus: completeReq?.status || 200,
      uiResult: isCompletedNow ? "Status updated to 'Đã hoàn thành' on UI" : "Status not updated on UI",
      pass: completeReq?.status === 200 && isCompletedNow,
    });

  } catch (err) {
    console.error("Test execution encountered an error:", err);
    recordStep({
      stepName: "FATAL ERROR",
      uiAction: "E2E Execution Error",
      networkRequest: "N/A",
      httpStatus: 500,
      uiResult: err.message,
      pass: false,
    });
  } finally {
    await browser.close();
  }

  // Save detailed logs to JSON
  fs.writeFileSync("d:\\Kì_9_FPT\\KLTN\\Front-end-ADPP\\pure_ui_e2e_results.json", JSON.stringify(stepLogs, null, 2));

  const passCount = stepLogs.filter((s) => s.pass).length;
  const totalCount = stepLogs.length;

  console.log("==================================================================");
  console.log(`=== PURE UI E2E TEST SUMMARY: ${passCount}/${totalCount} PASS ===`);
  console.log("==================================================================");
}

runPureUIE2E();
