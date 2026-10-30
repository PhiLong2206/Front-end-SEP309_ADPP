import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Debate1v1 from "../pages/debater/Debate1v1/Debate1v1";
import Debate2v2Lobby from "../pages/debater/Debate2v2/Debate2v2Lobby";
import { debateApi } from "../api";
import topicApi from "../api/topicApi";
import { SystemDebateSide } from "../types";

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    user: { userId: 10, fullName: "Nguyễn Phi Long", role: "Debater" },
  }),
}));

vi.mock("../api/topicApi", () => ({
  default: {
    getAll: vi.fn(),
  },
}));

vi.mock("../api", () => ({
  debateApi: {
    getReceivedChallenges: vi.fn(),
    getSentChallenges: vi.fn(),
    getUserHistory: vi.fn(),
    createP2pSession: vi.fn(),
    create2v2Session: vi.fn(),
    joinP2pSession: vi.fn(),
    join2v2Session: vi.fn(),
    createChallenge: vi.fn(),
    acceptChallenge: vi.fn(),
    declineChallenge: vi.fn(),
    cancelChallenge: vi.fn(),
  },
}));

const mockTopics = [
  {
    topicId: 101,
    title: "Kiểm soát nội dung Trí tuệ nhân tạo",
    description: "Nhà nước cần ban hành khung pháp lý bắt buộc cho các mô hình AI tạo sinh.",
    category: "Công nghệ",
    difficulty: "Hard",
    isActive: true,
    createdAt: "2026-03-01T00:00:00Z",
  },
  {
    topicId: 202,
    title: "Thuế carbon đối với phương tiện cá nhân",
    description: "Áp dụng thuế carbon lũy tiến tại các đô thị trực thuộc trung ương.",
    category: "Môi trường",
    difficulty: "Medium",
    isActive: true,
    createdAt: "2026-03-02T00:00:00Z",
  },
];

describe("P2P Room Creation (1v1 and 2v2) with Backend Topics API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(debateApi.getReceivedChallenges).mockResolvedValue({
      success: true,
      message: "OK",
      data: [],
    });
    vi.mocked(debateApi.getSentChallenges).mockResolvedValue({
      success: true,
      message: "OK",
      data: [],
    });
    vi.mocked(debateApi.getUserHistory).mockResolvedValue({
      success: true,
      message: "OK",
      data: [],
    });
    vi.mocked(topicApi.getAll).mockResolvedValue({
      success: true,
      message: "OK",
      data: {
        items: mockTopics,
        totalCount: 2,
        pageNumber: 1,
        pageSize: 100,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it("1v1 P2P Modal loads active topics from Topics API, blocks creation until selected, and submits topicId + topic payload", async () => {
    vi.mocked(debateApi.createP2pSession).mockResolvedValue({
      success: true,
      message: "Created",
      data: { sessionId: 88 } as never,
    });

    render(
      <MemoryRouter>
        <Debate1v1 />
      </MemoryRouter>
    );

    const openP2pModalBtn = await screen.findByTestId("open-create-p2p-1v1-modal-btn");
    fireEvent.click(openP2pModalBtn);

    await waitFor(() => {
      expect(topicApi.getAll).toHaveBeenCalledWith({
        pageNumber: 1,
        pageSize: 100,
        isActive: true,
      });
    });

    const createBtn = screen.getByTestId("submit-create-p2p-1v1-btn");
    expect(createBtn).toBeDisabled();

    const trigger = await screen.findByTestId("topic-combobox-trigger");
    fireEvent.click(trigger);

    const option101 = await screen.findByTestId("topic-option-101");
    expect(option101).toHaveTextContent("Kiểm soát nội dung Trí tuệ nhân tạo");
    expect(option101).toHaveTextContent("Công nghệ");
    fireEvent.click(option101);

    expect(createBtn).not.toBeDisabled();
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(debateApi.createP2pSession).toHaveBeenCalledWith({
        topicId: 101,
        title: "Kiểm soát nội dung Trí tuệ nhân tạo",
        topic: "Nhà nước cần ban hành khung pháp lý bắt buộc cho các mô hình AI tạo sinh.",
        userSide: SystemDebateSide.PRO,
        turnTimeLimitSeconds: 180,
      });
    });
  });

  it("2v2 Lobby loads active topics from Topics API, supports error/retry, and submits topicId + [2v2] title + topic payload", async () => {
    vi.mocked(topicApi.getAll)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        success: true,
        message: "OK",
        data: {
          items: mockTopics,
          totalCount: 2,
          pageNumber: 1,
          pageSize: 100,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

    vi.mocked(debateApi.create2v2Session).mockResolvedValue({
      success: true,
      message: "Created",
      data: { sessionId: 99 } as never,
    });

    render(
      <MemoryRouter>
        <Debate2v2Lobby />
      </MemoryRouter>
    );

    const submitBtn = screen.getByTestId("create-2v2-submit-btn");
    expect(submitBtn).toBeDisabled();

    const errorBox = await screen.findByTestId("topic-combobox-error");
    expect(errorBox).toHaveTextContent("Network error");

    const retryBtn = screen.getByTestId("topic-combobox-retry");
    fireEvent.click(retryBtn);

    const trigger = await screen.findByTestId("topic-combobox-trigger");
    fireEvent.click(trigger);

    const searchInput = screen.getByTestId("topic-combobox-search");
    fireEvent.change(searchInput, { target: { value: "Thuế carbon" } });

    const option202 = await screen.findByTestId("topic-option-202");
    fireEvent.click(option202);

    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(debateApi.create2v2Session).toHaveBeenCalledWith({
        topicId: 202,
        title: "[2v2] Thuế carbon đối với phương tiện cá nhân",
        topic: "Áp dụng thuế carbon lũy tiến tại các đô thị trực thuộc trung ương.",
        userSide: SystemDebateSide.PRO,
        turnTimeLimitSeconds: 180,
      });
    });
  });
});
