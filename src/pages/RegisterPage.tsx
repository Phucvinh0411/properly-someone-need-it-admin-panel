import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import * as authApi from "../api/authApi";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      await authApi.register({ name, email, password });
      // On success redirect to login
      navigate('/login', { replace: true });
    } catch (err: any) {
      setError(err?.message || "Lỗi khi đăng ký");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <input
            type="password"
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
          <input
            type="password"
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            disabled={loading}
          >
            {loading ? "Đang..." : "Đăng ký"}
          </button>
          <button type="button" className="text-sm text-gray-500 hover:underline" onClick={() => navigate('/login')}>
            Đã có tài khoản?
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
