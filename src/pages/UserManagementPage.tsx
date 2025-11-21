import { useMemo, useState } from "react";
import type { AdminUser } from "../types/user";
import { mockUsers } from "../data/mockUsers";
import { UserTable } from "../components/UserTable";

const TRUST_FILTERS = [
  { label: "Tất cả", value: "all" as const },
  { label: "Trust < 50", value: "low" as const },
  { label: "Trust >= 50", value: "high" as const },
];

type TrustFilterValue = (typeof TRUST_FILTERS)[number]["value"];

export const UserManagementPage = () => {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
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

  const handleToggleBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId
          ? {
              ...u,
              isBanned: !u.isBanned,
              bannedAt: !u.isBanned ? new Date().toISOString() : undefined,
            }
          : u,
      ),
    );
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
      <UserTable users={filteredUsers} onToggleBan={handleToggleBan} />
    </div>
  );
};