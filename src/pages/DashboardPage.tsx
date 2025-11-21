import { useMemo } from "react";
import type { AdminUser } from "../types/user";
import type { AdminItem } from "../types/item";
import { mockUsers } from "../data/mockUsers";
import { mockItems } from "../data/mockItems";

export const DashboardPage = () => {
  const users = mockUsers as AdminUser[];
  const items = mockItems as AdminItem[];

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const bannedUsers = users.filter((u) => u.isBanned).length;
    const lowTrustUsers = users.filter((u) => u.trustScore < 50).length;

    const totalItems = items.length;
    const pendingItems = items.filter((i) => i.status === "PENDING").length;
    const activeItems = items.filter((i) => i.status === "ACTIVE").length;
    const deletedItems = items.filter((i) => i.status === "DELETED").length;

    return {
      totalUsers,
      bannedUsers,
      lowTrustUsers,
      totalItems,
      pendingItems,
      activeItems,
      deletedItems,
    };
  }, [users, items]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Tổng quan hệ thống</h2>
          <p className="text-sm text-gray-500">Theo dõi nhanh số lượng người dùng và tin đăng (mock data).</p>
        </div>
        <div className="text-sm text-gray-400 mt-2 md:mt-0">
          Hôm nay: {new Date().toLocaleDateString("vi-VN")}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-8">
        <div className="rounded-xl bg-white p-6 shadow border-t-4 border-blue-500 flex flex-col gap-1">
          <div className="text-sm text-gray-500 font-semibold mb-1">Người dùng</div>
          <div className="text-3xl font-bold text-blue-700 mb-1">{stats.totalUsers}</div>
          <div className="text-xs text-gray-500">
            Bị chặn: <span className="font-bold text-red-500">{stats.bannedUsers}</span> • Trust &lt; 50: <span className="font-bold text-yellow-500">{stats.lowTrustUsers}</span>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow border-t-4 border-green-500 flex flex-col gap-1">
          <div className="text-sm text-gray-500 font-semibold mb-1">Tin đăng</div>
          <div className="text-3xl font-bold text-green-700 mb-1">{stats.totalItems}</div>
          <div className="text-xs text-gray-500">
            Chờ duyệt: <span className="font-bold text-blue-500">{stats.pendingItems}</span> • Hiển thị: <span className="font-bold text-green-600">{stats.activeItems}</span>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow border-t-4 border-red-500 flex flex-col gap-1">
          <div className="text-sm text-gray-500 font-semibold mb-1">Tin đã ẩn / xóa</div>
          <div className="text-3xl font-bold text-red-700 mb-1">{stats.deletedItems}</div>
          <div className="text-xs text-gray-500">Dựa trên dữ liệu mock</div>
        </div>
      </div>

      {/* Recent users and items */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="bg-white rounded-xl shadow p-5">
          <div className="font-semibold text-gray-700 mb-2">Người dùng rủi ro (trust &lt; 50)</div>
          {users.filter((u) => u.trustScore < 50).length === 0 ? (
            <p className="text-sm text-gray-400">Chưa có người dùng nào trust thấp.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {users
                .filter((u) => u.trustScore < 50)
                .slice(0, 5)
                .map((u) => (
                  <li key={u._id} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-gray-800">{u.fullName}</div>
                      <div className="text-xs text-gray-500">{u.phone} • Trust: {u.trustScore}</div>
                    </div>
                    {u.isBanned && (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Đã chặn</span>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="font-semibold text-gray-700 mb-2">Tin chờ duyệt gần đây</div>
          {items.filter((i) => i.status === "PENDING").length === 0 ? (
            <p className="text-sm text-gray-400">Hiện không có tin nào đang chờ duyệt.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items
                .filter((i) => i.status === "PENDING")
                .slice(0, 5)
                .map((item) => (
                  <li key={item._id} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-gray-800">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.category} • {new Date(item.createdAt).toLocaleDateString("vi-VN")}</div>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Chờ duyệt</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
