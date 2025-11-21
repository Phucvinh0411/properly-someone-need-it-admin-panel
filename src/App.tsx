import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { ItemManagementPage } from "./pages/ItemManagementPage";
import { PendingApprovalPage } from "./pages/PendingApprovalPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/items" element={<ItemManagementPage />} />
        <Route path="/admin/pending-items" element={<PendingApprovalPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
