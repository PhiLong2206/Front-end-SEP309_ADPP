import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchInput from "../../../components/common/SearchInput";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
export interface MatchmakingUser {
  id: string;
  fullName: string;
  avatarUrl: string;
  totalMatches: number;
  averageScore: number;
  status: "Online" | "Offline" | "InMatch";
}

export interface Room1v1 {
  id: string;
  name: string;
  topic: string;
  format: string;
  isPrivate: boolean;
  participantCount: number;
}

export interface Match1v1 {
  id: string;
  topic: string;
  date: string;
  duration: string;
  rules: string;
  result: "WIN" | "LOSE" | "DRAW";
  playerA: { name: string; score: number };
  playerB: { name: string; score: number };
}

import {
  Plus, Check, Trophy, Clock, Swords, Lock, Unlock,
  ArrowRight, Users, CheckCircle2, AlertCircle, FileText
} from "lucide-react";

const Debate1v1: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"find" | "myRooms" | "history">("find");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpponent, setSelectedOpponent] = useState<MatchmakingUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [challengeSuccess, setChallengeSuccess] = useState(false);
  const [myRooms, setMyRooms] = useState<Room1v1[]>([]);
  const [matchmakingUsers] = useState<MatchmakingUser[]>([]);
  const [matches] = useState<Match1v1[]>([]);

  const filteredUsers = matchmakingUsers.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChallenge = (user: MatchmakingUser) => {
    setSelectedOpponent(user);
    setChallengeSuccess(true);
    setTimeout(() => { setChallengeSuccess(false); setSelectedOpponent(null); }, 2500);
  };

  const handleCreateRoom = () => {
    setShowCreateModal(false);
    setActiveTab("myRooms");
  };

  const TABS = [
    { id: "find" as const, label: "Tìm đối thủ" },
    { id: "myRooms" as const, label: "Phòng của tôi" },
    { id: "history" as const, label: "Lịch sử đối kháng" },
  ];

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Tranh biện 1 vs 1</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Thách đấu trực tiếp với các người học khác theo thời gian thực.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#008A64] hover:bg-[#007457] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-[#008A64]/20 transition-all hover:scale-102"
        >
          <Plus size={16} /><span>+ Tạo phòng tranh biện</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-[#008A64] text-[#008A64]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Tìm đối thủ ── */}
      {activeTab === "find" && (
        <div className="space-y-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Tìm người học theo tên..." className="max-w-xs" />

          {challengeSuccess && selectedOpponent && (
            <div className="p-3.5 bg-[#ECFDF5] border border-[#008A64]/30 rounded-xl text-xs sm:text-sm text-emerald-800 flex items-center gap-2.5">
              <Check size={16} className="text-[#008A64]" />
              <span>Đã gửi lời mời thách đấu tới <strong>{selectedOpponent.fullName}</strong>. Đang chờ đối thủ xác nhận...</span>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 tracking-wider border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Người học</th>
                    <th scope="col" className="px-5 py-3.5 text-center">Số trận</th>
                    <th scope="col" className="px-5 py-3.5 text-center">Điểm TB</th>
                    <th scope="col" className="px-5 py-3.5 text-center">Trạng thái</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400">
                        Hiện tại chưa có người dùng nào trực tuyến để thách đấu.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center text-xs font-semibold text-slate-700 font-mono">{user.totalMatches}</td>
                      <td className="px-5 py-4 text-center text-xs font-bold text-[#008A64] font-mono">{user.averageScore}</td>
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        {user.status === "Online" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#008A64] border border-[#008A64]/30">
                            <span className="w-2 h-2 rounded-full bg-[#008A64] animate-pulse" />Trực tuyến
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                            <span className="w-2 h-2 rounded-full bg-slate-400" />Ngoại tuyến
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <Button
                          variant={user.status === "Online" ? "primary" : "secondary"}
                          size="sm"
                          disabled={user.status !== "Online"}
                          onClick={() => handleChallenge(user)}
                          className="px-3.5 py-1.5 text-xs font-bold"
                        >
                          Thách đấu
                        </Button>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Phòng của tôi ── */}
      {activeTab === "myRooms" && (
        <div className="space-y-4">
          {myRooms.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500 shadow-xs">
              <Users size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold">Bạn chưa tạo phòng tranh biện nào.</p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 bg-[#008A64] text-white text-xs font-bold rounded-xl hover:bg-[#007457] transition-all inline-flex items-center gap-1.5"
              >
                <Plus size={14} />Tạo phòng ngay
              </button>
            </div>
          ) : (
            myRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-slate-900 text-sm">{room.name}</h3>
                    {room.isPrivate ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                        <Lock size={10} />Riêng tư
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#008A64] bg-[#ECFDF5] border border-[#008A64]/30 px-2 py-0.5 rounded-full">
                        <Unlock size={10} />Công khai
                      </span>
                    )}
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      room.status === "waiting"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-[#ECFDF5] text-[#008A64] border-[#008A64]/30"
                    }`}>
                      {room.status === "waiting" ? "⏳ Chờ đối thủ" : "🔴 Đang diễn ra"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 italic">&ldquo;{room.topic}&rdquo;</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Users size={11} />{room.currentPlayers}/{room.maxPlayers}</span>
                    <span>{room.rules}</span>
                    <span>{room.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setMyRooms((prev) => prev.filter((r) => r.id !== room.id))}
                    className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold rounded-xl transition-all"
                  >
                    Xóa
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/learner/debate-1v1/room")}
                    className="px-4 py-1.5 bg-[#008A64] hover:bg-[#007457] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    Vào phòng <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Tab 3: Lịch sử đối kháng ── */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {matches.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500 shadow-xs">
              Chưa có lịch sử đối kháng 1 vs 1.
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Tổng trận", value: matches.length, icon: Swords, color: "text-blue-500" },
                  { label: "Thắng", value: matches.filter((m) => m.result === "WIN").length, icon: Trophy, color: "text-amber-500" },
                  { label: "Thua", value: matches.filter((m) => m.result === "LOSE").length, icon: AlertCircle, color: "text-rose-500" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs text-center">
                    <s.icon size={18} className={`${s.color} mx-auto mb-1.5`} />
                    <p className="text-2xl font-black text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Match history list */}
              <div className="space-y-3">
                {matches.map((match) => (
                  <div key={match.id} className={`bg-white rounded-2xl border shadow-xs p-5 flex items-center gap-4 ${
                    match.result === "WIN" ? "border-[#008A64]/30" : match.result === "LOSE" ? "border-rose-200" : "border-slate-200"
                  }`}>
                    {/* Result badge */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      match.result === "WIN"
                        ? "bg-[#ECFDF5] text-[#008A64]"
                        : match.result === "LOSE"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {match.result === "WIN" ? <><CheckCircle2 size={20} /></> : match.result === "LOSE" ? <AlertCircle size={20} /> : <Swords size={20} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 line-clamp-1">{match.topic}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1"><Swords size={11} />vs {match.playerB.name}</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{match.duration}</span>
                        <span>{match.date}</span>
                        <span className="font-bold">{match.rules}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-2xl font-black text-slate-900 font-mono">{match.playerA.score}</p>
                      <p className="text-[11px] text-slate-400">vs {match.playerB.score}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/learner/debate-1v1/match-001/result")}
                      className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:border-[#008A64] hover:text-[#008A64] text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 shrink-0"
                    >
                      <FileText size={13} />Xem kết quả
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Create Room Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo phòng tranh biện 1 vs 1"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>Hủy</Button>
            <Button variant="primary" size="sm" onClick={handleCreateRoom}>Tạo phòng</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Tên phòng" name="roomName" placeholder="Phòng luyện tập phản biện..." required onChange={() => {}} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Chủ đề tranh biện</label>
            <select className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64]">
              <option>Mạng xã hội có gây hại nhiều hơn lợi ích?</option>
              <option>Trí tuệ nhân tạo có nên được quản lý chặt chẽ?</option>
              <option>Đại học có nên miễn học phí?</option>
              <option>Năng lượng tái tạo có thể thay thế nhiên liệu hóa thạch?</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Thể lệ</label>
            <select className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64]">
              <option>WSDC</option>
              <option>British Parliamentary (BP)</option>
              <option>Tự do</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="privateRoom" className="w-4 h-4 accent-[#008A64]" />
            <label htmlFor="privateRoom" className="text-xs font-semibold text-slate-700">Phòng riêng tư (chỉ người có link mới vào được)</label>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Debate1v1;
