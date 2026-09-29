// ============================================================
// MOCK DATA – WF-05 Events & Competitions, WF-04 1v1, WF-06 Payments
// ============================================================

export interface DebateEvent {
  id: string;
  title: string;
  description: string;
  organizer: string;
  type: "event" | "competition";
  format: "AI_JUDGE" | "EDUCATOR_JUDGE" | "PEER";
  rules: "WSDC" | "BP" | "FREE";
  topic: string;
  startDate: string;
  endDate: string;
  registerDeadline: string;
  maxParticipants: number;
  currentParticipants: number;
  status: "upcoming" | "ongoing" | "ended";
  prizePool?: string;
  entryFee?: number;
  rounds?: number;
  isRegistered?: boolean;
  tags: string[];
}

export const MOCK_EVENTS: DebateEvent[] = [
  {
    id: "evt-001",
    title: "Cuoc thi Tranh bien AI Mua 1 - 2026",
    description:
      "Cuoc thi tranh bien lon nhat nen tang, quy tu cac nguoi hoc xuat sac tu khap ca nuoc. He thong AI Judge cham diem theo rubric quoc te WSDC. Nguoi chien thang nhan hoc bong khoa hoc cao cap.",
    organizer: "ADPP Platform",
    type: "competition",
    format: "AI_JUDGE",
    rules: "WSDC",
    topic: "Tri tue nhan tao co nen duoc quan ly chat che?",
    startDate: "2026-10-15",
    endDate: "2026-10-30",
    registerDeadline: "2026-10-10",
    maxParticipants: 64,
    currentParticipants: 47,
    status: "upcoming",
    prizePool: "5.000.000 VND",
    entryFee: 50000,
    rounds: 6,
    isRegistered: false,
    tags: ["AI", "WSDC", "Thi dau", "Co giai thuong"],
  },
  {
    id: "evt-002",
    title: "Workshop: Nghe thuat phan bien hieu qua",
    description:
      "Buoi hoi thao truc tuyen do giang vien TS. Nguyen Minh Tri huong dan, tap trung vao ky nang to chuc lap luan, phan tich diem yeu cua doi phuong va xay dung phan bien sac ben trong 90 giay.",
    organizer: "TS. Nguyen Minh Tri",
    type: "event",
    format: "EDUCATOR_JUDGE",
    rules: "FREE",
    topic: "Ky nang phan bien trong tranh luan hoc thuat",
    startDate: "2026-10-05",
    endDate: "2026-10-05",
    registerDeadline: "2026-10-04",
    maxParticipants: 100,
    currentParticipants: 68,
    status: "upcoming",
    entryFee: 0,
    isRegistered: true,
    tags: ["Workshop", "Mien phi", "Ky nang", "Truc tuyen"],
  },
  {
    id: "evt-003",
    title: "Giai dau BP - British Parliamentary Thang 10",
    description:
      "Giai dau theo the thuc British Parliamentary (BP) voi 4 doi tren moi phong. AI Judge cham diem theo tieu chi Content, Style va Strategy rieng biet.",
    organizer: "Debate Club FPT",
    type: "competition",
    format: "AI_JUDGE",
    rules: "BP",
    topic: "Dai hoc co nen mien hoc phi toan phan?",
    startDate: "2026-10-20",
    endDate: "2026-10-22",
    registerDeadline: "2026-10-17",
    maxParticipants: 32,
    currentParticipants: 32,
    status: "upcoming",
    prizePool: "2.000.000 VND",
    entryFee: 30000,
    rounds: 4,
    isRegistered: false,
    tags: ["BP", "Thi dau", "FPT Club"],
  },
  {
    id: "evt-004",
    title: "Phien tranh bien giao luu - Chu de Moi truong",
    description:
      "Phien tranh bien giao luu khong tinh diem, danh cho nguoi hoc moi bat dau. Chu de lien quan den bien doi khi hau va trach nhiem cua ca nhan vs. doanh nghiep.",
    organizer: "ADPP Platform",
    type: "event",
    format: "PEER",
    rules: "FREE",
    topic: "Ca nhan hay doanh nghiep chiu trach nhiem chinh cho bien doi khi hau?",
    startDate: "2026-09-28",
    endDate: "2026-09-28",
    registerDeadline: "2026-09-27",
    maxParticipants: 20,
    currentParticipants: 15,
    status: "ongoing",
    entryFee: 0,
    isRegistered: true,
    tags: ["Giao luu", "Mien phi", "Moi truong", "Nguoi moi"],
  },
];

