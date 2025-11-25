import { useMemo, useState, useEffect } from "react";
import type { AdminItem, ItemStatus } from "../types/item";
import { ItemTable } from "../components/ItemTable";
import { fetchItems } from "../api/itemApi";
import { useAuth } from "../context/AuthContext";

const STATUS_FILTERS: { label: string; value: ItemStatus | "all" }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đang hiển thị", value: "ACTIVE" },
  { label: "Đã bán", value: "SOLD" },
  { label: "Đã ẩn/xóa", value: "DELETED" },
];

export const ItemManagementPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchItems()
        .then((data) => setItems(data))
        .catch(() => setError("Không thể tải dữ liệu sản phẩm"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);
  const [statusFilter, setStatusFilter] = useState<ItemStatus | "all">("all");

  const filteredItems = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((i) => i.status === statusFilter);
  }, [items, statusFilter]);

  const handleChangeStatus = (itemId: string, status: ItemStatus) => {
    setItems((prev) =>
      prev.map((i) => (i._id === itemId ? { ...i, status, updatedAt: new Date().toISOString() } : i)),
    );
  };

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý sản phẩm</h2>
        <div className="page-filters">
          <label>
            Lọc theo trạng thái:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ItemStatus | "all")}
            >
              {STATUS_FILTERS.map((f) => (
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
          <p className="text-gray-500">Bạn không có quyền truy cập trang quản lý sản phẩm.</p>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ItemTable items={filteredItems} onChangeStatus={handleChangeStatus} />
      )}
    </div>
  );
};