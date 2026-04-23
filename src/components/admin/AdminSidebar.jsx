import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const navLinks = [
  { path: "/admin", label: "Dashboard", icon: "📊" },
  { path: "/admin/products", label: "Products", icon: "📦" },
  { path: "/admin/orders", label: "Orders", icon: "📋" },
  { path: "/admin/users", label: "Users", icon: "👥" },
];

const AdminSidebar = ({ isOpen, onClose, }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-screen w-64 z-30
        bg-white border-r border-slate-200
        flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:sticky lg:top-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >

        
        <div className="px-6 py-5 border-b border-slate-200">
          <h1 className="text-lg font-extrabold text-slate-800">
            ⚡ Sparkifyer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Admin Panel</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Welcome back, {user?.name} 
          </p>
        </div>

        
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
                ${isActive(link.path)
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
              {isActive(link.path) && (
                <span className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;