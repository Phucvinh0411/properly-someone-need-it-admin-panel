import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Add this import
import { DashboardPage } from "./pages/DashboardPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { ItemManagementPage } from "./pages/ItemManagementPage";
import { PendingApprovalPage } from "./pages/PendingApprovalPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Protected (Trong Layout) */}
      <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="items" element={<ItemManagementPage />} />
        <Route path="pending-items" element={<PendingApprovalPage />} />
      </Route>
    </Routes>
  );
}

export default App;
