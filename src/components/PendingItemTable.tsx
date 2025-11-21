import type { AdminItem } from "../types/item";

interface PendingItemTableProps {
  items: AdminItem[];
  onViewDetail: (item: AdminItem) => void;
}

export function PendingItemTable({ items, onViewDetail }: PendingItemTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Ảnh</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Tiêu đề</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Người bán</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Giá</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Ngày đăng</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map(item => (
            <tr key={item._id}>
              <td className="px-4 py-2">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt="thumb" className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Img</div>
                )}
              </td>
              <td className="px-4 py-2 font-medium">{item.title}</td>
              <td className="px-4 py-2">{item.seller?.fullName || "-"}</td>
              <td className="px-4 py-2">{item.price?.toLocaleString("vi-VN")} đ</td>
              <td className="px-4 py-2">{new Date(item.createdAt).toLocaleString()}</td>
              <td className="px-4 py-2">
                <button className="px-3 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600" onClick={() => onViewDetail(item)}>
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
