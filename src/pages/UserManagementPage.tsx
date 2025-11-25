import { useMemo, useState, useEffect } from "react";
import type { AdminUser } from "../types/user";
import { UserTable } from "../components/UserTable";
import { fetchUsers, updateUserBanStatus } from "../api/userApi";
import { useAuth } from "../context/AuthContext";

const TRUST_FILTERS = [
  { label: "Tất cả", value: "all" as const },
  { label: "Trust < 50", value: "low" as const },
  { label: "Trust >= 50", value: "high" as const },
];

type TrustFilterValue = (typeof TRUST_FILTERS)[number]["value"];

export const UserManagementPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers()
        .then((data) => setUsers(data))
        .catch((err) => setError("Không thể tải dữ liệu người dùng"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);
  const [trustFilter, setTrustFilter] = useState<TrustFilterValue>("all");

  const filteredUsers = useMemo(() => {
    if (trustFilter === "low") {
      return users.filter((u) => u.trustScore < 50);
    }
    if (trustFilter === "high") {
      return users.filter((u) => u.trustScore >= 50);
    }
    return users;
  }, [users, trustFilter]);

  const handleToggleBan = async (userId: string) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;
    try {
      const updated = await updateUserBanStatus(userId, !user.isBanned);
      setUsers((prev) => prev.map((u) => (u._id === userId ? updated : u)));
    } catch {
      setError("Không thể cập nhật trạng thái người dùng");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý người dùng</h2>
        <div className="page-filters">
          <label>
            Lọc theo trust score:
            <select
              value={trustFilter}
              onChange={(e) => setTrustFilter(e.target.value as TrustFilterValue)}
            >
              {TRUST_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {loading ? (
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      ) : user?.role !== "admin" ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Truy cập bị từ chối</h3>
          <p className="text-gray-500">Bạn không có quyền truy cập trang quản lý người dùng.</p>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <UserTable users={filteredUsers} onToggleBan={handleToggleBan} />
      )}
    </div>
  );
};