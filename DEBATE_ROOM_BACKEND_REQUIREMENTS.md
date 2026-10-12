# BÁO CÁO YÊU CẦU BACKEND CHO DEBATE ROOM (1vs1, 2vs2, COMPETITION, AI PRACTICE)

**Dự án:** SEP409 – AI Debate Platform  
**Hệ thống:** Frontend ReactJS $\leftrightarrow$ Backend .NET SystemService & Python AI Services  
**Ngày thực hiện:** 09/10/2026  
**Người thực hiện:** Antigravity AI Engineering Team  

---

## 1. Tổng quan kiến trúc hiện tại và Phát hiện

Sau khi rà soát toàn bộ source code của Frontend (`Front-end-ADPP`) và Backend .NET (`SEP409-AI-DEBATE/Services/SystemService`):

| Thành phần | Trạng thái hiện tại | Đánh giá & Khả năng vận hành |
| :--- | :--- | :--- |
| **AI Practice (1 vs AI)** | ✅ Đã hỗ trợ đầy đủ | Frontend đã tích hợp đầy đủ Backend .NET lưu phiên/transcript và các Python AI Microservices (`/opponent/sessions`, `/evaluate`). |
| **1vs1 P2P Match** | ⚠️ Hỗ trợ một phần | Backend có `POST /api/Debate/p2p`, `POST /api/Debate/{id}/join`, `POST /api/Debate/{id}/arguments`, `GET /api/Debate/{id}/transcript`. Lượt nói kiểm tra PRO/CON xen kẽ. **Chưa có SignalR**, đang dùng cơ chế Polling 3.5s. |
| **2vs2 Team Match** | ❌ Chưa có Backend | Backend `DebateService.cs` hiện chặn cứng `session.Participants.Count >= 2` và chỉ chia 2 phe đơn lập PRO/CON (mỗi phe 1 người). Chưa có mô hình Team 2 người / phe, chưa có thứ tự phát biểu 4 người (PRO 1, CON 1, PRO 2, CON 2). |
| **Competition Match** | ❌ Chưa có Backend Match | Backend chỉ mới có quản lý cuộc thi tĩnh (`CompetitionsController`, `CompetitionTeamsController`, `CompetitionRegistrationsController`, `CompetitionJudgesController`). **Chưa có controller hay entity cho Trận đấu thuộc giải đấu (CompetitionMatch/Bracket)**, chưa liên kết Session với Competition. |
| **Realtime (SignalR)** | ❌ Hoàn toàn chưa có | Cả Backend .NET lẫn Frontend chưa cài đặt thư viện SignalR, chưa có Hub, chưa có event đẩy dữ liệu thời gian thực. |

---

## 2. Danh mục API hiện có (Working / Partial)

### 2.1. Debate Endpoints (`DebateController.cs`)
* `POST /api/Debate/ai-practice`: Tạo phiên tranh biện với AI (Đang hoạt động tốt).
* `POST /api/Debate/p2p`: Khởi tạo phòng đấu P2P (Status: `Waiting = 1`).
* `POST /api/Debate/{id}/join`: Người thứ hai tham gia phòng (Status chuyển sang `InProgress = 2`).
* `GET /api/Debate/{id}`: Lấy thông tin phòng, danh sách `participants`, vòng hiện tại và lượt nói `currentTurn`.
* `POST /api/Debate/{id}/arguments`: Nộp luận điểm (Backend kiểm tra đúng bên `currentTurnSide` và lưu vào `Argument`).
* `GET /api/Debate/{id}/transcript`: Trả về toàn bộ các luận điểm đã nộp theo thứ tự lượt.
* `GET /api/Debate/my-history`: Lấy lịch sử các phiên tranh biện của user.

### 2.2. Challenge Endpoints (`DebateChallengeController.cs`)
* `POST /api/Debate/challenges`: Gửi lời mời thách đấu 1vs1 tới user khác.
* `GET /api/Debate/challenges/received`: Lấy danh sách thách đấu nhận được.
* `GET /api/Debate/challenges/sent`: Lấy danh sách thách đấu đã gửi.
* `POST /api/Debate/challenges/{id}/accept`: Chấp nhận thách đấu (tạo ra `DebateSessionId` và điều hướng vào phòng).
* `POST /api/Debate/challenges/{id}/reject`: Từ chối thách đấu.
* `POST /api/Debate/challenges/{id}/cancel`: Hủy lời mời thách đấu.

