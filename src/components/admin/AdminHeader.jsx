// src/components/admin/AdminHeader.jsx

import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";



const AdminHeader = ({ onMenuClick }) => {
  
  const { user, logout } = useAuth();


  return (
    <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-10">

      {/* ── Left → Hamburger + Title ──────────────────── */}
      <div className="flex items-center gap-3">

        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition text-slate-600"
        >
          ☰
        </button>

      </div>

      {/* ── Right → Admin Info ────────────────────────── */}
      <div className="flex items-center gap-2">

        <Link
          to="/profile"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl transition"
          style={{
            background: "rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(0,0,0,0.08)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(0,0,0,0.04)")
          }
        >
          {/* Avatar */}
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800 leading-none">
              {user?.name}
            </p>
            <p className="text-xs text-slate-400 leading-none mt-0.5">
              Admin
            </p>
          </div>
        </Link>


        {/* Logout button */}
        <button
          onClick={logout}
          className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-xl transition border border-red-200"
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default AdminHeader;