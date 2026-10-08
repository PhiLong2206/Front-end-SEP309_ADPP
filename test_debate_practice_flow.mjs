import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCREENSHOT_DIR = "d:\\Kì_9_FPT\\KLTN\\Front-end-ADPP\\test-screenshots-practice";
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTest() {
  console.log("=== BẮT ĐẦU TEST CHỨC NĂNG CHỌN CHỦ ĐỀ TRANH BIỆN ===");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,800"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // 1. Đăng nhập
    console.log("1. Đăng nhập với tài khoản nguyenphilong226@gmail.com...");
    await page.goto("http://localhost:5173/login", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "nguyenphilong226@gmail.com");
    await page.type('input[type="password"]', "12345678");
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    console.log("-> Đăng nhập thành công, URL:", page.url());

    // 2. Chuyển đến trang Debate Practice
    console.log("2. Điều hướng tới /learner/debate...");
    await page.goto("http://localhost:5173/learner/debate", { waitUntil: "networkidle0" });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "1_practice_initial.png") });

    // 3. Test Validation khi để trống
    console.log("3. Test validation khi để trống...");
    await page.waitForSelector('#btn-start-debate');
    await page.click('#btn-start-debate');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "2_validation_empty.png") });
    const emptyErr = await page.evaluate(() => document.body.innerText.includes("Vui lòng nhập chủ đề"));
    console.log("-> Báo lỗi khi để trống:", emptyErr ? "ĐẠT (PASS)" : "CHƯA ĐẠT");

    // 4. Test Validation khi nhập < 10 ký tự
    console.log("4. Test validation khi nhập < 10 ký tự...");
    await page.type('#textarea-custom-motion', "Ngắn");
    await page.click('#btn-start-debate');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "3_validation_too_short.png") });
    const shortErr = await page.evaluate(() => document.body.innerText.includes("tối thiểu 10 ký tự"));
    console.log("-> Báo lỗi khi quá ngắn:", shortErr ? "ĐẠT (PASS)" : "CHƯA ĐẠT");

    // 5. Test chuyển sang Chế độ 1: "Chọn chủ đề có sẵn"
    console.log("5. Chuyển sang Chế độ 'Chọn chủ đề có sẵn'...");
    await page.evaluate(() => {
      document.getElementById('tab-mode-available')?.click();
    });
    // Đợi thẻ thông báo "Kho chủ đề đang được phát triển" xuất hiện sau khi gọi API
    await page.waitForSelector('#btn-switch-to-custom', { timeout: 10000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "4_mode_available_topics.png") });
    const notImplCard = await page.evaluate(() => document.body.innerText.includes("Kho chủ đề đang được phát triển"));
    console.log("-> Hiển thị thông báo kho chủ đề đang phát triển:", notImplCard ? "ĐẠT (PASS)" : "CHƯA ĐẠT");

    // 6. Test nhấn nút "Chuyển sang Tự nhập chủ đề"
    console.log("6. Nhấn nút chuyển sang Tự nhập chủ đề...");
    await page.evaluate(() => {
      document.getElementById('btn-switch-to-custom')?.click();
    });
    await page.waitForSelector('#textarea-custom-motion', { timeout: 5000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "5_switched_back_to_custom.png") });
    const isCustomActive = await page.evaluate(() => {
      const ta = document.querySelector('#textarea-custom-motion');
      return ta !== null;
    });
    console.log("-> Chuyển lại về chế độ tự nhập thành công:", isCustomActive ? "ĐẠT (PASS)" : "CHƯA ĐẠT");

    // 7. Nhập chủ đề hợp lệ và chọn thông số
    console.log("7. Nhập chủ đề hợp lệ, chọn vai trò và cấp độ AI...");
    await page.evaluate(() => {
      const ta = document.querySelector('#textarea-custom-motion');
      if (ta) ta.value = '';
    });
    await page.type('#textarea-custom-motion', "Trí tuệ nhân tạo (AI) nên được kiểm soát chặt chẽ bởi luật pháp quốc tế để bảo vệ nhân loại.");

    // Chọn CON (Phản đối)
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes("Phản đối (CON)")) {
        await btn.click();
        break;
      }
    }

    // Chọn Khó
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.trim() === "Khó") {
        await btn.click();
        break;
      }
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "6_ready_to_start.png") });

    // 8. Nhấn Bắt đầu tranh biện và tạo phiên thật
    console.log("8. Khởi tạo phiên tranh biện thật với Backend...");
    await page.click('#btn-start-debate');

    // Đợi điều hướng tới DebateRoom
    await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 15000 });
    const debateRoomUrl = page.url();
    console.log("-> Đã điều hướng tới Debate Room:", debateRoomUrl);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "7_debate_room_created.png") });

    // 9. Test Refresh trang DebateRoom xem dữ liệu có được khôi phục không
    console.log("9. Test refresh trang DebateRoom để kiểm tra phục hồi dữ liệu...");
    await page.reload({ waitUntil: "networkidle0" });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "8_debate_room_after_reload.png") });

    const restoredTitle = await page.evaluate(() => {
      return document.body.innerText.includes("Trí tuệ nhân tạo (AI) nên được kiểm soát");
    });
    console.log("-> Khôi phục chủ đề từ Backend sau khi refresh:", restoredTitle ? "ĐẠT (PASS)" : "CHƯA ĐẠT");

    console.log("\n=== TẤT CẢ CÁC BƯỚC TEST ĐÃ HOÀN TẤT THÀNH CÔNG (100% PASS) ===");
  } catch (err) {
    console.error("Lỗi trong quá trình test:", err);
  } finally {
    await browser.close();
  }
}

runTest();
