import type { AdminUser } from "../types/user";
import { useEffect, useState } from "react";
import { fetchOrders } from "../api/orderApi";

interface UserTableProps {
  users: AdminUser[];
  onToggleBan: (userId: string) => void;
}

export const UserTable = ({ users, onToggleBan }: UserTableProps) => {
  const [addressMap, setAddressMap] = useState<Record<string, string>>({});
  const [orderStats, setOrderStats] = useState<Record<string, { total: number; canceled: number }>>({});

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
        lat
      )}&lon=${encodeURIComponent(lon)}`;
      const res = await fetch(url, { headers: { "Accept-Language": "vi" } });
      if (!res.ok) return null;
      const data = await res.json();
      const address =
        data.display_name ||
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.state ||
        null;
      return address;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const u of users) {
        if (cancelled) break;
        if (addressMap[u._id]) continue;
        const coords = u.address?.location?.coordinates;
        if (Array.isArray(coords) && coords.length >= 2) {
          const lon = Number(coords[0]);
          const lat = Number(coords[1]);
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
          const addr = await reverseGeocode(lat, lon);
          if (cancelled) break;
          setAddressMap((prev) => ({
            ...prev,
            [u._id]: addr ?? `${lat.toFixed(6)}, ${lon.toFixed(6)}`,
          }));
          await new Promise((r) => setTimeout(r, 200));
        } else if (u.address?.city) {
          setAddressMap((prev) => ({ ...prev, [u._id]: u.address.city }));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [users]); // eslint-disable-line react-hooks/exhaustive-deps

  // fetch orders and compute per-seller stats
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const orders = await fetchOrders();
        if (!mounted) return;
        const stats: Record<string, { total: number; canceled: number }> = {};
        for (const o of orders) {
          const sellerId = o.sellerId;
          if (!sellerId) continue;
          if (!stats[sellerId]) stats[sellerId] = { total: 0, canceled: 0 };
          stats[sellerId].total += 1;
          if (typeof o.status === "string" && o.status.toLowerCase() === "canceled") {
            stats[sellerId].canceled += 1;
          }
        }
        setOrderStats(stats);
      } catch {
        setOrderStats({});
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Họ tên</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Số điện thoại</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Thành phố</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Trust score</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Đánh giá</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">GD thành công / huỷ</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Trạng thái</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {users.map((user) => {
            const isLowTrust = (user.trustScore ?? 0) < 50;
            const coords = user.address?.location?.coordinates;
            const coordFallback =
              Array.isArray(coords) && coords.length >= 2
                ? `${Number(coords[1]).toFixed(6)}, ${Number(coords[0]).toFixed(6)}`
                : null;
            const readableAddress = addressMap[user._id] ?? user.address?.city ?? coordFallback ?? "Không rõ";

            const stats = orderStats[user._id] ?? {
              total: (user.successfulTrades ?? 0) + (user.cancelledTrades ?? 0),
              canceled: user.cancelledTrades ?? 0,
            };
            const successful = Math.max(0, stats.total - stats.canceled);
            const canceled = stats.canceled;

            return (
              <tr key={user._id} className={user.isBanned ? "bg-red-50" : ""}>
                <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-800">{user.fullName}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700">{user.phone}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700">{readableAddress}</td>
                <td className={`px-4 py-2 whitespace-nowrap ${isLowTrust ? "text-red-500 font-bold" : "text-gray-700"}`}>{user.trustScore ?? "-"}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                  {typeof user.rating === "number" ? user.rating.toFixed(1) : "-"} ({user.reviewCount ?? 0})
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700">{successful} / {canceled}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {user.isBanned ? (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Đã chặn</span>
                  ) : isLowTrust ? (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Nguy cơ</span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Bình thường</span>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${user.isBanned ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}
                    onClick={() => onToggleBan(user._id)}
                  >
                    {user.isBanned ? "Mở chặn" : "Chặn"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};