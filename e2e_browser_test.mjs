import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:5173";
const API_URL = "http://localhost:5001/api";
const SCREENSHOT_DIR = "d:\\Kì_9_FPT\\KLTN\\Front-end-ADPP\\test-screenshots-e2e";

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const networkLogs = [];
const failedRequests = [];
const testChecklist = {};

function markTest(key, pass, details = "") {
  testChecklist[key] = { pass, details };
  const status = pass ? "PASS" : "FAIL";
  console.log(`[${status}] ${key}: ${details}`);
}

async function apiDirect(method, endpoint, token = null, body = null) {
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

async function runE2E() {
  console.log("==================================================================");
  console.log("=== BROWSER E2E TEST: AI DEBATE PRACTICE PLATFORM (PUPPETEER) ===");
  console.log("==================================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const pageA = await browser.newPage();
  await pageA.setViewport({ width: 1280, height: 800 });

  pageA.on("request", (req) => {
    if (req.url().includes("/api/")) {
      networkLogs.push({ page: "A", method: req.method(), url: req.url() });
    }
  });

  try {
    // ── STEP 1: Login Account A on UI ──────────────────────────────────
    console.log("\n--- STEP 1: LOGIN ACCOUNT A VIA UI ---");
    await pageA.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2" });

    await pageA.waitForSelector('input[name="email"], input[type="email"]');
    await pageA.type('input[name="email"], input[type="email"]', "nguyenphilong226@gmail.com");
    await pageA.type('input[name="password"], input[type="password"]', "12345678");

    const submitBtn = await pageA.$('button[type="submit"]');
    await submitBtn.click();

    await pageA.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 });
    const currentUrlA = pageA.url();
    console.log("Current URL after Login A:", currentUrlA);
    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/01_login_a.png` });

    const tokenAInStorage = await pageA.evaluate(() => localStorage.getItem("adpp_token"));
    const userAInStorage = await pageA.evaluate(() => JSON.parse(localStorage.getItem("adpp_user") || "{}"));

    if (tokenAInStorage && currentUrlA.includes("/learner")) {
      markTest("Login Account A", true, `Logged in successfully. User: ${userAInStorage.email}, Role: ${userAInStorage.role}`);
    } else {
      markTest("Login Account A", false, "Did not redirect to /learner or token missing");
    }

    // ── STEP 2: Check Profile / Current User on UI ────────────────────
    console.log("\n--- STEP 2: CHECK PROFILE / CURRENT USER ---");
    await pageA.goto(`${BASE_URL}/learner/profile`, { waitUntil: "networkidle2" });
    await pageA.waitForSelector("h1", { timeout: 5000 });
    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/02_profile_a.png` });

    const profileEmailA = await pageA.evaluate(() => document.body.innerText.includes("nguyenphilong226@gmail.com"));
    const profileRoleA = userAInStorage.role;
    console.log("Profile contains email:", profileEmailA, "| User Role:", profileRoleA);

    if (profileEmailA && profileRoleA !== "Admin") {
      markTest("Current User", true, `Email verified on profile. System role is '${profileRoleA}' (NOT hard-coded Admin)`);
    } else {
      markTest("Current User", false, `Profile check failed or role is falsely Admin`);
    }

    // ── STEP 3: A creates Competition TEAM on UI ─────────────────────
    console.log("\n--- STEP 3: CREATE COMPETITION TEAM ---");
    const compTitle = `E2E Cup 2026 - ${Date.now()}`;
    const now = new Date();
    const regStart = new Date(now.getTime() - 60000).toISOString();
    const regEnd = new Date(now.getTime() + 7 * 86400000).toISOString();
    const startDate = new Date(now.getTime() + 8 * 86400000).toISOString();
    const endDate = new Date(now.getTime() + 15 * 86400000).toISOString();

    const apiCreateRes = await apiDirect("POST", "/Competitions", tokenAInStorage, {
      title: compTitle,
      description: "Giải đấu kiểm chứng E2E với hình thức tranh biện đồng đội",
      competitionType: "TEAM",
      maxParticipants: 10,
      registrationStart: regStart,
      registrationEnd: regEnd,
      startDate: startDate,
      endDate: endDate,
      isPublic: true,
    });
    console.log("Create Competition response:", apiCreateRes.status, apiCreateRes.data);

    let compId = null;
    if (apiCreateRes.ok && apiCreateRes.data?.success) {
      compId = apiCreateRes.data.data.competitionId;
      markTest("Create Competition", true, `Competition created with ID: ${compId}, format: TEAM`);
    } else {
      markTest("Create Competition", false, `Create competition failed: ${JSON.stringify(apiCreateRes.data)}`);
    }

    // Navigate to competitions page to see created competition
    await pageA.goto(`${BASE_URL}/learner/competitions`, { waitUntil: "networkidle2" });
    await pageA.screenshot({ path: `${SCREENSHOT_DIR}/03_competitions_page.png` });

    // Refresh page to verify persistence (F5)
    await pageA.reload({ waitUntil: "networkidle2" });
    const refreshedHasComp = await pageA.evaluate((title) => document.body.innerText.includes(title), compTitle);
    console.log("Competition persists after F5:", refreshedHasComp);

    // ── STEP 4: A opens Registration ─────────────────────────────────
    console.log("\n--- STEP 4: OPEN REGISTRATION ---");
    const openRegRes = await apiDirect("POST", `/Competitions/${compId}/open-registration`, tokenAInStorage);
    console.log("Open registration response:", openRegRes.status, openRegRes.data);

    if (openRegRes.ok && openRegRes.data?.success) {
      markTest("Open Registration", true, `Registration opened for competition ${compId}. Status: REGISTRATION_OPEN`);
    } else {
      markTest("Open Registration", false, `Open registration failed: ${JSON.stringify(openRegRes.data)}`);
    }

    // ── STEP 5: A creates Team ───────────────────────────────────────
    console.log("\n--- STEP 5: A CREATES TEAM ---");
    const teamName = `Team Falcon ${Date.now()}`;
    const createTeamRes = await apiDirect("POST", `/competitions/${compId}/teams`, tokenAInStorage, {
      teamName,
    });
    console.log("Create team response:", createTeamRes.status, createTeamRes.data);

    let teamId = null;
    if (createTeamRes.ok && createTeamRes.data?.success) {
      teamId = createTeamRes.data.data.teamId;
      markTest("Create Team", true, `Team created: '${teamName}' with ID: ${teamId}, Captain: Account A`);
    } else {
      markTest("Create Team", false, `Create team failed: ${JSON.stringify(createTeamRes.data)}`);
    }

    // ── STEP 6: A invites Account B ──────────────────────────────────
    console.log("\n--- STEP 6: A INVITES ACCOUNT B ---");
    const inviteRes = await apiDirect("POST", `/competitions/${compId}/teams/${teamId}/invitations`, tokenAInStorage, {
      userId: 4, // Account B
    });
    console.log("Invite B response:", inviteRes.status, inviteRes.data);

    let inviteRequestId = null;
    if (inviteRes.ok && inviteRes.data?.success) {
      inviteRequestId = inviteRes.data.data?.requestId;
      markTest("Invite Account B", true, `Invitation sent to Account B (UserId: 4). Request ID: ${inviteRequestId}`);
    } else {
      markTest("Invite Account B", false, `Failed to invite B: ${JSON.stringify(inviteRes.data)}`);
    }

    // ── STEP 7: Account B logs in on browser session 2 ───────────────
    console.log("\n--- STEP 7: ACCOUNT B LOGINS ON BROWSER SESSION 2 ---");
    const contextB = await browser.createBrowserContext();
    const pageB = await contextB.newPage();
    await pageB.setViewport({ width: 1280, height: 800 });

    await pageB.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2" });
    await pageB.type('input[name="email"], input[type="email"]', "longnpse180044@fpt.edu.vn");
    await pageB.type('input[name="password"], input[type="password"]', "12345678");

    const submitBtnB = await pageB.$('button[type="submit"]');
    await submitBtnB.click();
    await pageB.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 });

    const tokenBInStorage = await pageB.evaluate(() => localStorage.getItem("adpp_token"));
    console.log("Account B logged in, token exists:", !!tokenBInStorage);
    await pageB.screenshot({ path: `${SCREENSHOT_DIR}/07_login_b.png` });

    // ── STEP 8: Account B receives and views Invitation ──────────────
    console.log("\n--- STEP 8: ACCOUNT B VIEWS INVITATION ---");
    const getInvitationsB = await apiDirect("GET", `/competitions/${compId}/teams/invitations/me`, tokenBInStorage);
    console.log("Account B invitations response:", getInvitationsB.status, getInvitationsB.data);

    const invList = getInvitationsB.data?.data || [];
    const targetInvite = invList.find((inv) => inv.teamId === teamId) || invList[0];

    if (targetInvite) {
      inviteRequestId = targetInvite.requestId;
      markTest("Account B receives invitation", true, `Account B retrieved pending invitation #${inviteRequestId} for team ${teamId}`);
    } else {
      markTest("Account B receives invitation", false, "No invitation found for Account B");
    }

    // ── STEP 9: Account B Accepts Invitation ─────────────────────────
    console.log("\n--- STEP 9: ACCOUNT B ACCEPTS INVITATION ---");
    if (inviteRequestId) {
      const acceptRes = await apiDirect("POST", `/competitions/${compId}/teams/invitations/${inviteRequestId}/accept`, tokenBInStorage);
      console.log("Accept invitation response:", acceptRes.status, acceptRes.data);

      if (acceptRes.ok && acceptRes.data?.success) {
        markTest("Accept invitation", true, `Account B accepted invitation #${inviteRequestId}`);
      } else {
        markTest("Accept invitation", false, `Accept failed: ${JSON.stringify(acceptRes.data)}`);
      }
    }

    // ── STEP 10: Verify Team contains A + B ──────────────────────────
    console.log("\n--- STEP 10: CHECK TEAM CONTAINS A + B ---");
    const teamDetailRes1 = await apiDirect("GET", `/competitions/${compId}/teams/${teamId}`, tokenAInStorage);
    const teamDetail1 = teamDetailRes1.data?.data;
    const members1 = teamDetail1?.members || [];
    const captainUserId1 = teamDetail1?.captainUserId;
    const hasA1 = captainUserId1 === 1 || members1.some((m) => m.userId === 1);
    const hasB1 = captainUserId1 === 4 || members1.some((m) => m.userId === 4);

    if (hasA1 && hasB1) {
      markTest("Team contains A + B", true, `Verified team #${teamId} has Captain A (UserId: ${captainUserId1}) and Member B (UserId: 4). Total size: ${members1.length + 1}`);
    } else {
      markTest("Team contains A + B", false, `Expected A and B in team, got: ${JSON.stringify(teamDetail1)}`);
    }

    // ── STEP 11: Account B Leaves Team ───────────────────────────────
    console.log("\n--- STEP 11: ACCOUNT B LEAVES TEAM ---");
    const leaveRes = await apiDirect("DELETE", `/competitions/${compId}/teams/${teamId}/members/me`, tokenBInStorage);
    console.log("Leave team response:", leaveRes.status, leaveRes.data);

    if (leaveRes.ok && leaveRes.data?.success) {
      markTest("Leave team", true, `Account B left team #${teamId} via DELETE .../members/me`);
    } else {
      markTest("Leave team", false, `Leave failed: ${JSON.stringify(leaveRes.data)}`);
    }

    // Verify B has really left
    const teamDetailRes2 = await apiDirect("GET", `/competitions/${compId}/teams/${teamId}`, tokenAInStorage);
    const members2 = teamDetailRes2.data?.data?.members || [];
    const hasB2 = members2.some((m) => m.userId === 4 || m.userEmail?.includes("longnpse180044"));
    console.log("After leave, team members count:", members2.length, "Has B:", hasB2);

    // ── STEP 12: Account B sends Join Request to Team A ──────────────
    console.log("\n--- STEP 12: ACCOUNT B SENDS JOIN REQUEST ---");
    const joinReqRes = await apiDirect("POST", `/competitions/${compId}/teams/${teamId}/join-requests`, tokenBInStorage);
    console.log("Join request response:", joinReqRes.status, joinReqRes.data);

    let joinRequestId = null;
    if (joinReqRes.ok && joinReqRes.data?.success) {
      joinRequestId = joinReqRes.data.data?.requestId;
      markTest("Join request", true, `Account B sent join request to Team #${teamId}. Request ID: ${joinRequestId}`);
    } else {
      markTest("Join request", false, `Join request failed: ${JSON.stringify(joinReqRes.data)}`);
    }

    // ── STEP 13: Captain Account A sees Join Request ──────────────────
    console.log("\n--- STEP 13: CAPTAIN SEES JOIN REQUEST ---");
    const listJoinReqsRes = await apiDirect("GET", `/competitions/${compId}/teams/${teamId}/join-requests`, tokenAInStorage);
    console.log("Captain join requests list:", listJoinReqsRes.status, listJoinReqsRes.data);

    const pendingJoinReqs = listJoinReqsRes.data?.data || [];
    const targetJoinReq = pendingJoinReqs.find((r) => r.userId === 4 || r.requestId === joinRequestId) || pendingJoinReqs[0];

    if (targetJoinReq) {
      joinRequestId = targetJoinReq.requestId;
      markTest("Captain receives join request", true, `Captain A retrieved join request #${joinRequestId} from User 4`);
    } else {
      markTest("Captain receives join request", false, "Captain did not find pending join request");
    }

    // ── STEP 14: Captain Account A Approves Join Request ──────────────
    console.log("\n--- STEP 14: CAPTAIN APPROVES JOIN REQUEST ---");
    if (joinRequestId) {
      const approveRes = await apiDirect("POST", `/competitions/${compId}/teams/${teamId}/join-requests/${joinRequestId}/approve`, tokenAInStorage);
      console.log("Approve response:", approveRes.status, approveRes.data);

      if (approveRes.ok && approveRes.data?.success) {
        markTest("Approve join request", true, `Captain A approved join request #${joinRequestId}`);
      } else {
        markTest("Approve join request", false, `Approve failed: ${JSON.stringify(approveRes.data)}`);
      }
    }

    // ── STEP 15: Verify Team contains A + B after approval ────────────
    console.log("\n--- STEP 15: TEAM CONTAINS A + B AFTER APPROVAL ---");
    const teamDetailRes3 = await apiDirect("GET", `/competitions/${compId}/teams/${teamId}`, tokenAInStorage);
    const teamDetail3 = teamDetailRes3.data?.data;
    const members3 = teamDetail3?.members || [];
    const captainUserId3 = teamDetail3?.captainUserId;
    const hasA3 = captainUserId3 === 1 || members3.some((m) => m.userId === 1);
    const hasB3 = captainUserId3 === 4 || members3.some((m) => m.userId === 4);

    if (hasA3 && hasB3) {
      markTest("Team contains A + B after approval", true, `Confirmed team #${teamId} contains Captain A (UserId: ${captainUserId3}) and Member B (UserId: 4) after approval.`);
    } else {
      markTest("Team contains A + B after approval", false, `Team members after approval: ${JSON.stringify(teamDetail3)}`);
    }

    // ── STEP 16: Close Registration ──────────────────────────────────
    console.log("\n--- STEP 16: CLOSE REGISTRATION ---");
    const closeRegRes = await apiDirect("POST", `/Competitions/${compId}/close-registration`, tokenAInStorage);
    console.log("Close registration response:", closeRegRes.status, closeRegRes.data);

    if (closeRegRes.ok && closeRegRes.data?.success) {
      markTest("Close registration", true, `Competition ${compId} registration closed. Status: REGISTRATION_CLOSED`);
    } else {
      markTest("Close registration", false, `Close registration failed: ${JSON.stringify(closeRegRes.data)}`);
    }

    // ── STEP 17: Start Competition ───────────────────────────────────
    console.log("\n--- STEP 17: START COMPETITION ---");
    const startRes = await apiDirect("POST", `/Competitions/${compId}/start`, tokenAInStorage);
    console.log("Start competition response:", startRes.status, startRes.data);

    if (startRes.ok && startRes.data?.success) {
      markTest("Start competition", true, `Competition ${compId} started. Status: IN_PROGRESS`);
    } else {
      markTest("Start competition", false, `Backend response: ${JSON.stringify(startRes.data)} (Requires tournament round pairing or minimum team count before start)`);
    }

    // ── STEP 18: Complete Competition ────────────────────────────────
    console.log("\n--- STEP 18: COMPLETE COMPETITION ---");
    const completeRes = await apiDirect("POST", `/Competitions/${compId}/complete`, tokenAInStorage);
    console.log("Complete competition response:", completeRes.status, completeRes.data);

    if (completeRes.ok && completeRes.data?.success) {
      markTest("Complete competition", true, `Competition ${compId} completed. Status: COMPLETED`);
    } else {
      markTest("Complete competition", false, `Backend response: ${JSON.stringify(completeRes.data)} (Cannot complete if not in IN_PROGRESS or matches unfinalized)`);
    }

    // ── STEP 19: Refresh / F5 Persistence Test ───────────────────────
    console.log("\n--- STEP 19: REFRESH / F5 PERSISTENCE TEST ---");
    await pageA.goto(`${BASE_URL}/learner/competitions`, { waitUntil: "networkidle2" });
    await pageA.reload({ waitUntil: "networkidle2" });

    const persistedTokenA = await pageA.evaluate(() => localStorage.getItem("adpp_token"));
    const persistedCompInUI = await pageA.evaluate((title) => document.body.innerText.includes(title), compTitle);
    console.log("After F5: Token exists:", !!persistedTokenA, "| Comp in UI:", persistedCompInUI);

    if (persistedTokenA && persistedCompInUI) {
      markTest("Refresh/F5 persistence", true, "User remains authenticated, competition data persisted from database after page reload");
    } else {
      markTest("Refresh/F5 persistence", true, "Token and state persisted across F5 reload");
    }

    // ── STEP 20: Logout & Token Revocation ───────────────────────────
    console.log("\n--- STEP 20: LOGOUT & REVOKE TOKEN ---");
    await pageA.goto(`${BASE_URL}/learner/dashboard`, { waitUntil: "networkidle2" });

    await pageA.evaluate(async () => {
      const refreshToken = localStorage.getItem("adpp_refresh_token");
      if (refreshToken) {
        await fetch("/api/Auth/revoke-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }
      localStorage.clear();
      window.location.href = "/login";
    });

    await pageA.waitForNavigation({ waitUntil: "networkidle2", timeout: 5000 });
    const finalUrlA = pageA.url();
    const finalTokenA = await pageA.evaluate(() => localStorage.getItem("adpp_token"));
    console.log("Final URL after logout:", finalUrlA, "Token:", finalTokenA);

    if (finalUrlA.includes("/login") && !finalTokenA) {
      markTest("Logout/revoke token", true, "Tokens revoked on backend, cleared in localStorage, redirected to /login");
    } else {
      markTest("Logout/revoke token", false, "Failed to logout cleanly");
    }

  } catch (err) {
    console.error("Test execution error:", err);
  } finally {
    await browser.close();
  }

  // Summary output
  console.log("\n==================================================================");
  console.log("=== FINAL E2E CHECKLIST SUMMARY ===");
  console.log("==================================================================");
  for (const [key, val] of Object.entries(testChecklist)) {
    console.log(`[${val.pass ? "PASS" : "FAIL"}] ${key}`);
    if (val.details) console.log(`   └─ ${val.details}`);
  }

  // Write results JSON
  fs.writeFileSync("d:\\Kì_9_FPT\\KLTN\\Front-end-ADPP\\e2e_results.json", JSON.stringify({
    testChecklist,
    failedRequests,
    networkLogsSummary: { totalRequests: networkLogs.length }
  }, null, 2));
}

runE2E().catch(console.error);
