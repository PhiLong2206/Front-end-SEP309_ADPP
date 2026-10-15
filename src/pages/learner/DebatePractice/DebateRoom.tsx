import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Mic,
  Send,
  Lightbulb,
  User as UserIcon,
  Bot,
  AlertCircle,
  Award,
  BookOpen,
  Sparkles,
  Shield,
  Flame,
  Swords,
  RefreshCw,
  Copy,
  Check,
  X,
  Loader2,
} from "lucide-react";
import DebateStepper from "../../../components/debate/DebateStepper";
import RebuttalSuggestion from "../../../components/debate/RebuttalSuggestion";
import AICoachingPanel, { CoachingAdvice } from "../../../components/debate/AICoachingPanel";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { aiApi, debateApi } from "../../../api";
import { useAuth } from "../../../hooks/useAuth";
import {
  CaseFileResponse,
  ArgumentEvaluationResult,
  BackendDebateSide,
  BackendDifficulty,
  DebateRoundType,
  RoundEvaluationResult,
  ArgumentTurn,
  TurnSpeaker,
  SessionEvaluationResult,
  DebateSessionResponse,
  SideSwapRequestResponse,
} from "../../../types";

export interface DebateRoomMessage {
  id: string;
  speaker: "Learner" | "AI";
  speakerName: string;
  side: "Ủng hộ" | "Phản đối";
  stage: "Mở đầu" | "Phản biện" | "Kết luận";
  roundNumber: number;
  timestamp: string;
  content: string;
}

const getFallbackAiSpeech = (round: number, aiSideStr: string, motion: string) => {
  if (round === 1) {
    return aiSideStr === "Ủng hộ"
      ? `Chào bạn, đối với kiến nghị "${motion}", phe chúng tôi khẳng định sự ủng hộ mạnh mẽ. Thứ nhất, việc triển khai chính sách này mang lại giải pháp căn cơ, thúc đẩy tiến bộ xã hội và giải quyết triệt để các hạn chế hiện hữu. Thứ hai, các nghiên cứu và kinh nghiệm thực tiễn đều chứng minh lợi ích dài hạn vượt trội hơn nhiều so với chi phí ban đầu.`
      : `Chào bạn, đối với kiến nghị "${motion}", phe phản đối chúng tôi cho rằng đây là một đề xuất chưa khả thi và tiềm ẩn rủi ro lớn. Thứ nhất, gánh nặng tài chính và áp lực hạ tầng là quá lớn. Thứ hai, chúng ta còn rất nhiều giải pháp thay thế an toàn, hiệu quả hơn chưa được khai thác. Do đó, chúng tôi phản đối kiến nghị này.`;
  } else if (round === 2) {
    return `Tôi ghi nhận những điểm bạn vừa trình bày, tuy nhiên lập luận đó chưa đủ tính thuyết phục. Thứ nhất, bạn chưa giải quyết được bài toán về tính khả thi và tác động thực tế đối với các bên liên quan. Thứ hai, việc quá nhấn mạnh vào lợi ích trước mắt mà bỏ qua rủi ro hệ thống sẽ gây ra những hệ quả khó lường. Phe chúng tôi kiên định giữ vững lập trường phản bác.`;
  } else {
    return `Tổng kết lại phiên tranh biện về kiến nghị "${motion}", điểm then chốt nằm ở việc cân bằng giữa lợi ích phát triển và mức độ kiểm soát rủi ro. Phe chúng tôi đã chứng minh tính nhất quán xuyên suốt 3 vòng rằng góc nhìn của chúng tôi mang lại giải pháp bền vững nhất. Cảm ơn bạn vì một lượt tranh biện rất kịch tính!`;
  }
};

const getFallbackEvaluation = (text: string, round: number, motion: string): ArgumentEvaluationResult => {
  const wordCount = text.trim().split(/\s+/).length;
  const isTooShort = wordCount < 5;
  const score = isTooShort ? 5.5 : Math.min(8.8, 7.2 + (wordCount > 15 ? 1.0 : 0.4));

  return {
    overall_score: score,
    overall_reasoning: isTooShort
      ? `Bài phát biểu còn quá ngắn (${wordCount} từ). Cần diễn giải luận điểm chi tiết hơn xoay quanh kiến nghị "${motion}".`
      : `Lập luận vòng ${round} thể hiện rõ quan điểm cá nhân, cấu trúc phản biện tương đối tốt. Cần bổ sung thêm dẫn chứng số liệu để tăng tính thuyết phục.`,
    criteria: [
      { name: "Logic & Cấu trúc", score: isTooShort ? 5.0 : 8.0, reasoning: isTooShort ? "Chưa đủ nội dung để đánh giá logic." : "Luận điểm rõ ràng, các ý liên kết mạch lạc." },
      { name: "Dẫn chứng thực tiễn", score: isTooShort ? 4.5 : 7.0, reasoning: "Cần dẫn chứng số liệu hoặc tiền lệ thực tế cụ thể hơn." },
      { name: "Kỹ năng phản biện", score: isTooShort ? 5.5 : 8.2, reasoning: "Nhận diện đúng trọng tâm luận đề tranh luận." },
    ],
    strengths: isTooShort ? ["Có nỗ lực tham gia lượt nói."] : ["Xác định đúng trọng tâm kiến nghị.", "Ngôn ngữ diễn đạt tự nhiên, tự tin."],
    weaknesses: isTooShort ? ["Nội dung quá ngắn, thiếu luận cứ."] : ["Chưa trích dẫn nguồn số liệu cụ thể.", "Cần phân tích sâu hơn về hệ quả lâu dài."],
    suggestions: [
      "Áp dụng cấu trúc PEEL (Point - Luận điểm, Explanation - Giải thích, Evidence - Bằng chứng, Link - Liên kết).",
      "Dự đoán trước phản biện của đối phương để chủ động rào đón.",
    ],
  };
};

