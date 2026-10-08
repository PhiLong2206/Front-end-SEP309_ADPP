import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import Badge from "../../../components/common/Badge";
import {
  Plus, Check, Swords, AlertCircle,
  RefreshCw, Loader2, Send, X, Inbox, ArrowRight
} from "lucide-react";
import { debateApi } from "../../../api";
import {
  ChallengeResponse,
  BackendChallengeStatus,
  SystemDebateSide,
  CreateChallengeRequest,
  DebateHistoryItemDto,
} from "../../../types";

const Debate1v1: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"received" | "sent" | "find" | "history">("received");

  // State for Challenges
  const [receivedChallenges, setReceivedChallenges] = useState<ChallengeResponse[]>([]);
  const [sentChallenges, setSentChallenges] = useState<ChallengeResponse[]>([]);
  const [historyList, setHistoryList] = useState<DebateHistoryItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Create Challenge Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [challengeTopic, setChallengeTopic] = useState<string>("");
  const [challengerSide, setChallengerSide] = useState<number>(SystemDebateSide.PRO);
  const [timeLimit, setTimeLimit] = useState<number>(180);
  const [isSubmittingChallenge, setIsSubmittingChallenge] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [recRes, sentRes, histRes] = await Promise.allSettled([
        debateApi.getReceivedChallenges(),
        debateApi.getSentChallenges(),
        debateApi.getUserHistory(),
      ]);

      if (recRes.status === "fulfilled" && recRes.value?.success && Array.isArray(recRes.value.data)) {
        setReceivedChallenges(recRes.value.data);
      }
      if (sentRes.status === "fulfilled" && sentRes.value?.success && Array.isArray(sentRes.value.data)) {
        setSentChallenges(sentRes.value.data);
      }
      if (histRes.status === "fulfilled" && histRes.value?.success && Array.isArray(histRes.value.data)) {
        setHistoryList(histRes.value.data.filter((h) => h.debateType === 2 || h.debateType === 3));
      }
    } catch (err) {
      console.warn("Failed fetching challenge data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateChallenge = async () => {
    const userIdNum = parseInt(targetUserId, 10);
    if (isNaN(userIdNum) || !challengeTopic.trim()) {
      setFeedbackMsg({ text: "Vui lòng nhập ID người nhận hợp lệ và chủ đề tranh biện.", type: "error" });
      return;
    }

    setIsSubmittingChallenge(true);
    try {
      const payload: CreateChallengeRequest = {
        challengedUserId: userIdNum,
        topic: challengeTopic.trim(),
        challengerPreferredSide: challengerSide,
        turnTimeLimitSeconds: timeLimit,
      };

      const res = await debateApi.createChallenge(payload);
      if (res?.success) {
        setFeedbackMsg({ text: "Đã gửi lời mời thách đấu thành công!", type: "success" });
        setShowCreateModal(false);
        setChallengeTopic("");
        setTargetUserId("");
        setActiveTab("sent");
        fetchAllData();
      } else {
        setFeedbackMsg({ text: res?.message || "Không thể tạo lời mời thách đấu.", type: "error" });
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setFeedbackMsg({ text: e.message || "Lỗi khi gửi lời mời thách đấu.", type: "error" });
    } finally {
      setIsSubmittingChallenge(false);
    }
  };

  const handleAcceptChallenge = async (challengeId: number) => {
    setActionLoadingId(challengeId);
    try {
      const res = await debateApi.acceptChallenge(challengeId);
      if (res?.success) {
        setFeedbackMsg({ text: "Đã chấp nhận thách đấu! Chuyển tới phiên tranh biện...", type: "success" });
        if (res.data?.debateSessionId) {
          navigate(`/learner/debate/${res.data.debateSessionId}`);
        } else {
          fetchAllData();
        }
      } else {
        setFeedbackMsg({ text: res?.message || "Không thể chấp nhận thách đấu.", type: "error" });
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setFeedbackMsg({ text: e.message || "Lỗi khi chấp nhận thách đấu.", type: "error" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectChallenge = async (challengeId: number) => {
    setActionLoadingId(challengeId);
    try {
      const res = await debateApi.rejectChallenge(challengeId);
      if (res?.success) {
        setFeedbackMsg({ text: "Đã từ chối lời mời thách đấu.", type: "success" });
        fetchAllData();
      } else {
        setFeedbackMsg({ text: res?.message || "Không thể từ chối thách đấu.", type: "error" });
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setFeedbackMsg({ text: e.message || "Lỗi khi từ chối thách đấu.", type: "error" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelChallenge = async (challengeId: number) => {
    setActionLoadingId(challengeId);
    try {
      const res = await debateApi.cancelChallenge(challengeId);
      if (res?.success) {
        setFeedbackMsg({ text: "Đã hủy lời mời thách đấu thành công.", type: "success" });
        fetchAllData();
      } else {
        setFeedbackMsg({ text: res?.message || "Không thể hủy lời mời.", type: "error" });
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setFeedbackMsg({ text: e.message || "Lỗi khi hủy lời mời.", type: "error" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const getChallengeStatusBadge = (status: BackendChallengeStatus | number) => {
    switch (status) {
      case 1:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Đang chờ phản hồi</span>;
      case 2:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Đã chấp nhận</span>;
      case 3:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Đã từ chối</span>;
      case 4:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">Đã hủy</span>;
      case 5:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">Hết hạn</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">Khác</span>;
    }
  };

  const pendingReceivedCount = receivedChallenges.filter((c) => c.status === 1).length;

  const TABS = [
    { id: "received" as const, label: `Lời mời nhận được ${pendingReceivedCount > 0 ? `(${pendingReceivedCount})` : ""}` },
    { id: "sent" as const, label: `Thách đấu đã gửi (${sentChallenges.length})` },
    { id: "find" as const, label: "Tạo thách đấu mới" },
    { id: "history" as const, label: `Lịch sử đối kháng (${historyList.length})` },
  ];

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Tranh biện 1 vs 1</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Thách đấu trực tiếp và quản lý lời mời tranh biện với người học khác.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchAllData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#008A64] hover:bg-[#007457] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Gửi lời thách đấu</span>
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {feedbackMsg && (
        <div className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-2.5 border ${
          feedbackMsg.type === "success"
            ? "bg-[#ECFDF5] border-[#008A64]/30 text-emerald-800"
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? <Check size={16} className="text-[#008A64]" /> : <AlertCircle size={16} className="text-rose-600" />}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? "border-[#008A64] text-[#008A64]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Lời mời nhận được ── */}
      {activeTab === "received" && (
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 shadow-xs">
              <Loader2 size={32} className="mx-auto mb-2 text-[#008A64] animate-spin" />
              <p className="text-sm font-semibold">Đang tải lời mời thách đấu...</p>
            </div>
          ) : receivedChallenges.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 shadow-xs space-y-2">
              <Inbox size={32} className="mx-auto text-slate-300" />
              <p className="text-sm font-semibold">Hiện chưa có lời mời thách đấu nào gửi tới bạn.</p>
              <p className="text-xs text-slate-400">Bạn có thể chủ động tạo lời thách đấu gửi tới người học khác!</p>
            </div>
          ) : (
            <div className="grid gap-3.5">
              {receivedChallenges.map((challenge) => {
                const isActionLoading = actionLoadingId === challenge.challengeId;
                const isPending = challenge.status === 1;
                return (
                  <div key={challenge.challengeId} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{challenge.challenger?.fullName || "Người dùng"}</span>
                        <span className="text-xs text-slate-400">({challenge.challenger?.email})</span>
                        {getChallengeStatusBadge(challenge.status)}
                      </div>
                      <p className="text-sm font-medium text-slate-800">&ldquo;{challenge.topic}&rdquo;</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span>Phe đối thủ: <strong>{challenge.challengerPreferredSide === 1 ? "Ủng hộ (PRO)" : "Phản đối (CON)"}</strong></span>
                        <span>Thời gian lượt: <strong>{challenge.turnTimeLimitSeconds}s</strong></span>
                        <span>Gửi lúc: {new Date(challenge.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {isPending ? (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={isActionLoading}
                            onClick={() => handleRejectChallenge(challenge.challengeId)}
                            className="text-xs"
                          >
                            Từ chối
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isActionLoading}
                            onClick={() => handleAcceptChallenge(challenge.challengeId)}
                            className="text-xs"
                          >
                            {isActionLoading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                            Chấp nhận
                          </Button>
                        </>
                      ) : challenge.debateSessionId ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/learner/debate/${challenge.debateSessionId}`)}
                          className="text-xs"
                        >
                          Vào phòng đấu <ArrowRight size={13} />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab 2: Thách đấu đã gửi ── */}
      {activeTab === "sent" && (
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 shadow-xs">
              <Loader2 size={32} className="mx-auto mb-2 text-[#008A64] animate-spin" />
              <p className="text-sm font-semibold">Đang tải thách đấu đã gửi...</p>
            </div>
          ) : sentChallenges.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 shadow-xs space-y-2">
              <Send size={32} className="mx-auto text-slate-300" />
              <p className="text-sm font-semibold">Bạn chưa gửi lời mời thách đấu nào.</p>
              <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)} className="mt-2">
                Tạo lời thách đấu ngay
              </Button>
            </div>
          ) : (
            <div className="grid gap-3.5">
              {sentChallenges.map((challenge) => {
                const isActionLoading = actionLoadingId === challenge.challengeId;
                const isPending = challenge.status === 1;
                return (
                  <div key={challenge.challengeId} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">Gửi tới: {challenge.challenged?.fullName || `User #${challenge.challenged?.userId}`}</span>
                        <span className="text-xs text-slate-400">({challenge.challenged?.email})</span>
                        {getChallengeStatusBadge(challenge.status)}
                      </div>
                      <p className="text-sm font-medium text-slate-800">&ldquo;{challenge.topic}&rdquo;</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span>Phe của bạn: <strong>{challenge.challengerPreferredSide === 1 ? "Ủng hộ (PRO)" : "Phản đối (CON)"}</strong></span>
                        <span>Giới hạn lượt: <strong>{challenge.turnTimeLimitSeconds}s</strong></span>
                        <span>Thời gian: {new Date(challenge.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {isPending ? (
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleCancelChallenge(challenge.challengeId)}
                          className="px-3.5 py-1.5 border border-slate-200 text-rose-600 hover:border-rose-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          {isActionLoading ? "Đang hủy..." : "Hủy lời mời"}
                        </button>
                      ) : challenge.debateSessionId ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/learner/debate/${challenge.debateSessionId}`)}
                          className="text-xs"
                        >
                          Vào phòng đấu <ArrowRight size={13} />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab 3: Tạo thách đấu mới ── */}
      {activeTab === "find" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Thiết lập lời mời thách đấu 1 vs 1</h2>
            <p className="text-xs text-slate-500 mt-1">Nhập ID người dùng bạn muốn thách đấu trực tiếp trên hệ thống.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">ID Người nhận thách đấu (User ID) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                placeholder="Ví dụ: 4 (hoặc ID của bạn bè)"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64]"
              />
              <p className="text-[11px] text-slate-400 mt-1">Gợi ý: Tài khoản test 2 có User ID là 4 (longnpse180044@fpt.edu.vn).</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Chủ đề tranh biện <span className="text-rose-500">*</span></label>
              <textarea
                rows={3}
                placeholder="Ví dụ: AI có nên thay thế con người trong các quyết định tư pháp?"
                value={challengeTopic}
                onChange={(e) => setChallengeTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Phe của bạn</label>
                <select
                  value={challengerSide}
                  onChange={(e) => setChallengerSide(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64]"
                >
                  <option value={SystemDebateSide.PRO}>Ủng hộ (PRO)</option>
                  <option value={SystemDebateSide.CON}>Phản đối (CON)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Thời gian mỗi lượt</label>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64]"
                >
                  <option value={120}>2 phút (120 giây)</option>
                  <option value={180}>3 phút (180 giây)</option>
                  <option value={240}>4 phút (240 giây)</option>
                  <option value={300}>5 phút (300 giây)</option>
                </select>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              disabled={isSubmittingChallenge || !targetUserId || !challengeTopic.trim()}
              onClick={handleCreateChallenge}
              className="w-full mt-2"
            >
              {isSubmittingChallenge ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span>Gửi lời mời thách đấu</span>
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 4: Lịch sử đối kháng ── */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {historyList.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 shadow-xs">
              <Swords size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold">Chưa có trận đấu đối kháng P2P/1v1 nào hoàn thành.</p>
              <p className="text-xs text-slate-400 mt-1">Hãy gửi thách đấu hoặc chấp nhận lời mời để bắt đầu thi đấu.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Mã / Chủ đề</th>
                    <th className="px-5 py-3.5">Hình thức</th>
                    <th className="px-5 py-3.5">Phe</th>
                    <th className="px-5 py-3.5">Ngày đấu</th>
                    <th className="px-5 py-3.5 text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyList.map((item) => (
                    <tr key={item.sessionId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 max-w-sm">
                        <div className="font-bold text-slate-900">{item.title || item.topic}</div>
                        <div className="text-slate-400 text-[11px]">#{item.sessionId}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-700">
                        {item.debateType === 2 ? "P2P Trực tiếp" : "Thách đấu 1v1"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Badge variant={item.userSide === 1 ? "primary" : "secondary"}>
                          {item.userSide === 1 ? "Ủng hộ (PRO)" : "Phản đối (CON)"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/learner/debate/${item.sessionId}`)}
                          className="text-xs"
                        >
                          Vào phòng
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Quick Create Challenge */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Gửi thách đấu 1 vs 1"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>Hủy</Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isSubmittingChallenge || !targetUserId || !challengeTopic.trim()}
              onClick={handleCreateChallenge}
            >
              {isSubmittingChallenge ? "Đang gửi..." : "Gửi lời mời"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="ID Người được thách đấu (User ID)"
            name="targetUserId"
            type="number"
            placeholder="Ví dụ: 4 (tk longnpse180044@fpt.edu.vn)"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            required
          />
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Chủ đề tranh biện *</label>
            <textarea
              rows={3}
              placeholder="Nhập kiến nghị / chủ đề muốn tranh biện..."
              value={challengeTopic}
              onChange={(e) => setChallengeTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Phe của bạn</label>
              <select
                value={challengerSide}
                onChange={(e) => setChallengerSide(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64]"
              >
                <option value={SystemDebateSide.PRO}>Ủng hộ (PRO)</option>
                <option value={SystemDebateSide.CON}>Phản đối (CON)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Thời gian mỗi lượt</label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64]"
              >
                <option value={120}>2 phút (120s)</option>
                <option value={180}>3 phút (180s)</option>
                <option value={240}>4 phút (240s)</option>
                <option value={300}>5 phút (300s)</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Debate1v1;

