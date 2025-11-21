import { useMemo, useState, useEffect } from "react";
import type { AdminUser } from "../types/user";
import { UserTable } from "../components/UserTable";
import { fetchUsers, updateUserBanStatus } from "../api/userApi";

const TRUST_FILTERS = [
  { label: "Tất cả", value: "all" as const },
  { label: "Trust < 50", value: "low" as const },
  { label: "Trust >= 50", value: "high" as const },
];

type TrustFilterValue = (typeof TRUST_FILTERS)[number]["value"];

export const UserManagementPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data))
      .catch((err) => setError("Không thể tải dữ liệu người dùng"))
      .finally(() => setLoading(false));
  }, []);
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
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <UserTable users={filteredUsers} onToggleBan={handleToggleBan} />
      )}
    </div>
  );
};