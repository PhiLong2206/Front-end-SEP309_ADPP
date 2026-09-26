import React, { useState } from "react";
import SearchInput from "../../../components/common/SearchInput";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import { MOCK_MATCHMAKING_USERS, MatchmakingUser } from "../../../mocks/users";
import { Plus, Check } from "lucide-react";

const Debate1v1: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"find" | "myRooms" | "history">("find");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpponent, setSelectedOpponent] = useState<MatchmakingUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [challengeSuccess, setChallengeSuccess] = useState(false);

  const filteredUsers = MOCK_MATCHMAKING_USERS.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChallenge = (user: MatchmakingUser) => {
    setSelectedOpponent(user);
    setChallengeSuccess(true);
    setTimeout(() => {
      setChallengeSuccess(false);
      setSelectedOpponent(null);
    }, 2500);
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Tranh biện 1 vs 1
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Thách đấu trực tiếp với các người học khác theo thời gian thực.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/30 transition-all hover:scale-102"
        >
          <Plus size={16} />
          <span>+ Tạo phòng tranh biện</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("find")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === "find"
              ? "border-blue-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Tìm đối thủ
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("myRooms")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === "myRooms"
              ? "border-blue-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Phòng của tôi
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === "history"
              ? "border-blue-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Lịch sử đối kháng
        </button>
      </div>

      {/* Tab 1: Tìm đối thủ */}
      {activeTab === "find" && (
        <div className="space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm người học theo tên..."
            className="max-w-xs"
          />

          {challengeSuccess && selectedOpponent && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-emerald-300 flex items-center gap-2.5 animate-fade-in">
              <Check size={16} className="text-emerald-400" />
              <span>
                Đã gửi lời mời thách đấu tới <strong>{selectedOpponent.fullName}</strong>.
              </span>
            </div>
          )}

          <div className="bg-[#0e1626]/90 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Người học</th>
                    <th scope="col" className="px-5 py-3.5 text-center">Số trận</th>
                    <th scope="col" className="px-5 py-3.5 text-center">Điểm TB</th>
                    <th scope="col" className="px-5 py-3.5 text-center">Trạng thái</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <span className="font-bold text-white text-xs sm:text-sm">
                            {user.fullName}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center text-xs font-semibold text-slate-300 font-mono">
                        {user.totalMatches}
                      </td>

                      <td className="px-5 py-4 text-center text-xs font-bold text-cyan-400 font-mono">
                        {user.averageScore}
                      </td>

                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        {user.status === "Online" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Trực tuyến</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            <span className="w-2 h-2 rounded-full bg-slate-500" />
                            <span>Ngoại tuyến</span>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Phòng của tôi */}
      {activeTab === "myRooms" && (
        <div className="bg-[#0e1626]/90 p-10 rounded-2xl border border-slate-800 text-center text-xs sm:text-sm text-slate-400">
          Bạn chưa tạo phòng tranh biện nào.
        </div>
      )}

      {/* Tab 3: Lịch sử */}
      {activeTab === "history" && (
        <div className="bg-[#0e1626]/90 p-10 rounded-2xl border border-slate-800 text-center text-xs sm:text-sm text-slate-400">
          Chưa có lịch sử đối kháng 1 vs 1.
        </div>
      )}

      {/* Create Room Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo phòng tranh biện 1 vs 1"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowCreateModal(false);
                setActiveTab("myRooms");
              }}
            >
              Tạo phòng
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Tên phòng"
            name="roomName"
            placeholder="Phòng luyện tập phản biện..."
            required
            onChange={() => {}}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Chủ đề tranh biện</label>
            <select className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white">
              <option>Mạng xã hội có gây hại nhiều hơn lợi ích?</option>
              <option>Trí tuệ nhân tạo có nên được quản lý chặt chẽ?</option>
              <option>Đại học có nên miễn học phí?</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Debate1v1;
