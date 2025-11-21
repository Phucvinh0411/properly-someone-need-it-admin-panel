import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
        <div className="px-6 py-5 text-xl font-bold border-b border-white/10 tracking-wide">Admin Panel</div>
        <nav className="flex flex-col gap-1 px-2 py-4">
          <Link
            to="/admin"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${location.pathname === "/admin" || location.pathname === "/" ? "bg-gray-800 text-white" : "text-gray-200 hover:bg-gray-800/60"}`}
          >
            Trang chủ
          </Link>
          <Link
            to="/admin/users"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive("/admin/users") ? "bg-gray-800 text-white" : "text-gray-200 hover:bg-gray-800/60"}`}
          >
            Người dùng
          </Link>
          <Link
            to="/admin/items"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive("/admin/items") ? "bg-gray-800 text-white" : "text-gray-200 hover:bg-gray-800/60"}`}
          >
            Sản phẩm
          </Link>
          <Link
            to="/admin/pending-items"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive("/admin/pending-items") ? "bg-gray-800 text-white" : "text-gray-200 hover:bg-gray-800/60"}`}
          >
            Duyệt bán
          </Link>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wide">Trang quản trị</h1>
        </header>
        <section className="px-8 py-6 flex-1">{children}</section>
      </main>
    </div>
  );
};