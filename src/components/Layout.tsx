import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Add this import

export const Layout = () => {
  const location = useLocation();
  const { user, logout } = useAuth(); // Add this
  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    await logout();
    // Navigation will be handled by AuthContext or redirect to /login
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
        <div className="px-6 py-5 text-xl font-bold border-b border-white/10 tracking-wide">
          Admin Panel
        </div>
        <nav className="flex flex-col gap-1 px-2 py-4">
          <Link
            to="/admin"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              location.pathname === "/admin" ? "bg-gray-800" : "text-gray-200"
            }`}
          >
            Trang chủ
          </Link>

          <Link
            to="/admin/users"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive("/admin/users")
                ? "bg-gray-800 text-white"
                : "text-gray-200"
            }`}
          >
            Người dùng
          </Link>

          <Link
            to="/admin/items"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive("/admin/items")
                ? "bg-gray-800 text-white"
                : "text-gray-200"
            }`}
          >
            Sản phẩm
          </Link>

          <Link
            to="/admin/pending-items"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive("/admin/pending-items")
                ? "bg-gray-800 text-white"
                : "text-gray-200"
            }`}
          >
            Duyệt bán
          </Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wide">Trang quản trị</h1>
          <div className="flex items-center gap-4"> {/* Add user info and logout */}
            <span className="text-sm text-gray-700">Xin chào, {user?.fullName || 'Admin'}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <section className="px-8 py-6 flex-1">
          <Outlet /> {/* 🟢 RENDER PAGE CON Ở ĐÂY */}
        </section>
      </main>
    </div>
  );
};