### 2.3. Competition Endpoints (`CompetitionsController.cs` & `CompetitionTeamsController.cs`)
* `GET /api/Competitions`: Danh sách cuộc thi.
* `GET /api/Competitions/{id}`: Chi tiết cuộc thi.
* `GET /api/Competitions/{id}/teams`: Danh sách các đội đã đăng ký.
* `GET /api/Competitions/{id}/judges`: Danh sách giám khảo được phân công cho cuộc thi.

---

## 3. Danh mục API còn thiếu & DTO cần bổ sung

### 3.1. Dành cho chế độ 2vs2 (Đồng đội 2 vs 2)

#### API cần bổ sung:
1. `POST /api/Debate/2v2`:
   * **Mục đích**: Khởi tạo phiên tranh biện 2vs2 (Format 4 người, 2 đội).
   * **Request DTO**:
     ```csharp
     public class Create2v2DebateSessionRequest
     {
         public string Title { get; set; }
         public string Topic { get; set; }
         public int TeamProId { get; set; }
         public int TeamConId { get; set; }
         public int TurnTimeLimitSeconds { get; set; } = 180;
     }
     ```
2. `POST /api/Debate/{sessionId}/join-team`:
   * **Mục đích**: Thành viên của Team PRO hoặc Team CON tham gia vào phòng tranh biện theo slot (PRO 1, PRO 2, CON 1, CON 2).
   * **Request DTO**:
     ```csharp
     public class JoinTeamDebateRequest
     {
         public DebateSide Side { get; set; } // PRO = 1, CON = 2
         public int SpeakerOrder { get; set; } // 1 (First Speaker), 2 (Second Speaker)
     }
     ```
3. Cập nhật `SubmitArgumentAsync` trong `DebateService.cs`:
   * Mở rộng điều kiện kiểm tra người phát biểu: Không chỉ kiểm tra `Side == expectedSide`, mà phải kiểm tra đúng thứ tự người phát biểu:
     * Vòng 1 (Mở đầu): PRO 1 $\rightarrow$ CON 1
     * Vòng 2 (Phản biện): PRO 2 $\rightarrow$ CON 2
     * Vòng 3 (Kết luận): CON 1 (hoặc CON 2) $\rightarrow$ PRO 1 (hoặc PRO 2)
   * Nâng giới hạn người tham gia từ `Participants.Count >= 2` lên `Participants.Count >= 4`.

---

### 3.2. Dành cho chế độ Competition (Giải đấu)

#### API cần bổ sung:
1. `GET /api/Competitions/{competitionId}/matches`:
   * **Mục đích**: Lấy danh sách các trận đấu theo bảng đấu/vòng đấu (Vòng loại, Tứ kết, Bán kết, Chung kết).
   * **Response DTO**:
     ```csharp
     public class CompetitionMatchDto
     {
         public int MatchId { get; set; }
         public int CompetitionId { get; set; }
         public string MatchCode { get; set; } // e.g. "R1-M01", "SEMI-01"
         public string RoundStage { get; set; } // "Vòng Bảng", "Tứ Kết", "Chung Kết"
         public int DebateSessionId { get; set; }
         public string Format { get; set; } // "1v1" hoặc "2v2"
         public string Status { get; set; } // "Scheduled", "Ongoing", "Completed"
         public TeamSummaryDto TeamPro { get; set; }
         public TeamSummaryDto TeamCon { get; set; }
         public List<JudgeSummaryDto> AssignedJudges { get; set; }
         public DateTime ScheduledStartTime { get; set; }
     }
     ```
2. `POST /api/Competitions/{competitionId}/matches/{matchId}/scores`:
   * **Mục đích**: Cho phép Giám khảo nộp bảng điểm chính thức theo rubric.
   * **Request DTO**:
     ```csharp
     public class SubmitJudgeScoreRequest
     {
         public int MatchId { get; set; }
         public int TargetTeamOrParticipantId { get; set; }
         public decimal LogicScore { get; set; } // 0 - 10
         public decimal EvidenceScore { get; set; } // 0 - 10
         public decimal DeliveryScore { get; set; } // 0 - 10
         public decimal PersuasivenessScore { get; set; } // 0 - 10
         public string FeedbackNotes { get; set; }
         public DebateSide WinnerSide { get; set; } // PRO = 1, CON = 2
     }
     ```
3. `POST /api/Competitions/{competitionId}/matches/{matchId}/finalize`:
   * **Mục đích**: Ban tổ chức hoặc Trọng tài trưởng chốt kết quả và công bố đội thắng/thua, cập nhật lên Leaderboard giải đấu.

