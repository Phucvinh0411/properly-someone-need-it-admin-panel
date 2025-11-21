import type { AdminUser } from "../types/user";

interface UserTableProps {
  users: AdminUser[];
  onToggleBan: (userId: string) => void;
}

export const UserTable = ({ users, onToggleBan }: UserTableProps) => {
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
            const isLowTrust = user.trustScore < 50;
            return (
              <tr key={user._id} className={user.isBanned ? "bg-red-50" : ""}>
                <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-800">{user.fullName}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700">{user.phone}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700">{user.address.city}</td>
                <td className={`px-4 py-2 whitespace-nowrap ${isLowTrust ? "text-red-500 font-bold" : "text-gray-700"}`}>{user.trustScore}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700">{user.rating.toFixed(1)} ({user.reviewCount})</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700">{user.successfulTrades} / {user.cancelledTrades}</td>
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