const DebateRoom: React.FC = () => {
  const { sessionId = "demo-session" } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roleParam = searchParams.get("role") || "PRO";
  const difficultyParam = searchParams.get("difficulty") || "Trung bình";
  const motionParam = searchParams.get("motion") || "Mạng xã hội có gây hại nhiều hơn lợi ích?";
  const [motionText, setMotionText] = useState(motionParam);

  const learnerSide: BackendDebateSide = roleParam === "PRO" ? "pro" : "con";
  const aiSide: BackendDebateSide = roleParam === "PRO" ? "con" : "pro";
  const difficulty: BackendDifficulty =
    difficultyParam === "Khó" ? "hard" : difficultyParam === "Dễ" ? "easy" : "medium";

  const [currentRound, setCurrentRound] = useState(1);
  const [messages, setMessages] = useState<DebateRoomMessage[]>([]);
  const [argumentText, setArgumentText] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(135); // 02:15
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Microservice states
  const [aiOpponentStatus, setAiOpponentStatus] = useState<string>("init");
  const [opponentError, setOpponentError] = useState<string | null>(null);
  const [evaluatorError, setEvaluatorError] = useState<string | null>(null);
  const [casePlan, setCasePlan] = useState<CaseFileResponse | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<ArgumentEvaluationResult | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<"evaluation" | "caseplan" | "coaching">("evaluation");
  const [isAiOfflineMode, setIsAiOfflineMode] = useState<boolean>(false);

  // Auth & Backend Session Details State
  const { user } = useAuth();
  const currentUserId = user?.userId || (user?.id ? parseInt(String(user.id), 10) : 0);

  const [sessionDetails, setSessionDetails] = useState<DebateSessionResponse | null>(null);
  const [pendingSwapRequests, setPendingSwapRequests] = useState<SideSwapRequestResponse[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [roomFeedback, setRoomFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const numSessionId = parseInt(sessionId, 10);
  const isBackendSession = !isNaN(numSessionId) && numSessionId > 0;
  const isAiSession = Boolean(sessionDetails?.participants.some((p) => p.isAI));
  const isP2pOr2v2 = Boolean(
    sessionDetails &&
    (!isAiSession || sessionDetails.debateType === 2 || sessionDetails.debateType === 3)
  );
  const is2v2 = Boolean(
    sessionDetails &&
    (sessionDetails.participants.length > 2 ||
      (sessionDetails.title && (sessionDetails.title.toLowerCase().includes("2 vs 2") || sessionDetails.title.toLowerCase().includes("2v2"))))
  );
  const isHost = Boolean(sessionDetails && sessionDetails.createdByUserId === currentUserId);
  const proParticipants = sessionDetails?.participants.filter((p) => p.side === 1 || String(p.side) === "PRO") || [];
  const conParticipants = sessionDetails?.participants.filter((p) => p.side === 2 || String(p.side) === "CON") || [];
  const canHostStart = Boolean(
    sessionDetails &&
    (is2v2
      ? proParticipants.length >= 2 && conParticipants.length >= 2
      : proParticipants.length >= 1 && conParticipants.length >= 1)
  );

  const myParticipant = sessionDetails?.participants.find((p) => p.userId === currentUserId);
  const mySide = myParticipant?.side;
  const isMyTurn = !isP2pOr2v2 || !sessionDetails ? true : (
    (sessionDetails.currentTurnSide === mySide) ||
    (String(sessionDetails.currentTurnSide) === "PRO" && (mySide === 1 || String(mySide) === "PRO")) ||
    (String(sessionDetails.currentTurnSide) === "CON" && (mySide === 2 || String(mySide) === "CON"))
  );

  // Countdown timer simulation (02:15) - active only during debate progress
  useEffect(() => {
    if (isBackendSession && sessionDetails?.status === 1) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isBackendSession, sessionDetails?.status]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const loadBackendSession = useCallback(async (numId: number) => {
    try {
      const res = await debateApi.getSessionDetails(numId);
      if (res?.success && res.data) {
        setSessionDetails(res.data);
        if (res.data.topic || res.data.title) {
          setMotionText(res.data.topic || res.data.title);
        }
      }
    } catch (e) {
      console.warn("Error fetching session details:", e);
    }
  }, []);

  const loadBackendTranscript = useCallback(async (numId: number) => {
    try {
      const res = await debateApi.getTranscript(numId);
      if (res?.success && res.data?.arguments && res.data.arguments.length > 0) {
        const loadedMsgs: DebateRoomMessage[] = res.data.arguments.map((arg) => ({
          id: `arg-${arg.argumentId}`,
          speaker: arg.isAI ? "AI" : "Learner",
          speakerName: arg.speakerName || (arg.isAI ? "Đối thủ AI" : "Bạn"),
          side: (arg.side === 1 || String(arg.side) === "PRO") ? "Ủng hộ" : "Phản đối",
          stage: (arg.stage === 1 || String(arg.stage) === "Opening")
            ? "Mở đầu"
            : (arg.stage === 2 || String(arg.stage) === "Rebuttal")
            ? "Phản biện"
            : "Kết luận",
          roundNumber: Math.ceil(arg.turnOrder / 2) || 1,
          timestamp: arg.submittedAt ? new Date(arg.submittedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "",
          content: arg.content,
        }));
        setMessages(loadedMsgs);
      }
    } catch (e) {
      console.warn("Error fetching transcript:", e);
    }
  }, []);

  // Polling for backend sessions
  useEffect(() => {
    if (!isBackendSession) return;

    loadBackendSession(numSessionId);
    loadBackendTranscript(numSessionId);

    const interval = setInterval(() => {
      loadBackendSession(numSessionId);
      if (sessionDetails?.status === 1) {
        debateApi.getPendingSwapRequests(numSessionId).then((res) => {
          if (res?.success && Array.isArray(res.data)) {
            setPendingSwapRequests(res.data);
          }
        }).catch(() => {});
      } else if (sessionDetails?.status === 2) {
        loadBackendTranscript(numSessionId);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isBackendSession, numSessionId, sessionDetails?.status, loadBackendSession, loadBackendTranscript]);

  // Initialize session with AI Opponent Service on mount (only for AI mode when debate is active)
  useEffect(() => {
    if (isP2pOr2v2) return; // Do not call Python AI Opponent if human vs human
    if (isBackendSession && sessionDetails?.status === 1) return; // Wait until host starts debate session

    let isMounted = true;
    const initOpponent = async () => {
      try {
        setOpponentError(null);
        setAiOpponentStatus("planning");
        const res = await aiApi.createOpponentSession({
          external_session_id: sessionId,
          motion: motionParam,
          learner_side: learnerSide,
          ai_side: aiSide,
          difficulty,
          language: "vi",
        });
        if (isMounted) {
          setAiOpponentStatus(res.status || "ready");
        }

        // Fetch Case Plan from AI service
        try {
          const plan = await aiApi.getOpponentCasePlan(sessionId);
          if (isMounted && plan) {
            setCasePlan(plan);
          }
        } catch {
          // Case plan might still be generating
        }

        if (aiSide === "pro" && isMounted) {
          setIsAiGenerating(true);
          try {
            const firstTurnRes = await aiApi.generateOpponentTurn(sessionId, {
              turn_index: 1,
              new_learner_speeches: [],
            });

            if (isMounted && firstTurnRes?.speech_text) {
              const aiFirstMsg: DebateRoomMessage = {
                id: `msg-${Date.now()}`,
                speaker: "AI",
                speakerName: "Đối thủ AI",
                side: "Ủng hộ",
                stage: "Mở đầu",
                roundNumber: 1,
                timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                content: firstTurnRes.speech_text,
              };
              setMessages((prev) => (prev.length === 0 ? [aiFirstMsg] : prev));
            }
          } catch {
            const fallbackSpeech = getFallbackAiSpeech(1, "Ủng hộ", motionText);
            const aiFirstMsg: DebateRoomMessage = {
              id: `msg-${Date.now()}`,
              speaker: "AI",
              speakerName: "Đối thủ AI",
              side: "Ủng hộ",
              stage: "Mở đầu",
              roundNumber: 1,
              timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
              content: fallbackSpeech,
            };
            if (isMounted) {
              setMessages((prev) => (prev.length === 0 ? [aiFirstMsg] : prev));
              setIsAiOfflineMode(true);
            }
          } finally {
            if (isMounted) setIsAiGenerating(false);
          }
        }
      } catch {
        if (isMounted) {
          setAiOpponentStatus("ready (mô phỏng)");
          setIsAiOfflineMode(true);
          setCasePlan({
            id: `case-${sessionId}`,
            session_id: sessionId,
            prompt_version: "v5",
            llm_provider: "local-simulation",
            llm_model: "fallback",
            temperature: 0.7,
            created_at: new Date().toISOString(),
            content: {
              case_summary: `Chiến lược tranh biện cho phe ${aiSide === "pro" ? "Ủng hộ" : "Phản đối"} kiến nghị: "${motionText}".`,
              main_points: [
                { title: "Luận điểm trọng tâm", description: "Tập trung vào tính khả thi, hiệu quả thực tế và bảo đảm an toàn hệ thống." },
                { title: "Luận điểm bổ trợ", description: "Củng cố bằng các bài học kinh nghiệm quốc tế và mục tiêu phát triển bền vững." },
              ],
              predicted_learner_arguments: [
                { point: "Quan ngại về chi phí và tính rủi ro", planned_rebuttal: "Chứng minh rằng việc chủ động triển khai với quy chuẩn kiểm soát nghiêm ngặt sẽ mang lại giá trị cao hơn nhiều." },
              ],
            } as any,
          });

          if (aiSide === "pro") {
            const fallbackSpeech = getFallbackAiSpeech(1, "Ủng hộ", motionText);
            const aiFirstMsg: DebateRoomMessage = {
              id: `msg-${Date.now()}`,
              speaker: "AI",
              speakerName: "Đối thủ AI",
              side: "Ủng hộ",
              stage: "Mở đầu",
              roundNumber: 1,
              timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
              content: fallbackSpeech,
            };
            setMessages((prev) => (prev.length === 0 ? [aiFirstMsg] : prev));
          }
        }
      }
    };

    initOpponent();
    return () => {
      isMounted = false;
    };
  }, [sessionId, motionParam, learnerSide, aiSide, difficulty, isP2pOr2v2]);

  const handleStartDebateSession = async () => {
    if (!isBackendSession) return;
    setIsStarting(true);
    setRoomFeedback(null);
    try {
      const res = await debateApi.startDebateSession(numSessionId);
      if (res?.success && res.data) {
        setSessionDetails(res.data);
        setRoomFeedback({ text: "Trận đấu đã chính thức bắt đầu!", type: "success" });
      } else {
        setRoomFeedback({ text: res?.message || "Chưa thể bắt đầu (yêu cầu đủ người tham gia).", type: "error" });
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setRoomFeedback({ text: e.message || "Lỗi khi bắt đầu trận đấu.", type: "error" });
    } finally {
      setIsStarting(false);
    }
  };

  const handleSwitchSide = async () => {
    if (!isBackendSession) return;
    try {
      const res = await debateApi.switchSide(numSessionId);
      if (res?.success && res.data) {
        setSessionDetails(res.data);
        setRoomFeedback({ text: "Đã đổi phe thành công!", type: "success" });
      } else {
        setRoomFeedback({ text: res?.message || "Không thể đổi phe (phe đối diện đã đủ người).", type: "error" });
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setRoomFeedback({ text: e.message || "Lỗi khi đổi phe.", type: "error" });
    }
  };

  const handleSendSwapRequest = async (targetUserId: number) => {
    if (!isBackendSession || !targetUserId) return;
    try {
      const res = await debateApi.sendSwapRequest(numSessionId, { targetUserId });
      if (res?.success) {
        setRoomFeedback({ text: "Đã gửi lời mời tráo phe! Đang chờ phản hồi (60s)...", type: "success" });
      } else {
        setRoomFeedback({ text: res?.message || "Không thể gửi yêu cầu tráo phe.", type: "error" });
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setRoomFeedback({ text: e.message || "Lỗi khi gửi yêu cầu tráo phe.", type: "error" });
    }
  };

  const handleRespondSwapRequest = async (requesterUserId: number, accept: boolean) => {
    if (!isBackendSession) return;
    try {
      const res = await debateApi.respondSwapRequest(numSessionId, { requesterUserId, accept });
      if (res?.success && res.data) {
        setSessionDetails(res.data);
        setPendingSwapRequests((prev) => prev.filter((r) => r.requesterUserId !== requesterUserId));
        setRoomFeedback({
          text: accept ? "Đã đổi phe thành công!" : "Đã từ chối lời mời đổi phe.",
          type: accept ? "success" : "error",
        });
      } else {
        setRoomFeedback({ text: res?.message || "Không thể xử lý yêu cầu đổi phe.", type: "error" });
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setRoomFeedback({ text: e.message || "Lỗi phản hồi yêu cầu đổi phe.", type: "error" });
    }
  };

  const handleSendArgument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!argumentText.trim() || isAiGenerating) return;

    if (isP2pOr2v2 && !isMyTurn) {
      setRoomFeedback({ text: "Chưa tới lượt phát biểu của bạn hoặc phe của bạn!", type: "error" });
      return;
    }

    const currentText = argumentText.trim();
    const stage: DebateRoundType = currentRound === 1 ? "opening" : currentRound === 2 ? "rebuttal" : "closing";

    // Precise turn indexing according to match_format (6 turns total)
    const learnerTurnIndex =
      learnerSide === "pro"
        ? currentRound === 1
          ? 1
          : currentRound === 2
          ? 3
          : 5
        : currentRound === 1
        ? 2
        : currentRound === 2
        ? 4
        : 6;

    const aiTurnIndex = learnerTurnIndex + 1; // 2, 4, 6 for pro; 3, 5 for con

    const newLearnerMsg: DebateRoomMessage = {
      id: `msg-${Date.now()}`,
      speaker: "Learner",
      speakerName: "Bạn",
      side: learnerSide === "pro" ? "Ủng hộ" : "Phản đối",
      stage: currentRound === 1 ? "Mở đầu" : currentRound === 2 ? "Phản biện" : "Kết luận",
      roundNumber: currentRound,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      content: currentText,
    };

    setMessages((prev) => [...prev, newLearnerMsg]);
    setArgumentText("");
    // Persist argument to Backend .NET DebateController
    const numSessionId = parseInt(sessionId, 10);
    if (!isNaN(numSessionId) && numSessionId > 0) {
      if (isP2pOr2v2) {
        setIsEvaluating(false);
        setIsAiGenerating(false);
        try {
          const res = await debateApi.submitArgument(numSessionId, { content: currentText });
          if (res?.success && res.data) {
            setSessionDetails(res.data);
            setRoomFeedback({ text: "Nộp bài tranh biện thành công!", type: "success" });
          } else {
            setRoomFeedback({ text: res?.message || "Lỗi khi nộp bài tranh biện.", type: "error" });
          }
          await loadBackendTranscript(numSessionId);
        } catch (err: unknown) {
          const e = err as { message?: string };
          setRoomFeedback({ text: e.message || "Lỗi khi nộp bài tranh biện.", type: "error" });
        }
        return;
      }

      debateApi.submitArgument(numSessionId, { content: currentText }).catch((err) => {
        console.warn("Backend submitArgument warning:", err);
      });
    }

    setIsAiGenerating(true);
    setIsEvaluating(true);
    setOpponentError(null);
    setEvaluatorError(null);

    // 1. Call AI Evaluator Microservice (POST /evaluate)
    const opponentRecentSpeech = messages
      .filter((m) => m.speaker === "AI")
      .slice(-1)[0]?.content || null;

    aiApi
      .evaluateSpeechArgument({
        motion: motionParam,
        side: learnerSide,
        stage,
        argument_text: currentText,
        opponent_argument_text: opponentRecentSpeech,
      })
      .then((res) => {
        setEvaluationResult(res);
        setRightPanelTab("evaluation");
      })
      .catch(() => {
        const fallbackEval = getFallbackEvaluation(currentText, currentRound, motionText);
        setEvaluationResult(fallbackEval);
        setRightPanelTab("evaluation");
        setIsAiOfflineMode(true);
      })
      .finally(() => {
        setIsEvaluating(false);
      });

    // 2. Call AI Opponent Microservice (POST /opponent/sessions/{id}/turns)
    // If learner is CON and at Round 3 (Turn 6), Learner concludes debate - no further AI turn
    if (learnerSide === "con" && currentRound === 3) {
      setIsAiGenerating(false);
      return;
    }

    try {
      const turnRes = await aiApi.generateOpponentTurn(sessionId, {
        turn_index: aiTurnIndex,
        new_learner_speeches: [
          {
            turn_index: learnerTurnIndex,
            round_type: stage,
            text: currentText,
          },
        ],
      });

      const aiResponseMsg: DebateRoomMessage = {
        id: `msg-${Date.now() + 1}`,
        speaker: "AI",
        speakerName: "Đối thủ AI",
        side: aiSide === "pro" ? "Ủng hộ" : "Phản đối",
        stage: currentRound === 1 ? "Mở đầu" : currentRound === 2 ? "Phản biện" : "Kết luận",
        roundNumber: currentRound,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        content: turnRes.speech_text,
      };
      setMessages((prev) => [...prev, aiResponseMsg]);

      if (currentRound < 3) {
        setCurrentRound((prev) => prev + 1);
        setSecondsRemaining(120);
      }
    } catch {
      setIsAiOfflineMode(true);
      const fallbackSpeech = getFallbackAiSpeech(currentRound, aiSide === "pro" ? "Ủng hộ" : "Phản đối", motionText);
      const aiResponseMsg: DebateRoomMessage = {
        id: `msg-${Date.now() + 1}`,
        speaker: "AI",
        speakerName: "Đối thủ AI",
        side: aiSide === "pro" ? "Ủng hộ" : "Phản đối",
        stage: currentRound === 1 ? "Mở đầu" : currentRound === 2 ? "Phản biện" : "Kết luận",
        roundNumber: currentRound,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        content: fallbackSpeech,
      };
      setMessages((prev) => [...prev, aiResponseMsg]);

      if (currentRound < 3) {
        setCurrentRound((prev) => prev + 1);
        setSecondsRemaining(120);
      }
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Convert evaluation suggestions to coaching advice if available
  const coachingAdvice: CoachingAdvice[] = evaluationResult
    ? [
        ...(evaluationResult.weaknesses?.map((w) => ({
          type: "weakness" as const,
          label: "Điểm yếu cần khắc phục",
          content: w,
        })) || []),
        ...(evaluationResult.suggestions?.map((s) => ({
          type: "strategy" as const,
          label: "Gợi ý chiến lược tiếp theo",
          content: s,
        })) || []),
      ]
    : [];

  const handleRequestEvaluation = useCallback(() => {
    // Re-evaluating latest learner argument
    const latestLearnerMsg = messages.filter((m) => m.speaker === "Learner").slice(-1)[0];
    if (!latestLearnerMsg) return;
    setIsEvaluating(true);
    setEvaluatorError(null);
    aiApi
      .evaluateSpeechArgument({
        motion: motionParam,
        side: learnerSide,
        stage: currentRound === 1 ? "opening" : currentRound === 2 ? "rebuttal" : "closing",
        argument_text: latestLearnerMsg.content,
        opponent_argument_text: messages.filter((m) => m.speaker === "AI").slice(-1)[0]?.content || null,
      })
      .then((res) => {
        setEvaluationResult(res);
      })
      .catch((err: unknown) => {
        const errorObj = err as { response?: { status?: number; data?: { detail?: string } }; message?: string };
        setEvaluatorError(`AI Evaluator (${errorObj.response?.status || "Lỗi"}): ${errorObj.response?.data?.detail || errorObj.message}`);
      })
      .finally(() => {
        setIsEvaluating(false);
      });
  }, [messages, motionParam, learnerSide, currentRound]);

  const handleFinishDebate = async () => {
    setIsEvaluating(true);
    try {
      // 1. Group messages by rounds for AI Evaluator
      const round1Msgs = messages.filter((m) => m.roundNumber === 1);
      const round2Msgs = messages.filter((m) => m.roundNumber === 2);
      const round3Msgs = messages.filter((m) => m.roundNumber === 3);

      const roundsToEvaluate: Array<{ stage: DebateRoundType; msgs: DebateRoomMessage[] }> = [
        { stage: "opening", msgs: round1Msgs },
        { stage: "rebuttal", msgs: round2Msgs },
        { stage: "closing", msgs: round3Msgs },
      ].filter((r) => r.msgs.length > 0) as Array<{ stage: DebateRoundType; msgs: DebateRoomMessage[] }>;

      const roundResults: RoundEvaluationResult[] = [];
      for (const r of roundsToEvaluate) {
        const turns: ArgumentTurn[] = r.msgs.map((m) => ({
          speaker: (m.speaker === "Learner" ? "learner" : "opponent") as TurnSpeaker,
          text: m.content,
        }));
        if (turns.length > 0) {
          try {
            const res = await aiApi.evaluateDebateRound({
              motion: motionParam,
              side: learnerSide,
              stage: r.stage,
              turns,
            });
            roundResults.push(res);
          } catch (roundErr) {
            console.warn("AI Evaluator round error:", roundErr);
          }
        }
      }

      let sessionResult: SessionEvaluationResult | null = null;
      if (roundResults.length > 0) {
        try {
          sessionResult = await aiApi.evaluateDebateSession({
            motion: motionParam,
            side: learnerSide,
            rounds: roundResults,
          });
        } catch (sessionErr) {
          console.warn("AI Evaluator session error:", sessionErr);
        }
      }

      const overallScore100 = sessionResult
        ? Math.round(sessionResult.overall_score * 10)
        : evaluationResult
        ? Math.round(evaluationResult.overall_score * 10)
        : 75;

      const criteriaScores = evaluationResult?.criteria || roundResults[0]?.criteria || [];
      const getCriteriaScore = (name: string) => {
        const found = criteriaScores.find((c: { name: string; score: number }) =>
          c.name.toLowerCase().includes(name.toLowerCase())
        );
        return found ? found.score * 20 : 70;
      };

      const debateResultPayload = {
        sessionId,
        topicTitle: motionText,
        overallScore: overallScore100,
        ratingText:
          overallScore100 >= 80 ? "Xuất sắc" : overallScore100 >= 65 ? "Khá tốt" : "Cần cải thiện",
        scores: {
          logic: getCriteriaScore("logic"),
          evidence: getCriteriaScore("evidence"),
          relevance: getCriteriaScore("relevance"),
          structure: getCriteriaScore("structure"),
          persuasiveness: getCriteriaScore("persuasiveness"),
        },
        strengths:
          sessionResult?.overall_strengths?.length
            ? sessionResult.overall_strengths
            : evaluationResult?.strengths?.length
            ? evaluationResult.strengths
            : ["Luận điểm bám sát trọng tâm kiến nghị tranh biện."],
        improvements:
          sessionResult?.overall_weaknesses?.length
            ? sessionResult.overall_weaknesses
            : evaluationResult?.weaknesses?.length
            ? evaluationResult.weaknesses
            : ["Cần củng cố thêm số liệu và ví dụ minh họa thực tế."],
        progressTrend: sessionResult?.progress_trend || evaluationResult?.overall_reasoning,
        stageBreakdown: sessionResult?.stage_breakdown,
        criteriaList: criteriaScores,
      };

      navigate(`/learner/debate/${sessionId}/result`, {
        state: { result: debateResultPayload },
      });
    } catch {
      navigate(`/learner/debate/${sessionId}/result`);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-4.5 max-w-6xl mx-auto pb-6">
      {/* 1. TOP BAR: Thoát | Topic Title | Timer & Finish */}
      <div className="bg-white debate-panel-main px-6 py-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        {/* Left: Thoát button */}
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-[15px] font-semibold text-slate-700 dark:text-[#CBD5E1] bg-slate-100 hover:bg-slate-200 dark:bg-[#10231C] dark:hover:bg-[#123326] rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Thoát</span>
        </button>

        {/* Center: Topic Title */}
        <div className="text-center font-bold text-[17px] sm:text-[18px] text-slate-900 dark:text-[#F8FAFC] truncate max-w-md">
          {motionText}
        </div>

        {/* Right: Timer & Finish */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#ECFDF5] dark:bg-[rgba(16,185,129,0.12)] border border-[#008A64]/20 dark:border-[rgba(16,185,129,0.30)] rounded-xl font-mono text-[15px] font-bold text-[#008A64] dark:text-[#34D399]">
            <Clock size={15} />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={handleFinishDebate}
            disabled={isEvaluating}
            className="px-4 py-2 bg-[#008A64] text-white rounded-xl text-[15px] font-semibold hover:bg-[#007457] transition-all shadow-sm shadow-[#008A64]/20 disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
          >
            <span>{isEvaluating ? "Đang chấm..." : "Nộp bài"}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {roomFeedback && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-3 border animate-fade-in ${
            roomFeedback.type === "success"
              ? "bg-[#ECFDF5] border-[#008A64]/30 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {roomFeedback.type === "success" ? (
              <Check size={18} className="text-[#008A64] shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{roomFeedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setRoomFeedback(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── LOBBY / WAITING ROOM (Khi phòng chưa bắt đầu) ── */}
      {isBackendSession && sessionDetails?.status === 1 ? (
        <div className="bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header Phòng Chờ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Phòng chờ (Waiting)</span>
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {is2v2 ? "Tranh biện 2 vs 2" : "Đối kháng 1 vs 1 P2P"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F8FAFC]">
                {sessionDetails.title || motionText}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Kiến nghị: <span className="font-semibold text-slate-700 dark:text-slate-300">&ldquo;{sessionDetails.topic || motionText}&rdquo;</span>
              </p>
            </div>

            {/* Room ID & Copy Code */}
            <div className="p-3.5 bg-slate-50 dark:bg-[#091713] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shrink-0">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Mã phòng tranh biện</p>
                <p className="text-xl font-black font-mono text-[#008A64] dark:text-[#34D399]">#{sessionDetails.sessionId}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(String(sessionDetails.sessionId));
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-[#12231C] border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
              >
                {copiedCode ? <Check size={14} className="text-[#008A64]" /> : <Copy size={14} />}
                <span>{copiedCode ? "Đã chép!" : "Copy mã"}</span>
              </button>
            </div>
          </div>

          {/* Pending Swap Requests received by current user */}
          {pendingSwapRequests.length > 0 && (
            <div className="space-y-2">
              {pendingSwapRequests.map((req, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm animate-fade-in"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-purple-950 dark:text-purple-200">
                      Yêu cầu đổi phe từ {req.requesterName} (Phe {req.requesterSide})
                    </p>
                    <p className="text-purple-700 dark:text-purple-400 text-xs">
                      Thời gian còn lại: <strong>{req.expiresInSeconds}s</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRespondSwapRequest(req.requesterUserId, true)}
                      className="px-3 py-1.5 bg-[#008A64] text-white rounded-lg font-bold text-xs hover:bg-[#007457] transition-colors cursor-pointer"
                    >
                      Đồng ý đổi phe
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRespondSwapRequest(req.requesterUserId, false)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Teams Participants Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PRO Team */}
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-[rgba(16,185,129,0.08)] border border-emerald-200/70 dark:border-emerald-800/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-[#008A64] dark:text-[#34D399] text-sm">
                  <Shield size={16} />
                  <span>Phe Ủng Hộ (PRO)</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {proParticipants.length}/{is2v2 ? 2 : 1}
                </span>
              </div>
              <div className="space-y-2">
                {proParticipants.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-[#12231C] rounded-xl border border-emerald-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#008A64] text-white font-bold flex items-center justify-center text-xs">
                        {p.isAI ? "AI" : p.speakerName?.slice(0, 2).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-[#F8FAFC]">
                          {p.speakerName} {p.userId === currentUserId && "(Bạn)"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {p.userId === sessionDetails.createdByUserId ? "Chủ phòng (Host)" : `Thành viên PRO ${idx + 1}`}
                        </p>
                      </div>
                    </div>
                    {is2v2 && mySide === 2 && p.userId && (
                      <button
                        type="button"
                        onClick={() => handleSendSwapRequest(p.userId!)}
                        className="text-[11px] px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        Mời tráo phe
                      </button>
                    )}
                  </div>
                ))}
                {proParticipants.length < (is2v2 ? 2 : 1) && (
                  <div className="p-3 rounded-xl border border-dashed border-emerald-300 text-center text-xs text-emerald-700/70 py-4">
                    Đang chờ người chơi tham gia slot PRO...
                  </div>
                )}
              </div>
            </div>

            {/* CON Team */}
            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-[rgba(244,63,94,0.08)] border border-rose-200/70 dark:border-rose-800/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400 text-sm">
                  <Flame size={16} />
                  <span>Phe Phản Đối (CON)</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                  {conParticipants.length}/{is2v2 ? 2 : 1}
                </span>
              </div>
              <div className="space-y-2">
                {conParticipants.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-[#12231C] rounded-xl border border-rose-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                        {p.isAI ? "AI" : p.speakerName?.slice(0, 2).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-[#F8FAFC]">
                          {p.speakerName} {p.userId === currentUserId && "(Bạn)"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {p.userId === sessionDetails.createdByUserId ? "Chủ phòng (Host)" : `Thành viên CON ${idx + 1}`}
                        </p>
                      </div>
                    </div>
                    {is2v2 && mySide === 1 && p.userId && (
                      <button
                        type="button"
                        onClick={() => handleSendSwapRequest(p.userId!)}
                        className="text-[11px] px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        Mời tráo phe
                      </button>
                    )}
                  </div>
                ))}
                {conParticipants.length < (is2v2 ? 2 : 1) && (
                  <div className="p-3 rounded-xl border border-dashed border-rose-300 text-center text-xs text-rose-700/70 py-4">
                    Đang chờ người chơi tham gia slot CON...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {is2v2 && (
                <button
                  type="button"
                  onClick={handleSwitchSide}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-[#CBD5E1] rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw size={14} />
                  <span>Đổi sang phe đối diện</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {isHost ? (
                <button
                  type="button"
                  onClick={handleStartDebateSession}
                  disabled={!canHostStart || isStarting}
                  className="w-full sm:w-auto px-6 py-3 bg-[#008A64] hover:bg-[#007457] text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-[#008A64]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isStarting ? <Loader2 size={16} className="animate-spin" /> : <Swords size={16} />}
                  <span>
                    {canHostStart
                      ? "Bắt đầu trận tranh biện ngay"
                      : `Chờ đủ người (${sessionDetails.participants.length}/${is2v2 ? 4 : 2})`}
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Bạn đã vào phòng. Đang chờ chủ phòng bắt đầu trận đấu...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* AI Offline Simulation Mode Notice */}
          {isAiOfflineMode && (
            <div className="p-4 bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-start justify-between gap-3 animate-fade-in shadow-xs">
              <div className="flex items-start gap-2.5">
                <Sparkles size={17} className="text-[#008A64] dark:text-[#34D399] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-sm">Chế độ AI Mô phỏng (AI Simulation Mode) đang hoạt động</p>
                  <p className="text-xs text-emerald-700/90 dark:text-emerald-300/80 leading-relaxed">
                    Dịch vụ AI Python (port 8000 &amp; 8002) chưa được khởi động trên máy. Hệ thống tự động tạo bài phản biện và chấm điểm mô phỏng để bạn có thể trải nghiệm toàn bộ tiến trình tranh biện 3 vòng mà không bị gián đoạn.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiOfflineMode(false)}
                className="text-emerald-500 hover:text-emerald-700 text-xs cursor-pointer shrink-0 mt-0.5"
                title="Đóng thông báo"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Error Banners (chỉ hiện khi có lỗi không phải do offline mô phỏng) */}
          {!isAiOfflineMode && opponentError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 rounded-2xl text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Lỗi từ AI Opponent Service:</p>
                <p className="font-mono text-xs">{opponentError}</p>
              </div>
            </div>
          )}

          {!isAiOfflineMode && evaluatorError && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl text-amber-800 dark:text-amber-300 text-sm flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Lỗi từ AI Evaluator Service:</p>
                <p className="font-mono text-xs">{evaluatorError}</p>
              </div>
            </div>
          )}

          {/* 2. ROUND PROGRESS STEPPER */}
          <DebateStepper currentRound={currentRound} />

          {/* 3. MAIN WORKSPACE (3 Columns: Conversation 42%, Diễn biến 24%, AI Assistant 34%) */}
          <div className="debate-room-grid grid grid-cols-1 lg:grid-cols-[42fr_24fr_34fr] gap-4.5 items-start">
        {/* LEFT COLUMN: Transcript / Conversation Stream (~42%) */}
        <div className="bg-white debate-panel-main p-5 rounded-2xl border border-slate-200 shadow-xs h-[540px] xl:h-[580px] overflow-y-auto space-y-4">
          <div className="text-[17px] font-bold text-slate-900 dark:text-[#F8FAFC] pb-3 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <span>Nội dung tranh biện</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#10231C] text-slate-600 dark:text-[#94A3B8]">
              {messages.length} lượt tranh luận
            </span>
          </div>

          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Bot size={36} className="mx-auto text-slate-300" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Phiên tranh biện đã kết nối ({aiOpponentStatus})
                </p>
                <p className="text-xs">
                  Hãy nhập lập luận đầu tiên của bạn ở khung bên dưới để gửi tới AI Opponent Service!
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 ${
                  msg.speaker === "Learner"
                    ? "debate-msg-user bg-[#ECFDF5]/60 border-[#008A64]/30"
                    : "debate-msg-ai bg-slate-50 border-slate-200/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      msg.speaker === "Learner"
                        ? "debate-user-author text-[16px] font-semibold text-[#008A64] dark:text-[#34D399]"
                        : "debate-ai-author text-[16px] font-semibold text-slate-900 dark:text-[#F8FAFC]"
                    }
                  >
                    {msg.speakerName} ({msg.side})
                  </span>
                  <span className="debate-meta-time text-[14px] text-slate-400 dark:text-[#94A3B8]">
                    {msg.timestamp}
                  </span>
                </div>
                <p
                  className={
                    msg.speaker === "Learner"
                      ? "debate-user-body text-[16px] leading-[1.7] whitespace-pre-line text-slate-700 dark:text-[#E2E8F0]"
                      : "debate-ai-body text-[16px] leading-[1.7] whitespace-pre-line text-slate-700 dark:text-[#DCE7E3]"
                  }
                >
                  {msg.content}
                </p>
              </div>
            ))}

            {isAiGenerating && (
              <div className="p-4 bg-[#ECFDF5]/30 dark:bg-[rgba(16,185,129,0.08)] rounded-2xl border border-[#008A64]/20 dark:border-[rgba(16,185,129,0.25)] text-[15px] text-slate-700 dark:text-[#DCE7E3] animate-pulse flex items-center gap-2.5">
                <Bot size={16} className="text-[#008A64] dark:text-[#34D399]" />
                <span>AI Opponent Service đang sinh bài phản hồi...</span>
              </div>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Diễn biến (~24%) */}
        <div className="bg-white debate-panel-secondary p-5 rounded-2xl border border-slate-200 shadow-xs h-[540px] xl:h-[580px] overflow-y-auto space-y-4">
          <div className="text-[17px] font-bold text-slate-900 dark:text-[#F8FAFC] pb-3 border-b border-slate-100 dark:border-slate-800/60">
            Diễn biến
          </div>

          {[
            { round: 1, name: "Vòng 1 - Mở đầu" },
            { round: 2, name: "Vòng 2 - Phản biện" },
            { round: 3, name: "Vòng 3 - Kết luận" },
          ].map((item) => {
            const isPast = currentRound > item.round;
            const isCurrent = currentRound === item.round;
            const roundLearnerMsgs = messages.filter((m) => m.speaker === "Learner" && m.roundNumber === item.round);
            const roundAiMsgs = messages.filter((m) => m.speaker === "AI" && m.roundNumber === item.round);

            return (
              <div
                key={item.round}
                className={`p-3.5 rounded-xl border space-y-2.5 ${
                  isCurrent
                    ? "bg-[#ECFDF5]/70 dark:bg-[#123326] border-[#008A64]/40 text-[#008A64] dark:text-[#34D399]"
                    : isPast
                    ? "bg-slate-50 dark:bg-[#091713] border-slate-200/80 text-slate-900 dark:text-[#F8FAFC]"
                    : "bg-slate-50/50 dark:bg-[#091713]/60 border-slate-100 text-slate-400 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-semibold">{item.name}</span>
                  {isCurrent && (
                    <span className="text-xs px-2 py-0.5 bg-[#008A64] text-white rounded font-bold">
                      Đang diễn ra
                    </span>
                  )}
                  {isPast && (
                    <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded font-semibold">
                      Hoàn thành
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-[14px]">
                  <div className="flex items-center gap-2">
                    <UserIcon size={14} />
                    <span>
                      Bạn: {roundLearnerMsgs.length > 0 ? "Đã gửi lập luận" : isCurrent ? "Đang đến lượt" : "Chưa gửi"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-[#94A3B8]">
                    <Bot size={14} />
                    <span>
                      Đối thủ AI: {roundAiMsgs.length > 0 ? "Đã phản hồi" : isCurrent ? "Chờ lượt" : "Chưa bắt đầu"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Tabbed AI Assistant (Evaluation / Case Plan / Coaching) (~34%) */}
        <div className="space-y-3 h-[540px] xl:h-[580px] overflow-y-auto">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-[#10231C] p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setRightPanelTab("evaluation")}
              className={`py-2 px-1 rounded-lg text-center transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                rightPanelTab === "evaluation"
                  ? "bg-white dark:bg-[#163529] text-[#008A64] dark:text-[#34D399] shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Award size={13} />
              <span>Đánh giá</span>
            </button>
            <button
              type="button"
              onClick={() => setRightPanelTab("caseplan")}
              className={`py-2 px-1 rounded-lg text-center transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                rightPanelTab === "caseplan"
                  ? "bg-white dark:bg-[#163529] text-[#008A64] dark:text-[#34D399] shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <BookOpen size={13} />
              <span>Case Plan</span>
            </button>
            <button
              type="button"
              onClick={() => setRightPanelTab("coaching")}
              className={`py-2 px-1 rounded-lg text-center transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                rightPanelTab === "coaching"
                  ? "bg-white dark:bg-[#163529] text-[#008A64] dark:text-[#34D399] shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Sparkles size={13} />
              <span>Gợi ý</span>
            </button>
          </div>

          {/* TAB 1: Evaluation from AI Evaluator Service */}
          {rightPanelTab === "evaluation" && (
            <div className="bg-white debate-panel-secondary rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-[#F8FAFC]">
                  <Award size={18} className="text-[#008A64]" />
                  <span>Đánh giá lượt nói (AI Evaluator)</span>
                </div>
                {isEvaluating && (
                  <span className="text-xs text-[#008A64] font-semibold animate-pulse">Đang chấm điểm...</span>
                )}
              </div>

              {!evaluationResult ? (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <Award size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Chưa có kết quả chấm điểm</p>
                  <p className="text-xs leading-relaxed">
                    Sau khi bạn gửi lập luận, AI Evaluator sẽ chấm điểm theo rubric 5 tiêu chí: Logic, Dẫn chứng, Liên quan, Cấu trúc, Thuyết phục.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Overall score */}
                  <div className="p-4 bg-[#ECFDF5] dark:bg-[rgba(16,185,129,0.12)] border border-[#008A64]/30 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#008A64] uppercase tracking-wider">Điểm tổng kết</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                        {evaluationResult.overall_reasoning}
                      </p>
                    </div>
                    <div className="text-2xl font-black text-[#008A64] dark:text-[#34D399] shrink-0 pl-3">
                      {evaluationResult.overall_score}/10
                    </div>
                  </div>

                  {/* 5 Criteria */}
                  {evaluationResult.criteria && evaluationResult.criteria.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Chi tiết rubric</p>
                      <div className="space-y-2">
                        {evaluationResult.criteria.map((c, i) => (
                          <div key={i} className="p-2.5 bg-slate-50 dark:bg-[#091713] rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                              <span>{c.name}</span>
                              <span className="text-[#008A64]">{c.score}/5</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">{c.reasoning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths & Weaknesses */}
                  {evaluationResult.strengths?.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Điểm mạnh:</p>
                      <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                        {evaluationResult.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Case Plan from AI Opponent Service */}
          {rightPanelTab === "caseplan" && (
            <div className="bg-white debate-panel-secondary rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-[#F8FAFC] pb-3 border-b border-slate-100 dark:border-slate-800/60">
                <BookOpen size={18} className="text-[#008A64]" />
                <span>Hồ sơ lập luận AI (Case Plan)</span>
              </div>

              {!casePlan ? (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <BookOpen size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Chưa có Case Plan</p>
                  <p className="text-xs leading-relaxed">
                    Case Plan được AI Opponent Service sinh ra trong giai đoạn chuẩn bị (Planning).
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {/* Motion reading */}
                  {casePlan.content?.motion_reading && (
                    <div className="p-3 bg-slate-50 dark:bg-[#091713] rounded-xl border border-slate-200/80">
                      <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Định nghĩa phạm vi & Bối cảnh:</p>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{casePlan.content.motion_reading}</p>
                    </div>
                  )}

                  {/* Definitions */}
                  {casePlan.content?.definitions && casePlan.content.definitions.length > 0 && (
                    <div className="p-3 bg-slate-50 dark:bg-[#091713] rounded-xl border border-slate-200/80 space-y-2">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Thuật ngữ cốt lõi:</p>
                      <div className="space-y-1.5">
                        {casePlan.content.definitions.map((def, idx) => (
                          <p key={idx} className="text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-[#008A64]">{def.term}:</span> {def.meaning}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Arguments */}
                  {casePlan.content?.arguments && casePlan.content.arguments.length > 0 && (
                    <div className="space-y-2.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Các luận điểm chính của AI:</p>
                      {casePlan.content.arguments.map((arg) => (
                        <div key={arg.id} className="p-3 bg-slate-50 dark:bg-[#091713] rounded-xl border border-slate-200/80 space-y-1.5">
                          <p className="font-bold text-[#008A64]">{arg.id}: {arg.title}</p>
                          <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">Luận điểm:</span> {arg.claim}</p>
                          <p className="text-slate-600 dark:text-slate-400"><span className="font-semibold">Lý lẽ:</span> {arg.reasoning}</p>
                          {arg.example && (
                            <p className="italic text-slate-500"><span className="font-semibold">Ví dụ:</span> {arg.example}</p>
                          )}
                          {arg.impact && (
                            <p className="text-emerald-700 dark:text-emerald-400"><span className="font-semibold">Tác động:</span> {arg.impact}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Anticipated arguments */}
                  {casePlan.content?.anticipated_opponent_arguments && casePlan.content.anticipated_opponent_arguments.length > 0 && (
                    <div className="space-y-2.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Dự đoán phản biện của đối phương:</p>
                      {casePlan.content.anticipated_opponent_arguments.map((item) => (
                        <div key={item.id} className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-800/40 space-y-1.5">
                          <p className="font-semibold text-amber-800 dark:text-amber-300">
                            <span className="font-bold">Dự đoán bạn sẽ nói:</span> {item.learner_claim}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">
                            <span className="font-semibold text-slate-700 dark:text-slate-200">AI chuẩn bị phản bác:</span> {item.planned_response}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Weighing */}
                  {casePlan.content?.weighing && (
                    <div className="p-3 bg-slate-50 dark:bg-[#091713] rounded-xl border border-slate-200/80">
                      <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Cân nhắc tác động (Weighing):</p>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{casePlan.content.weighing}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Coaching & Rebuttal Advice */}
          {rightPanelTab === "coaching" && (
            <div className="space-y-4">
              <RebuttalSuggestion />
              <AICoachingPanel
                costPerUse={2000}
                advice={coachingAdvice}
                onRequestCoaching={handleRequestEvaluation}
                isLoading={isEvaluating}
              />
            </div>
          )}
        </div>
      </div>

      {/* 4. FIXED BOTTOM COMPOSER: Lập luận của bạn | Textarea | 0/2000 | Mic | Gợi ý | Gửi */}
      <div className="bg-white debate-panel-main p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="debate-argument-textarea" className="text-[15px] font-bold text-slate-900 dark:text-[#F8FAFC]">
            Lập luận của bạn
          </label>
          <span className="text-[14px] text-slate-400 dark:text-[#94A3B8]">
            {argumentText.length} / 2000
          </span>
        </div>

        <form onSubmit={handleSendArgument} className="space-y-3">
          <textarea
            id="debate-argument-textarea"
            rows={3}
            value={argumentText}
            onChange={(e) => setArgumentText(e.target.value.slice(0, 2000))}
            placeholder="Nhập nội dung phản biện của bạn và gửi tới AI..."
            className="w-full p-3.5 text-[15px] sm:text-[16px] leading-[1.65] bg-slate-50 dark:bg-[#091713] border border-slate-200 dark:border-[rgba(148,163,184,0.20)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] resize-none text-slate-800 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-[#64748B] transition-all"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              {/* Microphone */}
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isRecording
                    ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400"
                    : "bg-slate-100 dark:bg-[#10231C] border-slate-200 dark:border-[rgba(148,163,184,0.20)] text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-200 dark:hover:bg-[#123326]"
                }`}
                title="Ghi âm giọng nói"
              >
                <Mic size={17} />
              </button>

              {/* Gợi ý button */}
              <button
                type="button"
                onClick={() => setShowTipsModal(true)}
                className="px-4 py-2 bg-[#ECFDF5] text-[#008A64] dark:bg-[rgba(16,185,129,0.12)] dark:text-[#34D399] border border-[#008A64]/30 dark:border-[rgba(16,185,129,0.30)] rounded-xl text-[15px] font-semibold inline-flex items-center gap-2 hover:bg-emerald-100 dark:hover:bg-[rgba(16,185,129,0.20)] transition-colors cursor-pointer"
              >
                <Lightbulb size={16} />
                <span>Gợi ý phản biện</span>
              </button>
            </div>

            {/* Gửi lập luận */}
            <button
              type="submit"
              disabled={!argumentText.trim() || isAiGenerating}
              className="px-6 py-2.5 bg-[#008A64] hover:bg-[#007457] text-white rounded-xl text-[15px] sm:text-[16px] font-semibold inline-flex items-center gap-2 transition-all shadow-sm shadow-[#008A64]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{isAiGenerating ? "Đang gửi..." : "Gửi lập luận"}</span>
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
        </>
      )}

      {/* Exit Confirm Dialog */}
      <ConfirmDialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={() => navigate("/learner/dashboard")}
        title="Rời phòng tranh biện?"
        message="Phiên tranh biện sẽ tạm dừng và lưu lại trên hệ thống. Bạn có muốn quay về Dashboard?"
        confirmText="Rời phòng"
        cancelText="Ở lại tiếp tục"
        variant="danger"
      />

      {/* Tips modal */}
      {showTipsModal && (
        <ConfirmDialog
          isOpen={showTipsModal}
          onClose={() => setShowTipsModal(false)}
          onConfirm={() => setShowTipsModal(false)}
          title="Gợi ý phản biện"
          message="Hãy xác định rõ luận điểm chính của đối phương, phân tích tính hợp lý của lý lẽ và kiểm tra xem bằng chứng đưa ra có xác thực không."
          confirmText="Đã hiểu"
          cancelText="Đóng"
          variant="primary"
        />
      )}
    </div>
  );
};

export default DebateRoom;
