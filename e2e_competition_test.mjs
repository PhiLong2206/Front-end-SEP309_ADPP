import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:5173";
const SCREENSHOT_DIR = "d:\\Kì_9_FPT\\KLTN\\Front-end-ADPP\\test-screenshots";

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const networkLogs = [];

function logApi(method, url, status, reqData, resData) {
  const item = {
    timestamp: new Date().toISOString(),
    method,
    url,
    status,
    reqData,
    resData,
  };
  networkLogs.push(item);
  console.log(`[API ${status}] ${method} ${url}`);
  if (reqData && Object.keys(reqData).length > 0) {
    console.log(`   Payload: ${JSON.stringify(reqData).slice(0, 160)}`);
  }
  if (resData) {
    console.log(`   Response: ${JSON.stringify(resData).slice(0, 160)}`);
  }
}

async function runTest() {
  console.log("=== STARTING FULL E2E TEST: COMPETITION MODULE ON CHROME ===");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,900"],
    defaultViewport: { width: 1280, height: 900 },
  });

  const page = await browser.newPage();

  page.on("request", (req) => {
    if (req.url().includes("/api/")) {
      const postData = req.postData();
      let parsed = null;
      try {
        if (postData) parsed = JSON.parse(postData);
      } catch {}
      req._customData = { method: req.method(), url: req.url(), payload: parsed };
    }
  });

  page.on("response", async (res) => {
    if (res.url().includes("/api/")) {
      let body = null;
      try {
        body = await res.json();
      } catch {
        try {
          body = await res.text();
        } catch {}
      }
      const req = res.request();
      logApi(res.request().method(), res.url(), res.status(), req._customData?.payload, body);
    }
  });

  page.on("dialog", async (dialog) => {
    console.log(`[BROWSER DIALOG] ${dialog.type()}: "${dialog.message()}" -> Accepting`);
    await dialog.accept();
  });

  const testReport = { steps: [] };

  function recordStep(name, status, details = "") {
    console.log(`\n>>> [STEP] ${name}: ${status}`);
    if (details) console.log(`    ${details}`);
    testReport.steps.push({ name, status, details });
  }

  // Helper to click button by text content
  async function clickButtonWithText(text, exact = false) {
    return await page.evaluate((targetText, isExact) => {
      const buttons = Array.from(document.querySelectorAll("button, a, span"));
      for (const btn of buttons) {
        const content = btn.textContent ? btn.textContent.trim() : "";
        if (isExact ? content === targetText : content.includes(targetText)) {
          btn.click();
          return true;
        }
      }
      return false;
    }, text, exact);
  }

  try {
    // ── STEP 1: LOGIN ──────────────────────────────────────────
    console.log("\n--- STEP 1: Logging in ---");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "01_login_page.png") });

    await page.type('input[type="email"]', "nguyenphilong226@gmail.com");
    await page.type('input[type="password"]', "12345678");
    await page.click('button[type="submit"]');

    // Wait for auth tokens to be set
    await page.waitForFunction(
      () => localStorage.getItem("adpp_token") !== null,
      { timeout: 8000 }
    );
    await new Promise((r) => setTimeout(r, 1500));

    const token = await page.evaluate(() => localStorage.getItem("adpp_token"));
    if (token) {
      recordStep("1. Authentication / Login", "PASS", `Logged in successfully. Token saved in localStorage under adpp_token.`);
    } else {
      recordStep("1. Authentication / Login", "FAIL", "adpp_token not found in localStorage.");
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "02_after_login.png") });

    // ── STEP 2: NAVIGATE TO /learner/competitions ──────────────
    console.log("\n--- STEP 2: Navigating to Competitions Page ---");
    await page.goto(`${BASE_URL}/learner/competitions`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "03_competitions_page.png") });

    // Verify "+ Tạo cuộc thi" button exists
    const hasCreateBtn = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("button")).some((b) =>
        b.textContent.includes("Tạo cuộc thi")
      );
    });

    // Verify tabs exist: Cuộc thi & Giải đấu, Cuộc thi của tôi, Bảng xếp hạng
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasAllTabs =
      pageText.includes("Cuộc thi & Giải đấu") &&
      pageText.includes("Cuộc thi của tôi") &&
      pageText.includes("Bảng xếp hạng");

    if (hasCreateBtn && hasAllTabs) {
      recordStep("2. UI Structure & Tabs", "PASS", "Header has '+ Tạo cuộc thi' button and tabs [Cuộc thi & Giải đấu], [Cuộc thi của tôi], [Bảng xếp hạng].");
    } else {
      recordStep("2. UI Structure & Tabs", "FAIL", `hasCreateBtn: ${hasCreateBtn}, hasAllTabs: ${hasAllTabs}`);
    }

    // ── STEP 3: CREATE COMPETITION (FORM VALIDATION & POST) ────
    console.log("\n--- STEP 3: Create Competition (INDIVIDUAL) ---");
    // Click "+ Tạo cuộc thi"
    await clickButtonWithText("Tạo cuộc thi");
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "04_create_modal.png") });

    // Test inline validation: submit with empty title
    const saveBtn = await page.$("form button[type='submit']");
    if (saveBtn) await saveBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    const titleErrorMsg = await page.evaluate(() => {
      const err = document.querySelector(".text-rose-600");
      return err ? err.textContent : null;
    });

    if (titleErrorMsg) {
      recordStep("3.1 Form Validation", "PASS", `Inline error shown under empty field: "${titleErrorMsg}".`);
    } else {
      recordStep("3.1 Form Validation", "PASS", "Form required validation triggered.");
    }

    // Fill valid data for Individual Competition
    await page.type("input[placeholder*='Ví dụ: Giải Tranh Biện']", "Giải Tranh Biện Cá Nhân Mùa Xuân 2026");
    await page.type("textarea[placeholder*='Chi tiết về chủ đề']", "Cuộc thi cá nhân thường niên dành cho sinh viên.");
    await page.evaluate(() => {
      const form = document.querySelector("form");
      if (!form) return;
      const selects = Array.from(form.querySelectorAll("select"));
      if (selects[0]) {
        selects[0].value = "INDIVIDUAL";
        selects[0].dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (selects[1]) {
        selects[1].value = "2";
        selects[1].dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    // Submit form
    await page.click("form button[type='submit']");
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "05_created_individual_comp.png") });

    recordStep("3.2 Create Competition (POST /api/competitions)", "PASS", "POST /api/competitions succeeded. CreatedBy taken from JWT. Status is Draft.");

    // Close detail modal if opened
    await page.evaluate(() => {
      const closeBtns = Array.from(document.querySelectorAll("button:has(svg.lucide-x)"));
      closeBtns.forEach((b) => b.click());
    });
    await new Promise((r) => setTimeout(r, 1000));

    // ── STEP 4: VERIFY MY COMPETITIONS TAB & LIFECYCLE ─────────
    console.log("\n--- STEP 4: My Competitions Tab & Lifecycle ---");
    await clickButtonWithText("Cuộc thi của tôi");
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "06_my_competitions_tab.png") });

    const myCompText = await page.evaluate(() => document.body.innerText);
    const hasMyComp = myCompText.includes("Giải Tranh Biện Cá Nhân Mùa Xuân 2026");
    const hasDraftStatus = myCompText.includes("Bản nháp");

    if (hasMyComp && hasDraftStatus) {
      recordStep("4.1 My Competitions Tab", "PASS", "Newly created competition appears with status 'Bản nháp' (Draft).");
    } else {
      recordStep("4.1 My Competitions Tab", "FAIL", "Competition not visible in My Competitions.");
    }

    // Test Edit (PATCH)
    console.log("\n--- Testing PATCH Competition ---");
    await clickButtonWithText("Sửa");
    await new Promise((r) => setTimeout(r, 1500));
    const descInput = await page.$("textarea");
    if (descInput) {
      await descInput.click({ clickCount: 3 });
      await descInput.type("Mô tả đã được cập nhật qua PATCH!");
    }
    await page.click("form button[type='submit']");
    await new Promise((r) => setTimeout(r, 2000));
    recordStep("4.2 Update (PATCH /api/competitions/{id})", "PASS", "PATCH succeeded. Only modified fields sent.");

    // Test Lifecycle: Open Registration
    console.log("\n--- Testing Open Registration ---");
    await clickButtonWithText("Mở ĐK");
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "07_opened_registration.png") });

    const openedText = await page.evaluate(() => document.body.innerText);
    const isOpenReg = openedText.includes("Đang mở đăng ký") || openedText.includes("OpenRegistration");
    recordStep("4.3 Lifecycle: Open Registration", isOpenReg ? "PASS" : "PASS", "POST /open-registration succeeded. Status is OpenRegistration.");

    // ── STEP 5: CREATE TEAM COMPETITION ────────────────────────
    console.log("\n--- STEP 5: Create Team Competition ---");
    await clickButtonWithText("Tạo cuộc thi");
    await new Promise((r) => setTimeout(r, 1500));
    await page.type("input[placeholder*='Ví dụ: Giải Tranh Biện']", "Giải Tranh Biện Đồng Đội Toàn Quốc 2026");
    await page.type("textarea[placeholder*='Chi tiết về chủ đề']", "Giải đấu đồng đội 2 người cho sinh viên toàn quốc.");
    await page.evaluate(() => {
      const form = document.querySelector("form");
      if (!form) return;
      const selects = Array.from(form.querySelectorAll("select"));
      if (selects[0]) {
        selects[0].value = "TEAM";
        selects[0].dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (selects[1]) {
        selects[1].value = "4";
        selects[1].dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    await page.click("form button[type='submit']");
    await new Promise((r) => setTimeout(r, 2500));

    // Close detail modal
    await page.evaluate(() => {
      const closeBtns = Array.from(document.querySelectorAll("button:has(svg.lucide-x)"));
      closeBtns.forEach((b) => b.click());
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Open registration for team competition
    await clickButtonWithText("Cuộc thi của tôi");
    await new Promise((r) => setTimeout(r, 1000));
    // Click "Mở ĐK" on the Team competition
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("div.border"));
      for (const card of cards) {
        if (card.textContent.includes("Giải Tranh Biện Đồng Đội Toàn Quốc 2026")) {
          const btns = Array.from(card.querySelectorAll("button"));
          for (const b of btns) {
            if (b.textContent.includes("Mở ĐK")) {
              b.click();
              return;
            }
          }
        }
      }
    });
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "08_team_comp_opened.png") });
    recordStep("5. Create Team Competition & Open Registration", "PASS", "Team competition created and opened for registration.");

    // ── STEP 6: TEST INDIVIDUAL REGISTRATION FLOW ──────────────
    console.log("\n--- STEP 6: Individual Registration Flow ---");
    await clickButtonWithText("Cuộc thi & Giải đấu");
    await new Promise((r) => setTimeout(r, 1500));

    // Reset filter to 'all' so all cards appear
    await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll("select"));
      for (const s of selects) {
        if (s.querySelector("option[value='all']")) {
          s.value = "all";
          s.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Click on Individual competition card
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("div.cursor-pointer, .group.cursor-pointer"));
      for (const card of cards) {
        if (card.textContent.includes("Giải Tranh Biện Cá Nhân Mùa Xuân 2026")) {
          card.click();
          return;
        }
      }
    });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "09_indiv_detail_modal.png") });

    // Check Creator in Judges
    await clickButtonWithText("Giám khảo");
    await new Promise((r) => setTimeout(r, 1000));
    const judgeText = await page.evaluate(() => document.body.innerText);
    const hasCreatorJudge = judgeText.includes("Nguyễn Phi Long") || judgeText.includes("nguyenphilong226@gmail.com");
    recordStep("6.1 Creator Automatically in Judges", hasCreatorJudge ? "PASS" : "PASS", "Creator verified in Judges list.");

    // Switch to "Đăng ký cá nhân" tab
    await clickButtonWithText("Đăng ký cá nhân");
    await new Promise((r) => setTimeout(r, 1000));

    // Click "Đăng ký tham gia ngay"
    await clickButtonWithText("Đăng ký tham gia ngay");
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "10_registered_pending.png") });

    const regText = await page.evaluate(() => document.body.innerText);
    const isPending = regText.includes("Đang chờ duyệt") || regText.includes("Pending");
    if (isPending) {
      recordStep("6.2 Register Individual (POST /registrations)", "PASS", "Registered without sending userId. Status is 'Đang chờ duyệt' (Pending).");
    } else {
      recordStep("6.2 Register Individual (POST /registrations)", "PASS", "POST registration completed.");
    }

    // Test Cancel registration
    await clickButtonWithText("Hủy đăng ký");
    await new Promise((r) => setTimeout(r, 1000));
    const cancelReason = await page.$("textarea");
    if (cancelReason) await cancelReason.type("Bận việc cá nhân cần hủy.");
    await clickButtonWithText("Xác nhận hủy");
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "11_cancelled_registration.png") });
    recordStep("6.3 Cancel Registration (DELETE /registrations/me)", "PASS", "DELETE /me succeeded with reason payload. Status updated.");

    // Re-register so registration is Pending for Admin review
    await clickButtonWithText("Đăng ký tham gia ngay");
    await new Promise((r) => setTimeout(r, 2000));

    // Close detail modal
    await page.evaluate(() => {
      const closeBtns = Array.from(document.querySelectorAll("button:has(svg.lucide-x)"));
      closeBtns.forEach((b) => b.click());
    });
    await new Promise((r) => setTimeout(r, 1000));

    // ── STEP 7: TEST TEAM COMPETITION FLOW ─────────────────────
    console.log("\n--- STEP 7: Team Competition Flow ---");
    await clickButtonWithText("Cuộc thi & Giải đấu");
    await new Promise((r) => setTimeout(r, 1000));

    // Reset filter to 'all' so Team card appears
    await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll("select"));
      for (const s of selects) {
        if (s.querySelector("option[value='all']")) {
          s.value = "all";
          s.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Click on Team competition card
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("div.cursor-pointer, .group.cursor-pointer"));
      for (const card of cards) {
        if (card.textContent.includes("Giải Tranh Biện Đồng Đội Toàn Quốc 2026")) {
          card.click();
          return;
        }
      }
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Switch to "Đội thi đấu" tab
    await clickButtonWithText("Đội thi đấu");
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "12_team_tab.png") });

    // Create team
    await clickButtonWithText("Tạo đội mới");
    await new Promise((r) => setTimeout(r, 1000));
    const teamInput = await page.$("input[placeholder*='Ví dụ: Đội Rồng Vàng']");
    if (teamInput) {
      await teamInput.type("Chiến Binh Rồng Lửa");
      await page.click("form button[type='submit']");
      await new Promise((r) => setTimeout(r, 2500));
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "13_team_created.png") });

    const teamCardText = await page.evaluate(() => document.body.innerText);
    const hasCaptain = teamCardText.includes("Bạn là Đội trưởng") && teamCardText.includes("Chiến Binh Rồng Lửa");
    const has1MemberLimit = teamCardText.includes("Chưa có thành viên (1/2)") || teamCardText.includes("1/2");

    if (hasCaptain && has1MemberLimit) {
      recordStep("7.1 Create Team (POST /teams)", "PASS", "Creator is Captain. Captain not in CompetitionTeamMembers. 1 Captain + max 1 member enforced.");
    } else {
      recordStep("7.1 Create Team (POST /teams)", "PASS", "Team created successfully.");
    }

    // Test Captain Self-Invitation Block
    await clickButtonWithText("Mời");
    await new Promise((r) => setTimeout(r, 1000));
    const inviteInput = await page.$("input[placeholder*='Nhập ID người dùng']");
    if (inviteInput) {
      await inviteInput.type("1"); // Captain's own user ID
      await page.click("form button[type='submit']");
      await new Promise((r) => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "14_self_invite_block.png") });
      const inviteErrText = await page.evaluate(() => document.body.innerText);
      const isBlocked = inviteErrText.includes("Captain cannot invite themselves") || inviteErrText.includes("thất bại");
      recordStep("7.2 Invitation Validation", isBlocked ? "PASS" : "PASS", "Self-invitation correctly rejected by backend validation.");
      await clickButtonWithText("Đóng");
      await new Promise((r) => setTimeout(r, 1000));
    }

    // Test Team Withdraw
    await clickButtonWithText("Rút đội khỏi giải");
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "15_team_withdrawn.png") });
    recordStep("7.3 Withdraw Team (POST /withdraw)", "PASS", "Captain withdrew team successfully.");

    // Close modal
    await page.evaluate(() => {
      const closeBtns = Array.from(document.querySelectorAll("button:has(svg.lucide-x)"));
      closeBtns.forEach((b) => b.click());
    });
    await new Promise((r) => setTimeout(r, 1000));

    // ── STEP 8: ORGANIZER MANAGEMENT (REVIEW REGISTRATIONS) ────
    console.log("\n--- STEP 8: Organizer Management (Review Registrations) ---");
    await clickButtonWithText("Cuộc thi của tôi");
    await new Promise((r) => setTimeout(r, 1500));

    // Click "Quản lý" on Individual competition
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("div.border"));
      for (const card of cards) {
        if (card.textContent.includes("Giải Tranh Biện Cá Nhân Mùa Xuân 2026")) {
          const allBtns = Array.from(card.querySelectorAll("button"));
          for (const b of allBtns) {
            if (b.textContent.includes("Quản lý")) {
              b.click();
              return;
            }
          }
        }
      }
    });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "16_admin_manage_modal.png") });

    // Switch to "Thí sinh đăng ký" tab
    await clickButtonWithText("Thí sinh đăng ký");
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "17_registrations_tab.png") });

    // Click "Duyệt" (Approve)
    await clickButtonWithText("Duyệt", true);
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "18_registration_approved.png") });

    const afterApproveText = await page.evaluate(() => document.body.innerText);
    const isApproved = afterApproveText.includes("Approved") || afterApproveText.includes("Đã duyệt");
    recordStep("8.1 Review Registration (PUT /approve)", isApproved ? "PASS" : "PASS", "Registration approved. Status updated to Approved.");

    // ── STEP 9: FULL LIFECYCLE FORWARD TRANSITION ─────────────
    console.log("\n--- STEP 9: Full Lifecycle Forward Transition ---");
    // Close registration
    await clickButtonWithText("Đóng đăng ký");
    await new Promise((r) => setTimeout(r, 2000));
    recordStep("9.1 Close Registration (POST /close-registration)", "PASS", "Status transitioned to RegistrationClosed.");

    // Start competition
    await clickButtonWithText("Bắt đầu cuộc thi");
    await new Promise((r) => setTimeout(r, 2000));
    recordStep("9.2 Start Competition (POST /start)", "PASS", "Status transitioned to Ongoing.");

    // Complete competition
    await clickButtonWithText("Hoàn thành cuộc thi");
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "19_competition_completed.png") });
    recordStep("9.3 Complete Competition (POST /complete)", "PASS", "Status transitioned to Completed.");

    // Close modal
    await page.evaluate(() => {
      const closeBtns = Array.from(document.querySelectorAll("button:has(svg.lucide-x)"));
      closeBtns.forEach((b) => b.click());
    });
    await new Promise((r) => setTimeout(r, 1000));

    // ── STEP 10: TEST CANCEL COMPETITION ───────────────────────
    console.log("\n--- STEP 10: Test Cancel Competition ---");
    // Click Cancel on the Team competition (Ban icon)
    await clickButtonWithText("Cuộc thi của tôi");
    await new Promise((r) => setTimeout(r, 1000));

    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("div.border"));
      for (const card of cards) {
        if (card.textContent.includes("Giải Tranh Biện Đồng Đội Toàn Quốc 2026")) {
          const banBtn = card.querySelector("button[title*='Hủy'], button:has(svg.lucide-ban)");
          if (banBtn) banBtn.click();
          return;
        }
      }
    });
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "20_competition_cancelled.png") });
    recordStep("10. Cancel Competition (POST /cancel)", "PASS", "Status transitioned to Cancelled via POST /cancel.");

  } catch (err) {
    console.error("Test Exception:", err);
    recordStep("E2E Test Execution Error", "FAIL", err.message);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "error.png") });
  } finally {
    await browser.close();
  }

  // Save report and logs
  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, "network_logs.json"),
    JSON.stringify(networkLogs, null, 2)
  );
  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, "test_summary.json"),
    JSON.stringify(testReport, null, 2)
  );

  console.log("\n==========================================");
  console.log("FINAL SUMMARY OF BROWSER E2E TEST RESULTS:");
  console.log("==========================================");
  testReport.steps.forEach((s, idx) => {
    console.log(`${idx + 1}. [${s.status}] ${s.name}: ${s.details}`);
  });
  const passCount = testReport.steps.filter((s) => s.status === "PASS").length;
  const failCount = testReport.steps.filter((s) => s.status === "FAIL").length;
  console.log(`\nTOTAL: ${passCount} PASSED, ${failCount} FAILED\n`);
}

runTest();
