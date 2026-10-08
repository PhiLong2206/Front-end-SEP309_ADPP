import fs from "fs";

const PROXY_URL = "http://localhost:5173/api";
const DIRECT_URL = "http://localhost:5001/api";

const accounts = {
  userA: {
    email: "nguyenphilong226@gmail.com",
    password: "12345678",
    token: null,
    refreshToken: null,
    userId: null,
    name: null,
  },
  userB: {
    email: "longnpse180044@fpt.edu.vn",
    password: "12345678",
    token: null,
    refreshToken: null,
    userId: null,
    name: null,
  },
};

const results = [];

function logTest(category, name, passed, details = "") {
  results.push({ category, name, passed, details });
  const statusStr = passed ? "PASS" : "FAIL";
  console.log(`[${statusStr}] [${category}] ${name} ${details ? "- " + details : ""}`);
}

async function request(baseUrl, method, path, token = null, body = null) {
  const url = `${baseUrl}${path}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(url, opts);
    let json = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }
    return { status: res.status, ok: res.ok, data: json };
  } catch (err) {
    return { status: 0, ok: false, error: err.message };
  }
}

async function run() {
  console.log("================================================================");
  console.log("  COMPREHENSIVE BACKEND - FRONTEND CONNECTED API TEST SUITE     ");
  console.log("================================================================");

  // 1. TEST AUTHENTICATION (via Vite Proxy & Direct Backend)
  console.log("\n=== 1. AUTHENTICATION & PROFILE APIS ===");

  // 1.1 Login User A via Vite Proxy
  const loginProxyA = await request(PROXY_URL, "POST", "/Auth/login", null, {
    email: accounts.userA.email,
    password: accounts.userA.password,
  });
  const passLoginProxyA = loginProxyA.ok && loginProxyA.data?.success && !!loginProxyA.data?.data?.accessToken;
  if (passLoginProxyA) {
    accounts.userA.token = loginProxyA.data.data.accessToken;
    accounts.userA.refreshToken = loginProxyA.data.data.refreshToken;
    accounts.userA.userId = loginProxyA.data.data.user.userId;
    accounts.userA.name = loginProxyA.data.data.user.fullName;
  }
  logTest("Auth", "User A Login via FE Vite Proxy (/api/Auth/login)", passLoginProxyA, `User ID: ${accounts.userA.userId}`);

  // 1.2 Login User B via Vite Proxy
  const loginProxyB = await request(PROXY_URL, "POST", "/Auth/login", null, {
    email: accounts.userB.email,
    password: accounts.userB.password,
  });
  const passLoginProxyB = loginProxyB.ok && loginProxyB.data?.success && !!loginProxyB.data?.data?.accessToken;
  if (passLoginProxyB) {
    accounts.userB.token = loginProxyB.data.data.accessToken;
    accounts.userB.refreshToken = loginProxyB.data.data.refreshToken;
    accounts.userB.userId = loginProxyB.data.data.user.userId;
    accounts.userB.name = loginProxyB.data.data.user.fullName;
  }
  logTest("Auth", "User B Login via FE Vite Proxy (/api/Auth/login)", passLoginProxyB, `User ID: ${accounts.userB.userId}`);

  // 1.3 User A Get Profile (/api/Users/me)
  const profileA = await request(PROXY_URL, "GET", "/Users/me", accounts.userA.token);
  logTest("Users", "User A GET /api/Users/me", profileA.ok && profileA.data?.success, profileA.data?.data?.email);

  // 1.4 User B Get Profile (/api/Users/me)
  const profileB = await request(PROXY_URL, "GET", "/Users/me", accounts.userB.token);
  logTest("Users", "User B GET /api/Users/me", profileB.ok && profileB.data?.success, profileB.data?.data?.email);

  // 1.5 User A Update Profile (/api/Users/me PUT)
  const updateA = await request(PROXY_URL, "PUT", "/Users/me", accounts.userA.token, {
    fullName: accounts.userA.name,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=longA",
    gender: "Male",
  });
  logTest("Users", "User A PUT /api/Users/me", updateA.ok && updateA.data?.success, updateA.data?.message);

  // 1.6 User A Refresh Token (/api/Auth/refresh-token)
  const refreshRes = await request(PROXY_URL, "POST", "/Auth/refresh-token", null, {
    refreshToken: accounts.userA.refreshToken,
  });
  const passRefresh = refreshRes.ok && refreshRes.data?.success && !!refreshRes.data?.data?.accessToken;
  if (passRefresh) {
    accounts.userA.token = refreshRes.data.data.accessToken;
    accounts.userA.refreshToken = refreshRes.data.data.refreshToken;
  }
  logTest("Auth", "POST /api/Auth/refresh-token", passRefresh, "Token rotated successfully");

  // 2. COMPETITION APIS
  console.log("\n=== 2. COMPETITION MODULE APIS ===");

  // 2.1 Get Competitions list
  const compList = await request(PROXY_URL, "GET", "/Competitions", accounts.userA.token);
  logTest("Competitions", "GET /api/Competitions", compList.ok && compList.data?.success, `Found ${compList.data?.data?.length || 0} competitions`);

  // 2.2 Create Competition (by User A)
  const uniqueTitle = `Kỳ thi Tranh biện Mùa hè ${Date.now()}`;
  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 86400000);
  const next2Month = new Date(now.getTime() + 60 * 86400000);

  const createComp = await request(PROXY_URL, "POST", "/Competitions", accounts.userA.token, {
    title: uniqueTitle,
    description: "Cuộc thi thử nghiệm kết nối hệ thống tự động",
    competitionType: "INDIVIDUAL",
    maxParticipants: 32,
    registrationStart: now.toISOString(),
    registrationEnd: nextMonth.toISOString(),
    startDate: nextMonth.toISOString(),
    endDate: next2Month.toISOString(),
    isPublic: true,
  });
  const createdCompId = createComp.data?.data?.competitionId;
  logTest("Competitions", "POST /api/Competitions", createComp.ok && createComp.data?.success, `ID: ${createdCompId}`);

  let regIdB = null;
  if (createdCompId) {
    // 2.3 Get Competition Details
    const compDetail = await request(PROXY_URL, "GET", `/Competitions/${createdCompId}`, accounts.userA.token);
    logTest("Competitions", `GET /api/Competitions/${createdCompId}`, compDetail.ok && compDetail.data?.success, compDetail.data?.data?.title);

    // 2.4 Patch Competition
    const patchComp = await request(PROXY_URL, "PATCH", `/Competitions/${createdCompId}`, accounts.userA.token, {
      description: "Mô tả đã được cập nhật qua API Patch",
    });
    logTest("Competitions", `PATCH /api/Competitions/${createdCompId}`, patchComp.ok && patchComp.data?.success, patchComp.data?.message);

    // 2.5 Open Registration
    const openReg = await request(PROXY_URL, "POST", `/Competitions/${createdCompId}/open-registration`, accounts.userA.token);
    logTest("Competitions", `POST /api/Competitions/${createdCompId}/open-registration`, openReg.ok && openReg.data?.success, openReg.data?.message);

    // 2.6 User B registers for Competition
    const regResB = await request(PROXY_URL, "POST", `/competitions/${createdCompId}/registrations`, accounts.userB.token);
    regIdB = regResB.data?.data?.registrationId;
    logTest("Competitions", `User B POST /api/competitions/${createdCompId}/registrations`, regResB.ok && regResB.data?.success, `Registration ID: ${regIdB}`);

    // 2.7 Get Registrations list
    const getRegs = await request(PROXY_URL, "GET", `/competitions/${createdCompId}/registrations`, accounts.userA.token);
    logTest("Competitions", `GET /api/competitions/${createdCompId}/registrations`, getRegs.ok && getRegs.data?.success, `Count: ${getRegs.data?.data?.length}`);

    // 2.8 Get single Registration by ID (the newly added API)
    if (regIdB) {
      const getSingleReg = await request(PROXY_URL, "GET", `/competitions/${createdCompId}/registrations/${regIdB}`, accounts.userA.token);
      logTest("Competitions", `GET /api/competitions/${createdCompId}/registrations/${regIdB}`, getSingleReg.ok && getSingleReg.data?.success, `Status: ${getSingleReg.data?.data?.status}`);

      // 2.9 Approve registration
      const approveReg = await request(PROXY_URL, "PUT", `/competitions/${createdCompId}/registrations/${regIdB}/approve`, accounts.userA.token);
      logTest("Competitions", `PUT /api/competitions/${createdCompId}/registrations/${regIdB}/approve`, approveReg.ok && approveReg.data?.success, approveReg.data?.message);
    }

    // 2.10 Get Judges
    const judgesRes = await request(PROXY_URL, "GET", `/competitions/${createdCompId}/judges`, accounts.userA.token);
    logTest("Competitions", `GET /api/competitions/${createdCompId}/judges`, judgesRes.ok && judgesRes.data?.success, `Count: ${judgesRes.data?.data?.length}`);

    // 2.11 Close Registration
    const closeReg = await request(PROXY_URL, "POST", `/Competitions/${createdCompId}/close-registration`, accounts.userA.token);
    logTest("Competitions", `POST /api/Competitions/${createdCompId}/close-registration`, closeReg.ok && closeReg.data?.success, closeReg.data?.message);

    // 2.12 Start Competition
    const startComp = await request(PROXY_URL, "POST", `/Competitions/${createdCompId}/start`, accounts.userA.token);
    logTest("Competitions", `POST /api/Competitions/${createdCompId}/start`, startComp.ok && startComp.data?.success, startComp.data?.message);

    // 2.13 Complete Competition
    const completeComp = await request(PROXY_URL, "POST", `/Competitions/${createdCompId}/complete`, accounts.userA.token);
    logTest("Competitions", `POST /api/Competitions/${createdCompId}/complete`, completeComp.ok && completeComp.data?.success, completeComp.data?.message);
  }

  // 3. DEBATE APIS (AI PRACTICE & P2P)
  console.log("\n=== 3. DEBATE MODULE APIS (AI PRACTICE & P2P) ===");

  // 3.1 Create AI Practice Session
  const aiPracticeRes = await request(PROXY_URL, "POST", "/Debate/ai-practice", accounts.userA.token, {
    title: "Tranh biện AI về Bảo mật Dữ liệu",
    topic: "Chính phủ có nên áp đặt quy định mã hóa đầu cuối bắt buộc?",
    userSide: 1, // PRO
    isAI: true,
    difficulty: "Medium",
    turnTimeLimitSeconds: 180,
  });
  const aiSessionId = aiPracticeRes.data?.data?.sessionId;
  logTest("Debate", "POST /api/Debate/ai-practice", aiPracticeRes.ok && aiPracticeRes.data?.success, `Session ID: ${aiSessionId}`);

  if (aiSessionId) {
    // 3.2 Get Session Details
    const sessionDetails = await request(PROXY_URL, "GET", `/Debate/${aiSessionId}`, accounts.userA.token);
    logTest("Debate", `GET /api/Debate/${aiSessionId}`, sessionDetails.ok && sessionDetails.data?.success, `Stage: ${sessionDetails.data?.data?.currentStage}`);

    // 3.3 Submit Argument
    const submitArg = await request(PROXY_URL, "POST", `/Debate/${aiSessionId}/arguments`, accounts.userA.token, {
      content: "Mã hóa đầu cuối là nhân quyền số thiết yếu để bảo vệ dữ liệu công dân trước các cuộc tấn công mạng quy mô lớn.",
    });
    logTest("Debate", `POST /api/Debate/${aiSessionId}/arguments`, submitArg.ok && submitArg.data?.success, submitArg.data?.message);

    // 3.4 Get Transcript
    const transcript = await request(PROXY_URL, "GET", `/Debate/${aiSessionId}/transcript`, accounts.userA.token);
    logTest("Debate", `GET /api/Debate/${aiSessionId}/transcript`, transcript.ok && transcript.data?.success, `Arguments: ${transcript.data?.data?.arguments?.length}`);
  }

  // 3.5 User A Debate History
  const historyA = await request(PROXY_URL, "GET", "/Debate/my-history", accounts.userA.token);
  logTest("Debate", "GET /api/Debate/my-history (User A)", historyA.ok && historyA.data?.success, `History count: ${historyA.data?.data?.length}`);

  // 3.6 Create P2P Session (User A)
  const p2pRes = await request(PROXY_URL, "POST", "/Debate/p2p", accounts.userA.token, {
    title: "Thách đấu P2P Trực tiếp",
    topic: "Làm việc từ xa có hiệu quả hơn làm việc tại văn phòng?",
    userSide: 1, // PRO
    turnTimeLimitSeconds: 180,
  });
  const p2pSessionId = p2pRes.data?.data?.sessionId;
  logTest("Debate", "POST /api/Debate/p2p", p2pRes.ok && p2pRes.data?.success, `Session ID: ${p2pSessionId}`);

  if (p2pSessionId) {
    // 3.7 User B Joins P2P Session
    const joinRes = await request(PROXY_URL, "POST", `/Debate/${p2pSessionId}/join`, accounts.userB.token, {
      preferredSide: 2, // CON
    });
    logTest("Debate", `User B POST /api/Debate/${p2pSessionId}/join`, joinRes.ok && joinRes.data?.success, joinRes.data?.message);
  }

  // 4. DEBATE CHALLENGE MODULE APIS
  console.log("\n=== 4. 1V1 DEBATE CHALLENGE APIS ===");

  // 4.1 User A creates Challenge to User B
  const createChallenge1 = await request(PROXY_URL, "POST", "/debate/challenges", accounts.userA.token, {
    challengedUserId: accounts.userB.userId,
    topic: "Giáo dục truyền thống so với tự học trực tuyến",
    challengerPreferredSide: 1, // PRO
    turnTimeLimitSeconds: 180,
  });
  const challenge1Id = createChallenge1.data?.data?.challengeId;
  logTest("Challenges", `User A POST /api/debate/challenges (to User B)`, createChallenge1.ok && createChallenge1.data?.success, `Challenge ID: ${challenge1Id}`);

  // 4.2 User A checks Sent Challenges
  const sentRes = await request(PROXY_URL, "GET", "/debate/challenges/sent", accounts.userA.token);
  logTest("Challenges", "User A GET /api/debate/challenges/sent", sentRes.ok && sentRes.data?.success, `Count: ${sentRes.data?.data?.length}`);

  // 4.3 User B checks Received Challenges
  const receivedRes = await request(PROXY_URL, "GET", "/debate/challenges/received", accounts.userB.token);
  logTest("Challenges", "User B GET /api/debate/challenges/received", receivedRes.ok && receivedRes.data?.success, `Count: ${receivedRes.data?.data?.length}`);

  // 4.4 Get Challenge by ID
  if (challenge1Id) {
    const singleChallenge = await request(PROXY_URL, "GET", `/debate/challenges/${challenge1Id}`, accounts.userB.token);
    logTest("Challenges", `GET /api/debate/challenges/${challenge1Id}`, singleChallenge.ok && singleChallenge.data?.success, `Status: ${singleChallenge.data?.data?.status}`);

    // 4.5 User B Accepts Challenge
    const acceptRes = await request(PROXY_URL, "POST", `/debate/challenges/${challenge1Id}/accept`, accounts.userB.token);
    const createdSessionIdFromChallenge = acceptRes.data?.data?.debateSessionId;
    logTest("Challenges", `User B POST /api/debate/challenges/${challenge1Id}/accept`, acceptRes.ok && acceptRes.data?.success, `Debate Session: ${createdSessionIdFromChallenge}`);
  }

  // 4.6 User A sends Challenge 2 -> User B Rejects it
  const createChallenge2 = await request(PROXY_URL, "POST", "/debate/challenges", accounts.userA.token, {
    challengedUserId: accounts.userB.userId,
    topic: "Thử nghiệm từ chối thách đấu",
    challengerPreferredSide: 2,
    turnTimeLimitSeconds: 120,
  });
  const challenge2Id = createChallenge2.data?.data?.challengeId;
  if (challenge2Id) {
    const rejectRes = await request(PROXY_URL, "POST", `/debate/challenges/${challenge2Id}/reject`, accounts.userB.token);
    logTest("Challenges", `User B POST /api/debate/challenges/${challenge2Id}/reject`, rejectRes.ok && rejectRes.data?.success, rejectRes.data?.message);
  }

  // 4.7 User A sends Challenge 3 -> User A Cancels it
  const createChallenge3 = await request(PROXY_URL, "POST", "/debate/challenges", accounts.userA.token, {
    challengedUserId: accounts.userB.userId,
    topic: "Thử nghiệm người gửi hủy thách đấu",
    challengerPreferredSide: 1,
    turnTimeLimitSeconds: 120,
  });
  const challenge3Id = createChallenge3.data?.data?.challengeId;
  if (challenge3Id) {
    const cancelRes = await request(PROXY_URL, "POST", `/debate/challenges/${challenge3Id}/cancel`, accounts.userA.token);
    logTest("Challenges", `User A POST /api/debate/challenges/${challenge3Id}/cancel`, cancelRes.ok && cancelRes.data?.success, cancelRes.data?.message);
  }

  // 5. SUMMARY
  console.log("\n================================================================");
  console.log("                        TEST SUMMARY                            ");
  console.log("================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`Total API Tests : ${total}`);
  console.log(`Passed          : ${passed}`);
  console.log(`Failed          : ${failed}`);
  console.log(`Success Rate    : ${((passed / total) * 100).toFixed(1)}%`);

  fs.writeFileSync(
    "d:\\Kì_9_FPT\\KLTN\\Front-end-ADPP\\api_verification_results.json",
    JSON.stringify({ total, passed, failed, results }, null, 2)
  );

  if (failed === 0) {
    console.log("\n>>> ALL CONNECTED BE-FE APIS PASSED WITH BOTH ACCOUNTS! <<<");
  } else {
    console.error(`\n>>> ${failed} TESTS FAILED. CHECK DETAILS ABOVE. <<<`);
    process.exit(1);
  }
}

run();
