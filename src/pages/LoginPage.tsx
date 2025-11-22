import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import * as authApi from "../api/authApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      // expect { accessToken, user }
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        navigate("/admin");
      } else {
        throw new Error(data?.message || "Đăng nhập thất bại");
      }
    } catch (err: any) {
      setError(err?.message || "Lỗi khi đăng nhập");
    }
    setLoading(false);
  }

  // If already logged in, redirect (useEffect to avoid navigating during render)
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang..." : "Đăng nhập"}
          </button>
          <button type="button" className="text-sm text-gray-500 hover:underline" onClick={() => navigate('/register')}>
            Đăng ký
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
