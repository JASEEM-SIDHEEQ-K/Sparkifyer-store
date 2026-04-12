// src/pages/Profile.jsx

import { useState } from "react";
import { useGetProfile } from "../features/auth/profileApi";
import { useSelector } from "react-redux";
import { selectProfile } from "../features/auth/profileSlice";
import ProfileInfo from "../components/profile/ProfileInfo";
import OrderHistory from "../components/profile/OrderHistory";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";


const tabs = [
  { id: "profile", label: "👤 Profile Info" },
  { id: "orders", label: "📦 Order History" },
];

const Profile = () => {
  const { user, logout } = useAuth();
  const profile = useSelector(selectProfile);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate()



  // ─── Fetch Profile ─────────────────────────────────────
  const { isLoading } = useGetProfile(user?.id);


  
  // ─── Avatar initials ───────────────────────────────────
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ─── Loading State ─────────────────────────────────────
  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* ── Profile Header Card ───────────────────────── */}
        <div className="bg-gradient-to-br from-blue-700 to-slate-800 rounded-2xl p-6 text-white shadow-md">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">

            {/* ── Avatar ──────────────────────────────────── */}
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-extrabold border-2 border-white/30 flex-shrink-0">
              {getInitials(profile?.name || user?.name)}
            </div>

            {/* ── User Info ───────────────────────────────── */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl font-bold">
                {profile?.name || user?.name}
              </h1>
              <p className="text-blue-200 text-sm mt-0.5">
                {profile?.email || user?.email}
              </p>

              {/* Role + Phone */}
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {profile?.role === "admin" ? "👑 Admin" : "👤 User"}
                </span>
                {profile?.phone && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                    📞 {profile.phone}
                  </span>
                )}
              </div>
            </div>

            {/* ── Logout Button ───────────────────────────── */}
            <button
              onClick={logout}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
            >
              Logout
            </button>

            <button
              onClick={() => navigate('/')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
            >
              Home
            </button>
            

          </div>
        </div>




        {/* ── Tabs ──────────────────────────────────────── */}
        <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition
                ${activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ───────────────────────────────── */}
        {activeTab === "profile" ? (
          <ProfileInfo userId={user?.id} />
        ) : (
          <OrderHistory userId={user?.id} />
        )}

      </div>
    </div>
    </>
  );
};

export default Profile;