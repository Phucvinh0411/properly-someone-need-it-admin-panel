import React from "react";
import type { ReactNode } from "react";

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-md bg-green-600 flex items-center justify-center text-white font-bold">AD</div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-500">Quản trị hệ thống</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
