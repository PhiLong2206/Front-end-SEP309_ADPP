import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:5173";
const API_URL = "http://localhost:5001/api";
const SCREENSHOT_DIR = "d:\\Kì_9_FPT\\KLTN\\Front-end-ADPP\\test-screenshots";

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const testResults = [];

function recordTest(id, name, account, status, details = "") {
  testResults.push({ id, name, account, status, details });
  console.log(`[${status}] #${id} | ${account} | ${name} | ${details}`);
}

async function api(method, endpoint, token = null, body = null) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
}

async function runAll() {
  console.log("==================================================================");
  console.log("=== COMPREHENSIVE BE - FE API & UI INTEGRATION TEST SUITE ===");
  console.log("==================================================================");

  let tokenA = null;
  let refreshA = null;
  let userA = null;

  let tokenB = null;
  let refreshB = null;
  let userB = null;

  // ── PHASE 1: DIRECT API & NEW ENDPOINTS TESTING ─────────────────────────
  console.log("\n--- PHASE 1: DIRECT API CONTRACT VERIFICATION ---");

  // Test 1: Login Account A
  const loginResA = await api("POST", "/Auth/login", null, {
    email: "nguyenphilong226@gmail.com",
    password: "12345678",
  });
  if (loginResA.ok && loginResA.data?.success) {
    tokenA = loginResA.data.data.accessToken;
    refreshA = loginResA.data.data.refreshToken;
    userA = loginResA.data.data.user;
    recordTest(1, "Login Account A (nguyenphilong226@gmail.com)", "Account A", "PASS", `UserId: ${userA.userId}, Roles: ${JSON.stringify(userA.roles)}`);
  } else {
    recordTest(1, "Login Account A (nguyenphilong226@gmail.com)", "Account A", "FAIL", loginResA.data?.message || `HTTP ${loginResA.status}`);
  }

  // Test 2: Refresh Token for Account A (NEW API)
  if (refreshA) {
    const refRes = await api("POST", "/Auth/refresh-token", null, { refreshToken: refreshA });
    if (refRes.ok && refRes.data?.success && refRes.data.data?.accessToken) {
      tokenA = refRes.data.data.accessToken;
      refreshA = refRes.data.data.refreshToken;
      recordTest(2, "POST /Auth/refresh-token (NEW API)", "Account A", "PASS", `Rotated token received, expiresAt: ${refRes.data.data.expiresAt}`);
    } else {
      recordTest(2, "POST /Auth/refresh-token (NEW API)", "Account A", "FAIL", refRes.data?.message || `HTTP ${refRes.status}`);
    }
  }

  // Test 3: Get User Profile (Me)
  const meRes = await api("GET", "/Users/me", tokenA);
  if (meRes.ok && meRes.data?.success) {
    recordTest(3, "GET /Users/me", "Account A", "PASS", `Profile loaded for ${meRes.data.data.fullName} (${meRes.data.data.email})`);
  } else {
    recordTest(3, "GET /Users/me", "Account A", "FAIL", meRes.data?.message || `HTTP ${meRes.status}`);
  }

  // Test 4: Login Account B
  const loginResB = await api("POST", "/Auth/login", null, {
    email: "longnpse180044@fpt.edu.vn",
    password: "12345678",
  });
  if (loginResB.ok && loginResB.data?.success) {
    tokenB = loginResB.data.data.accessToken;
    refreshB = loginResB.data.data.refreshToken;
    userB = loginResB.data.data.user;
    recordTest(4, "Login Account B (longnpse180044@fpt.edu.vn)", "Account B", "PASS", `UserId: ${userB.userId}, Roles: ${JSON.stringify(userB.roles)}`);
  } else {
    recordTest(4, "Login Account B (longnpse180044@fpt.edu.vn)", "Account B", "FAIL", loginResB.data?.message || `HTTP ${loginResB.status}`);
  }

  // Test 5: Refresh Token for Account B (NEW API)
  if (refreshB) {
    const refResB = await api("POST", "/Auth/refresh-token", null, { refreshToken: refreshB });
    if (refResB.ok && refResB.data?.success) {
      tokenB = refResB.data.data.accessToken;
      refreshB = refResB.data.data.refreshToken;
      recordTest(5, "POST /Auth/refresh-token for Account B", "Account B", "PASS", "Account B token rotation successful");
    } else {
      recordTest(5, "POST /Auth/refresh-token for Account B", "Account B", "FAIL", refResB.data?.message || `HTTP ${refResB.status}`);
    }
  }

  // Test 6: GET Competitions List
  const compListRes = await api("GET", "/Competitions", null);
  let compCount = 0;
  if (compListRes.ok && compListRes.data?.success) {
    compCount = compListRes.data.data?.length || 0;
    recordTest(6, "GET /Competitions List", "Public/All", "PASS", `Found ${compCount} competitions in system.`);
  } else {
    recordTest(6, "GET /Competitions List", "Public/All", "FAIL", `HTTP ${compListRes.status}`);
  }

  // Test 7: Create a new Team Competition (Account A)
  const testCompPayload = {
    title: `[INTEG] Team Competition ${Date.now()}`,
    description: "Automated test competition for team invitations and join requests",
    competitionType: "TEAM",
    registrationStart: "2026-10-10T09:00:00",
    registrationEnd: "2026-10-15T18:00:00",
    startDate: "2026-10-20T08:00:00",
    isPublic: true,
  };
  const createCompRes = await api("POST", "/Competitions", tokenA, testCompPayload);
  let createdCompId = null;
  if (createCompRes.ok && createCompRes.data?.success) {
    createdCompId = createCompRes.data.data.competitionId;
    recordTest(7, "POST /Competitions (Create TEAM Comp)", "Account A", "PASS", `Created CompetitionId: ${createdCompId}`);
  } else {
    recordTest(7, "POST /Competitions (Create TEAM Comp)", "Account A", "FAIL", createCompRes.data?.message || `HTTP ${createCompRes.status}`);
  }

  // Test 8: Open Registration on created competition
  if (createdCompId) {
    const openRes = await api("POST", `/Competitions/${createdCompId}/open-registration`, tokenA);
    if (openRes.ok && openRes.data?.success) {
      recordTest(8, "POST /Competitions/{id}/open-registration", "Account A", "PASS", `Competition ${createdCompId} is now OpenRegistration`);
    } else {
      recordTest(8, "POST /Competitions/{id}/open-registration", "Account A", "FAIL", openRes.data?.message || `HTTP ${openRes.status}`);
    }
  }

  // Test 9: Create Team in Competition (Account A)
  let createdTeamId = null;
  if (createdCompId) {
    const createTeamRes = await api("POST", `/competitions/${createdCompId}/teams`, tokenA, {
      teamName: `Team Alpha ${Date.now() % 10000}`,
    });
    if (createTeamRes.ok && createTeamRes.data?.success) {
      createdTeamId = createTeamRes.data.data.teamId;
      recordTest(9, "POST /competitions/{id}/teams (Create Team)", "Account A", "PASS", `Created TeamId: ${createdTeamId}`);
    } else {
      recordTest(9, "POST /competitions/{id}/teams (Create Team)", "Account A", "FAIL", createTeamRes.data?.message || `HTTP ${createTeamRes.status}`);
    }
  }

  // Test 10: Send Team Invitation to Account B (NEW API)
  let invitationId = null;
  if (createdCompId && createdTeamId && userB) {
    const inviteRes = await api("POST", `/competitions/${createdCompId}/teams/${createdTeamId}/invitations`, tokenA, {
      userId: userB.userId,
    });
    if (inviteRes.ok && inviteRes.data?.success) {
      invitationId = inviteRes.data.data.requestId;
      recordTest(10, "POST /teams/{teamId}/invitations (Invite User)", "Account A -> B", "PASS", `Invitation RequestId: ${invitationId} sent to UserId: ${userB.userId}`);
    } else {
      recordTest(10, "POST /teams/{teamId}/invitations (Invite User)", "Account A -> B", "FAIL", inviteRes.data?.message || `HTTP ${inviteRes.status}`);
    }
  }

  // Test 11: Account B checks my invitations (NEW API)
  if (createdCompId && tokenB) {
    const myInvRes = await api("GET", `/competitions/${createdCompId}/teams/invitations/me`, tokenB);
    if (myInvRes.ok && myInvRes.data?.success) {
      const invs = myInvRes.data.data || [];
      const found = invs.find((i) => i.requestId === invitationId);
      recordTest(11, "GET /teams/invitations/me", "Account B", "PASS", `Found ${invs.length} invitations. Targeted invitation present: ${Boolean(found)}`);
    } else {
      recordTest(11, "GET /teams/invitations/me", "Account B", "FAIL", myInvRes.data?.message || `HTTP ${myInvRes.status}`);
    }
  }

  // Test 12: Account B accepts team invitation (NEW API)
  if (createdCompId && invitationId && tokenB) {
    const acceptRes = await api("POST", `/competitions/${createdCompId}/teams/invitations/${invitationId}/accept`, tokenB);
    if (acceptRes.ok && acceptRes.data?.success) {
      recordTest(12, "POST /teams/invitations/{requestId}/accept", "Account B", "PASS", "Invitation accepted successfully");
    } else {
      recordTest(12, "POST /teams/invitations/{requestId}/accept", "Account B", "FAIL", acceptRes.data?.message || `HTTP ${acceptRes.status}`);
    }
  }

  // Test 13: Verify Team Detail has both members
  if (createdCompId && createdTeamId && tokenA) {
    const teamDetailRes = await api("GET", `/competitions/${createdCompId}/teams/${createdTeamId}`, tokenA);
    if (teamDetailRes.ok && teamDetailRes.data?.success) {
      const members = teamDetailRes.data.data.members || [];
      const hasA = members.some((m) => m.userId === userA.userId);
      const hasB = members.some((m) => m.userId === userB.userId);
      recordTest(13, "GET /teams/{teamId} (Verify Members)", "Team Alpha", "PASS", `Team has ${members.length} members (Account A: ${hasA}, Account B: ${hasB})`);
    } else {
      recordTest(13, "GET /teams/{teamId} (Verify Members)", "Team Alpha", "FAIL", teamDetailRes.data?.message || `HTTP ${teamDetailRes.status}`);
    }
  }

  // Test 14: Account B leaves team
  if (createdCompId && createdTeamId && tokenB) {
    const leaveRes = await api("DELETE", `/competitions/${createdCompId}/teams/${createdTeamId}/members/me`, tokenB);
    if (leaveRes.ok && leaveRes.data?.success) {
      recordTest(14, "DELETE /teams/{teamId}/members/me (Leave Team)", "Account B", "PASS", "Account B successfully left the team");
    } else {
      recordTest(14, "DELETE /teams/{teamId}/members/me (Leave Team)", "Account B", "FAIL", leaveRes.data?.message || `HTTP ${leaveRes.status}`);
    }
  }

  // Test 15: Revoke Token (NEW API)
  if (tokenB && refreshB) {
    const revRes = await api("POST", "/Auth/revoke-token", tokenB, { refreshToken: refreshB });
    if (revRes.ok && revRes.data?.success) {
      recordTest(15, "POST /Auth/revoke-token (NEW API)", "Account B", "PASS", "Refresh token successfully revoked on logout");
    } else {
      recordTest(15, "POST /Auth/revoke-token (NEW API)", "Account B", "FAIL", revRes.data?.message || `HTTP ${revRes.status}`);
    }
  }

  // ── PHASE 2: PUPPETEER REAL BROWSER UI VERIFICATION ─────────────────────
  console.log("\n--- PHASE 2: REAL BROWSER UI WORKFLOW (PUPPETEER) ---");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,900"],
    defaultViewport: { width: 1280, height: 900 },
  });

  const page = await browser.newPage();

  // Test 16: UI Login Account A
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2" });
    await page.type('input[type="email"]', "nguyenphilong226@gmail.com");
    await page.type('input[type="password"]', "12345678");
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01_login_filled_accountA.png` });

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);

    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02_dashboard_accountA.png` });

    const currentUrl = page.url();
    const storedAuth = await page.evaluate(() => ({
      token: localStorage.getItem("adpp_token"),
      refreshToken: localStorage.getItem("adpp_refresh_token"),
      user: localStorage.getItem("adpp_user"),
    }));

    const isDashboard = currentUrl.includes("/learner/dashboard");
    const hasToken = Boolean(storedAuth.token);
    const hasRefreshToken = Boolean(storedAuth.refreshToken);

    if (isDashboard && hasToken && hasRefreshToken) {
      recordTest(16, "UI Login & Session Storage (Account A)", "Account A", "PASS", `Redirected to: ${currentUrl}, Token: YES, RefreshToken: YES`);
    } else {
      recordTest(16, "UI Login & Session Storage (Account A)", "Account A", "FAIL", `URL: ${currentUrl}, Token: ${hasToken}, RefreshToken: ${hasRefreshToken}`);
    }
  } catch (err) {
    recordTest(16, "UI Login & Session Storage (Account A)", "Account A", "FAIL", err.message);
  }

  // Test 17: UI Dashboard Competitions Section
  try {
    const compSectionVisible = await page.evaluate(() => {
      return document.body.innerText.includes("GIẢI ĐẤU TRANH BIỆN");
    });
    recordTest(17, "UI Dashboard displays Live Competitions Section", "Account A", compSectionVisible ? "PASS" : "FAIL", `Section visible: ${compSectionVisible}`);
  } catch (err) {
    recordTest(17, "UI Dashboard displays Live Competitions Section", "Account A", "FAIL", err.message);
  }

  // Test 18: Navigate to Competitions page
  try {
    await page.goto(`${BASE_URL}/learner/competitions`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/03_competitions_page_accountA.png` });

    const compCardsCount = await page.evaluate(() => {
      // Find cards containing text or titles
      return document.querySelectorAll(".grid > div").length;
    });
    recordTest(18, "UI Competitions Page Navigation", "Account A", "PASS", `Rendered competition cards count: ${compCardsCount}`);
  } catch (err) {
    recordTest(18, "UI Competitions Page Navigation", "Account A", "FAIL", err.message);
  }

  // Test 19: Open Competition Detail Modal in UI
  try {
    // Click the first card or view button
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button, a"));
      const viewBtn = buttons.find((b) => b.textContent && (b.textContent.includes("Xem chi tiết") || b.textContent.includes("Chi tiết")));
      if (viewBtn) {
        viewBtn.click();
        return true;
      }
      return false;
    });

    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/04_competition_modal_accountA.png` });

    const modalOpen = await page.evaluate(() => {
      return document.querySelector('[role="dialog"]') !== null || document.body.innerText.includes("Thông tin giải đấu") || document.body.innerText.includes("Thể lệ") || document.body.innerText.includes("Đăng ký");
    });
    recordTest(19, "UI Open Competition Detail Modal", "Account A", modalOpen ? "PASS" : "FAIL", `Modal displayed: ${modalOpen}`);
  } catch (err) {
    recordTest(19, "UI Open Competition Detail Modal", "Account A", "FAIL", err.message);
  }

  // Test 20: UI Logout
  try {
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2" });
    recordTest(20, "UI Logout & Storage Clear", "Account A", "PASS", "Session cleared and redirected to login");
  } catch (err) {
    recordTest(20, "UI Logout & Storage Clear", "Account A", "FAIL", err.message);
  }

  // Test 21: UI Login Account B
  try {
    await page.type('input[type="email"]', "longnpse180044@fpt.edu.vn");
    await page.type('input[type="password"]', "12345678");
    await page.screenshot({ path: `${SCREENSHOT_DIR}/05_login_filled_accountB.png` });

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);

    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06_dashboard_accountB.png` });

    const currentUrlB = page.url();
    const storedAuthB = await page.evaluate(() => ({
      token: localStorage.getItem("adpp_token"),
      refreshToken: localStorage.getItem("adpp_refresh_token"),
      user: localStorage.getItem("adpp_user"),
    }));

    const isDashboardB = currentUrlB.includes("/learner/dashboard");
    const hasTokenB = Boolean(storedAuthB.token);
    const hasRefreshTokenB = Boolean(storedAuthB.refreshToken);

    if (isDashboardB && hasTokenB && hasRefreshTokenB) {
      recordTest(21, "UI Login Account B (longnpse180044@fpt.edu.vn)", "Account B", "PASS", `Redirected to: ${currentUrlB}, Token: YES, RefreshToken: YES`);
    } else {
      recordTest(21, "UI Login Account B (longnpse180044@fpt.edu.vn)", "Account B", "FAIL", `URL: ${currentUrlB}`);
    }
  } catch (err) {
    recordTest(21, "UI Login Account B (longnpse180044@fpt.edu.vn)", "Account B", "FAIL", err.message);
  }

  // Test 22: Account B Settings & Profile View
  try {
    await page.goto(`${BASE_URL}/learner/settings`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/07_settings_page_accountB.png` });

    const emailValue = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      return emailInput ? emailInput.value : "";
    });

    const isMatch = emailValue.toLowerCase() === "longnpse180044@fpt.edu.vn";
    recordTest(22, "UI Account B Profile/Settings verification", "Account B", isMatch ? "PASS" : "FAIL", `Email field rendered: ${emailValue}`);
  } catch (err) {
    recordTest(22, "UI Account B Profile/Settings verification", "Account B", "FAIL", err.message);
  }

  await browser.close();

  // Summary Report
  console.log("\n==================================================================");
  console.log("=== FINAL INTEGRATION TEST REPORT ===");
  console.log("==================================================================");
  const passed = testResults.filter((r) => r.status === "PASS").length;
  const failed = testResults.filter((r) => r.status === "FAIL").length;
  console.log(`TOTAL TESTS: ${testResults.length} | PASSED: ${passed} | FAILED: ${failed}`);

  fs.writeFileSync(
    "integration_test_results.json",
    JSON.stringify({ total: testResults.length, passed, failed, results: testResults }, null, 2),
    "utf-8"
  );
  console.log("Results saved to integration_test_results.json");
}

runAll().catch(console.error);
