import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { ItemManagementPage } from "./pages/ItemManagementPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/items" element={<ItemManagementPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