// ── WF-04: 1v1 Matches ──────────────────────────────────────

export interface Debate1v1Match {
  id: string;
  roomName: string;
  topic: string;
  rules: "WSDC" | "BP" | "FREE";
  date: string;
  duration: string;
  playerA: { name: string; avatar: string; role: "PRO" | "CON"; score: number };
  playerB: { name: string; avatar: string; role: "PRO" | "CON"; score: number };
  result: "WIN" | "LOSE" | "DRAW";
  aiJudgeVerdict: string;
  scores: { logic: number; evidence: number; relevance: number; structure: number; persuasiveness: number };
  opponentScores: { logic: number; evidence: number; relevance: number; structure: number; persuasiveness: number };
  judgeComments: string[];
  myStrengths: string[];
  myImprovements: string[];
}

export const MOCK_1V1_MATCHES: Debate1v1Match[] = [
  {
    id: "match-001",
    roomName: "Phong luyen tap #12",
    topic: "Mang xa hoi co gay hai nhieu hon loi ich?",
    rules: "WSDC",
    date: "14/03/2026 - 21:30",
    duration: "28 phut",
    playerA: { name: "Phi Long", avatar: "PL", role: "PRO", score: 82 },
    playerB: { name: "Hoang Nam", avatar: "HN", role: "CON", score: 75 },
    result: "WIN",
    aiJudgeVerdict:
      "Nguoi choi Phi Long (Ung ho) gianh chien thang voi tong diem 82/100. Luan diem ve tac dong thuat toan va suc khoe tam than duoc trien khai co he thong, dan chung cu the va phan bien hieu qua.",
    scores: { logic: 85, evidence: 78, relevance: 88, structure: 82, persuasiveness: 80 },
    opponentScores: { logic: 75, evidence: 70, relevance: 78, structure: 76, persuasiveness: 74 },
    judgeComments: [
      "Phi Long the hien kha nang phan tich nhan qua ro rang trong phan Opening.",
      "Hoang Nam co phan Rebuttal cham, de doi phuong kiem soat chu de suot hiep 2.",
      "Ca hai deu thieu dan chung so lieu cu the tu nghien cuu hoc thuat.",
    ],
    myStrengths: [
      "Luan diem Opening ro rang, co cau truc 3 nhanh.",
      "Phan bien vong 2 sac ben, xac dinh dung diem mau thuan cua doi phuong.",
    ],
    myImprovements: [
      "Can bo sung dan chung thong ke cu the (so lieu nghien cuu, khao sat).",
      "Phan Closing Summary can tom gon va nhan manh hon.",
    ],
  },
];

export const MOCK_1V1_MY_ROOMS = [
  {
    id: "room-001",
    name: "Phong luyen tap cua Phi Long",
    topic: "Tri tue nhan tao co nen duoc quan ly chat che?",
    rules: "WSDC",
    status: "waiting" as const,
    createdAt: "5 phut truoc",
    maxPlayers: 2,
    currentPlayers: 1,
    isPrivate: false,
  },
];

// ── WF-06: AI Usage & Payments ──────────────────────────────

export type AIServiceType =
  | "AI_COACHING"
  | "REBUTTAL_HINT"
  | "AI_EVALUATION"
  | "AI_JUDGE_1V1"
  | "SPEECH_TO_TEXT";

export interface AIUsageRecord {
  id: string;
  service: AIServiceType;
  serviceLabel: string;
  sessionId: string;
  sessionTopic: string;
  usedAt: string;
  unitCost: number;
  quantity: number;
  totalCost: number;
  status: "pending" | "paid" | "free";
}