---

## 4. Yêu cầu triển khai Realtime qua SignalR

### 4.1. Thực trạng
* Hiện tại hệ thống **chưa cài đặt SignalR**.
* Frontend đang sử dụng cơ chế **Smart Polling (chu kỳ 3.5 giây)** gọi `GET /api/Debate/{id}` và `GET /api/Debate/{id}/transcript` để kiểm tra tin nhắn mới và trạng thái chuyển vòng.
* Khi có nhiều người dùng cùng tham gia tranh biện, polling sẽ tạo tải không cần thiết lên DB.

### 4.2. Yêu cầu triển khai SignalR Hub từ Backend:
1. **Tạo Hub**: `DebateHub` tại endpoint `/hubs/debate`
2. **Các Event Server gửi về Client (Server-to-Client)**:
   * `UserJoined(ParticipantDto participant)`: Báo khi có người vào phòng.
   * `TurnStarted(TurnDto nextTurn)`: Thông báo bắt đầu lượt nói mới (ai đến lượt, thời gian còn lại).
   * `ArgumentSubmitted(ArgumentDetailDto argument)`: Bắn ngay lập tức luận điểm vừa nộp tới toàn bộ người trong phòng mà không cần đợi polling.
   * `RoundCompleted(int roundNumber)`: Báo kết thúc vòng hiện tại.
   * `DebateCompleted(DebateResultDto result)`: Báo kết thúc trận đấu.
   * `JudgeScoreUpdated(JudgeScoreEventDto eventData)`: Cập nhật tiến độ chấm điểm của ban giám khảo.
3. **Các Phương thức Client gọi lên (Client-to-Server)**:
   * `JoinDebateRoom(int sessionId)`: Đưa connection vào SignalR Group theo `sessionId`.
   * `LeaveDebateRoom(int sessionId)`: Rời khỏi group khi thoát phòng.
   * `SendTypingStatus(int sessionId, bool isTyping)`: Báo trạng thái đang gõ phím.

---

## 5. Vấn đề Phân quyền (Authorization & Permissions)

| Vai trò | Quyền hạn trong Debate Room | Trạng thái xử lý Frontend hiện tại |
| :--- | :--- | :--- |
| **Tranh biện viên (Debater)** | Được phát biểu **CHỈ KHI** đến đúng lượt của mình. Bị khóa ô input khi chưa đến lượt. | ✅ Đã kiểm soát hoàn toàn trên UI bằng cờ `canSpeak` và `isMyTurn`. |
| **Giám khảo (Judge)** | Không được gửi lập luận tranh biện. Được xem toàn bộ diễn biến và có phiếu chấm điểm rubric riêng tại Sidebar. | ✅ Đã khóa ô input với badge Giám khảo và mở tab Chấm điểm riêng biệt. |
| **Khán giả (Spectator)** | Xem diễn biến theo thời gian thực (Read-only). Không được gửi tin nhắn và không được chấm điểm. | ✅ Đã khóa ô input với thông báo Khán giả. |
| **Quản trị viên (Admin)** | Toàn quyền kiểm soát trận đấu, có thể cưỡng chế kết thúc phiên tranh biện hoặc hủy trận. | Đang chờ Backend bổ sung endpoint `POST /api/Debate/{id}/cancel` có phân quyền Admin. |

---

## 6. Kết luận & Khuyến nghị

1. **Frontend ReactJS** đã được xây dựng theo kiến trúc mô-đun hóa cao cấp, giao diện ChatGPT hiện đại, hỗ trợ linh hoạt cả 4 chế độ: `AI Practice`, `1vs1`, `2vs2`, và `Competition`.
2. **Khi Backend chưa có API 2vs2 và Competition Match**: Frontend giữ nguyên trạng thái trung thực, không dùng mock data, hiển thị thông báo rõ ràng về quyền hạn và trạng thái chờ dữ liệu thực tế.
3. **Đề xuất Sprint Backend tiếp theo**:
   * Ưu tiên 1: Tích hợp SignalR Hub cho `DebateHub` để đạt trải nghiệm thời gian thực tuyệt đối.
   * Ưu tiên 2: Mở rộng `DebateService.cs` cho phép 4 participants trong trận đấu 2vs2.
   * Ưu tiên 3: Xây dựng `CompetitionMatchesController` để quản lý các trận đấu thuộc giải đấu và cho phép Giám khảo nộp điểm số chính thức.
