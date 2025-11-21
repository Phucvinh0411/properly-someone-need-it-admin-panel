import type { AdminItem, ItemStatus } from "../types/item";

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
  return (
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
            const thumbnail = item.images[0];
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
                <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.price.toLocaleString("vi-VN")} đ</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.sellerId}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${item.status === "ACTIVE" ? "bg-green-100 text-green-700" : item.status === "PENDING" ? "bg-blue-100 text-blue-700" : item.status === "DELETED" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>{statusLabel[item.status]}</span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.views} / {item.favoritesCount}</td>
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
                      onClick={() => onChangeStatus(item._id, "DELETED")}
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
  );
};