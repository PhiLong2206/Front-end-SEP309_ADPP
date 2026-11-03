# Việc tồn đọng

## Phòng tranh biện

- [ ] **Vào lại `session-comp-N` vẫn thấy trận đã xong.** State của phòng chỉ bị xoá khi xác nhận rời lúc trận còn dở. Trận đã xong thì không có hộp xác nhận, nên `adpp_debate_completed_` và các key khác còn lại trong `sessionStorage` của tab đó. Id phòng cố định theo giải đấu, và phòng giải đấu chưa có phiên Backend thật.

## Trang Tiến độ (`pages/debater/Progress/Progress.tsx`)

- [ ] **"Điểm trung bình" chưa có dữ liệu thật.** `avgScore` đang gán cứng `0` nên luôn hiện `--`. Chưa có API trả điểm: kết quả chấm hiện không được lưu ở Backend.
- [ ] **"Kỹ năng nổi bật" chưa có dữ liệu thật.** Đang là chữ cố định "Đang phân tích".
