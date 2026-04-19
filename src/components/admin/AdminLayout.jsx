// src/components/admin/AdminLayout.jsx

import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useGetDashboardStats } from "../../features/admin/adminApi";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useGetDashboardStats();

  const handleNavigate = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ✅ Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* ✅ ml-0 mobile, ml-64 desktop */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0 min-w-0">

        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;