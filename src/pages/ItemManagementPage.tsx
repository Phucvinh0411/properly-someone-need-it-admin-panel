import { useMemo, useState } from "react";
import type { AdminItem, ItemStatus } from "../types/item";
import { mockItems } from "../data/mockItems";
import { ItemTable } from "../components/ItemTable";

const STATUS_FILTERS: { label: string; value: ItemStatus | "all" }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đang hiển thị", value: "ACTIVE" },
  { label: "Đã bán", value: "SOLD" },
  { label: "Đã ẩn/xóa", value: "DELETED" },
];

export const ItemManagementPage = () => {
  const [items, setItems] = useState<AdminItem[]>(mockItems);
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
      <ItemTable items={filteredItems} onChangeStatus={handleChangeStatus} />
    </div>
  );
};