export const AI_SERVICE_PRICE: Record<AIServiceType, { label: string; unitLabel: string; price: number }> = {
  AI_COACHING: { label: "AI Coaching / Goi y chien luoc", unitLabel: "lan", price: 2000 },
  REBUTTAL_HINT: { label: "Rebuttal Hint (Goi y phan bien)", unitLabel: "lan", price: 1000 },
  AI_EVALUATION: { label: "AI Cham diem & Bao cao", unitLabel: "phien", price: 5000 },
  AI_JUDGE_1V1: { label: "AI Judge (Trong tai 1v1)", unitLabel: "tran", price: 8000 },
  SPEECH_TO_TEXT: { label: "Speech-to-Text (Chuyen giong noi)", unitLabel: "phut", price: 500 },
};

export const MOCK_AI_USAGE: AIUsageRecord[] = [
  { id: "usage-001", service: "AI_EVALUATION", serviceLabel: "AI Cham diem & Bao cao", sessionId: "session-1", sessionTopic: "Mang xa hoi co gay hai hon loi ich?", usedAt: "14/03/2026 - 22:10", unitCost: 5000, quantity: 1, totalCost: 5000, status: "paid" },
  { id: "usage-002", service: "AI_COACHING", serviceLabel: "AI Coaching / Goi y chien luoc", sessionId: "session-1", sessionTopic: "Mang xa hoi co gay hai hon loi ich?", usedAt: "14/03/2026 - 21:45", unitCost: 2000, quantity: 3, totalCost: 6000, status: "paid" },
  { id: "usage-003", service: "REBUTTAL_HINT", serviceLabel: "Rebuttal Hint (Goi y phan bien)", sessionId: "session-2", sessionTopic: "Tri tue nhan tao co nen duoc quan ly?", usedAt: "11/03/2026 - 20:30", unitCost: 1000, quantity: 5, totalCost: 5000, status: "paid" },
  { id: "usage-004", service: "AI_JUDGE_1V1", serviceLabel: "AI Judge (Trong tai 1v1)", sessionId: "match-001", sessionTopic: "Mang xa hoi co gay hai hon loi ich?", usedAt: "14/03/2026 - 22:00", unitCost: 8000, quantity: 1, totalCost: 8000, status: "paid" },
  { id: "usage-005", service: "SPEECH_TO_TEXT", serviceLabel: "Speech-to-Text (Chuyen giong noi)", sessionId: "session-3", sessionTopic: "Dai hoc co nen mien hoc phi?", usedAt: "09/03/2026 - 19:15", unitCost: 500, quantity: 8, totalCost: 4000, status: "paid" },
  { id: "usage-006", service: "AI_EVALUATION", serviceLabel: "AI Cham diem & Bao cao", sessionId: "session-current", sessionTopic: "Nang luong tai tao co the thay the nhien lieu hoa thach?", usedAt: "27/09/2026 - 13:40", unitCost: 5000, quantity: 1, totalCost: 5000, status: "pending" },
  { id: "usage-007", service: "AI_COACHING", serviceLabel: "AI Coaching / Goi y chien luoc", sessionId: "session-current", sessionTopic: "Nang luong tai tao co the thay the nhien lieu hoa thach?", usedAt: "27/09/2026 - 13:20", unitCost: 2000, quantity: 2, totalCost: 4000, status: "pending" },
];

export interface PaymentTransaction {
  id: string;
  amount: number;
  method: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  createdAt: string;
  description: string;
}

export const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  { id: "txn-001", amount: 24000, method: "MoMo", status: "SUCCESS", createdAt: "14/03/2026 - 22:15", description: "Thanh toan AI Usage - phien 14/03" },
  { id: "txn-002", amount: 9000, method: "VNPay", status: "SUCCESS", createdAt: "11/03/2026 - 20:45", description: "Thanh toan AI Usage - phien 11/03" },
  { id: "txn-003", amount: 4000, method: "VNPay", status: "SUCCESS", createdAt: "09/03/2026 - 19:30", description: "Thanh toan Speech-to-Text - phien 09/03" },
];
