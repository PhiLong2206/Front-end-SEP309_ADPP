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
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Tranh biện 1 vs 1
        </h1>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-1 font-bold text-xs shadow-xs"
        >
          <Plus size={14} />
          <span>+ Tạo phòng tranh biện</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("find")}
          className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "find"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Tìm đối thủ
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("myRooms")}
          className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "myRooms"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Phòng của tôi
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "history"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Lịch sử
        </button>
      </div>

      {/* Tab 1: Tìm đối thủ */}
      {activeTab === "find" && (
        <div className="space-y-3">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm người học..."
            className="max-w-xs"
          />

          {challengeSuccess && selectedOpponent && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <Check size={14} className="text-emerald-600" />
              <span>
                Đã gửi lời mời thách đấu tới <strong>{selectedOpponent.fullName}</strong>.
              </span>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th scope="col" className="px-5 py-3">Người học</th>
                    <th scope="col" className="px-5 py-3 text-center">Số trận</th>
                    <th scope="col" className="px-5 py-3 text-center">Điểm TB</th>
                    <th scope="col" className="px-5 py-3 text-center">Trạng thái</th>
                    <th scope="col" className="px-5 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <span className="font-bold text-slate-900 text-xs">
                            {user.fullName}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3 text-center text-xs font-semibold text-slate-700">
                        {user.totalMatches}
                      </td>

                      <td className="px-5 py-3 text-center text-xs font-bold text-slate-900">
                        {user.averageScore}
                      </td>

                      <td className="px-5 py-3 text-center whitespace-nowrap">
                        {user.status === "Online" ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Đang online</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Đang offline</span>
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <Button
                          variant={user.status === "Online" ? "primary" : "secondary"}
                          size="sm"
                          disabled={user.status !== "Online"}
                          onClick={() => handleChallenge(user)}
                          className="px-3 py-1 text-xs font-bold"
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
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
          Bạn chưa tạo phòng tranh biện nào.
        </div>
      )}

      {/* Tab 3: Lịch sử */}
      {activeTab === "history" && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
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
        <div className="space-y-3">
          <Input
            label="Tên phòng"
            name="roomName"
            placeholder="Phòng luyện tập phản biện..."
            required
            onChange={() => {}}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">Chủ đề tranh biện</label>
            <select className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-700">
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
