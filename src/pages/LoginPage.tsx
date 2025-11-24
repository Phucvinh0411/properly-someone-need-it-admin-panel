import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, sendOtp, user } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  async function handleSendOtp() {
    setError(null);
    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }
    setSendingOtp(true);
    try {
      await sendOtp(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Lỗi khi gửi OTP");
    }
    setSendingOtp(false);
  }

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    setError(null);
    if (!email || !otp) {
      setError("Vui lòng nhập email và mã OTP.");
      return;
    }
    setLoading(true);
    try {
      await login(email, otp);
      navigate("/admin");
    } catch (err: any) {
      setError(err?.message || "Lỗi khi đăng nhập");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (user) navigate("/admin");
  }, [navigate, user]);

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

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
            onClick={handleSendOtp}
            disabled={sendingOtp}
          >
            {sendingOtp ? "Gửi..." : sent ? "Gửi lại OTP" : "Gửi OTP"}
          </button>
          <div className="text-sm text-gray-500">Hoặc nhập mã nếu đã có</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mã OTP</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            disabled={loading}
          >
            {loading ? "Đang..." : "Đăng nhập"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
