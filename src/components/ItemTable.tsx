// ...existing code...
import type { AdminItem, ItemStatus } from "../types/item";
import { useState } from "react";

interface ItemTableProps {
  items: AdminItem[];
  onChangeStatus: (itemId: string, status: ItemStatus) => void;
}

const statusLabel: Record<ItemStatus, string> = {
  ACTIVE: "Đang hiển thị",
  PENDING: "Chờ duyệt",
  SOLD: "Đã bán",
  DELETED: "Đã ẩn/xóa",
};

export const ItemTable = ({ items, onChangeStatus }: ItemTableProps) => {
  // modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);

  const openConfirm = (itemId: string) => {
    setPendingItemId(itemId);
    setConfirmOpen(true);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingItemId(null);
  };

  const handleConfirm = () => {
    if (pendingItemId) onChangeStatus(pendingItemId, "DELETED");
    setConfirmOpen(false);
    setPendingItemId(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Ảnh</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Tiêu đề</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Danh mục</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Giá</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Người bán</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Trạng thái</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Lượt xem / Yêu thích</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {items.map((item) => {
              const thumbnail = item.images?.[0];
              // determine seller display name:
              // ...
                      const sellerName = (item as any).seller?.fullName ?? item.sellerId;

              return (
                <tr key={item._id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Img</div>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-800">{item.title}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.category}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.price?.toLocaleString?.("vi-VN") ?? "-"} đ</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">{sellerName}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      item.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                      item.status === "PENDING" ? "bg-blue-100 text-blue-700" :
                      item.status === "DELETED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>{statusLabel[item.status]}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.views ?? 0} / {item.favoritesCount ?? 0}</td>
                  <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                    {item.status === "PENDING" && (
                      <button
                        className="px-3 py-1 rounded bg-green-500 text-white text-xs hover:bg-green-600 transition"
                        onClick={() => onChangeStatus(item._id, "ACTIVE")}
                      >
                        Duyệt
                      </button>
                    )}
                    {item.status !== "DELETED" && (
                      <button
                        className="px-3 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600 transition"
                        onClick={() => openConfirm(item._id)}
                      >
                        Ẩn/Xóa
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirm modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-black opacity-40" onClick={handleCancel} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Xác nhận ẩn / xóa</h3>
              <p className="text-sm text-gray-600 mb-4">Bạn có chắc muốn ẩn/xóa tin này? Hành động không thể hoàn tác.</p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  onClick={handleCancel}
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                  onClick={handleConfirm}
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
// ...existing code...