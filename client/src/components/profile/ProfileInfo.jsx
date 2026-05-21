// src/components/profile/ProfileInfo.jsx

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProfile,
  selectProfileUpdating,
  selectUpdateSuccess,
  clearUpdateSuccess,
} from "../../features/auth/profileSlice";
import {
  useUpdateProfile,
  useChangePassword,
} from "../../features/auth/profileApi";
import { useEffect } from "react";

const ProfileInfo = ({ userId }) => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const isUpdating = useSelector(selectProfileUpdating);
  const updateSuccess = useSelector(selectUpdateSuccess);

  const { mutate: updateProfile } = useUpdateProfile();
  const {
    mutate: changePassword,
    isPending: isChangingPassword,
    isSuccess: passwordChanged,
    error: passwordError,
  } = useChangePassword();

  // ─── Edit Profile State ───────────────────────────────
  const [isEditing, setIsEditing] = useState(false);

  // ✅ lazy initialization — no useEffect needed
  const [profileForm, setProfileForm] = useState(() => ({
    name: profile?.name || "",
    phone: profile?.phone || "",
  }));

  const [profileErrors, setProfileErrors] = useState({});

  // ─── Password State ───────────────────────────────────
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // ─── Sync form when profile loads ─────────────────────
  // ✅ only runs when isEditing opens — not on every render
  const handleOpenEdit = () => {
    setProfileForm({
      name: profile?.name || "",
      phone: profile?.phone || "",
    });
    setIsEditing(true);
  };

  // ─── Clear success after 3 seconds ────────────────────
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearUpdateSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, dispatch]);

  // ─── Profile Validation ───────────────────────────────
  const validateProfile = (name, value) => {
    switch (name) {
      case "name":
        return value.trim().length < 3
          ? "Name must be at least 3 characters!"
          : "";
      case "phone":
        return value && !/^\d{10}$/.test(value)
          ? "Enter valid 10 digit phone!"
          : "";
      default:
        return "";
    }
  };

  // ─── Password Validation ──────────────────────────────
  const validatePassword = (name, value) => {
    switch (name) {
      case "currentPassword":
        return !value ? "Current password is required!" : "";
      case "newPassword":
        return value.length < 6
          ? "Password must be at least 6 characters!"
          : "";
      case "confirmPassword":
        return value !== passwordForm.newPassword
          ? "Passwords do not match!"
          : "";
      default:
        return "";
    }
  };

  // ─── Handle Profile Change ────────────────────────────
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileErrors((prev) => ({
      ...prev,
      [name]: validateProfile(name, value),
    }));
  };

  // ─── Handle Password Change ───────────────────────────
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({
      ...prev,
      [name]: validatePassword(name, value),
    }));
  };

  // ─── Submit Profile ───────────────────────────────────
  const handleProfileSubmit = (e) => {
    e.preventDefault();

    const submitErrors = {
      name: validateProfile("name", profileForm.name),
      phone: validateProfile("phone", profileForm.phone),
    };

    setProfileErrors(submitErrors);
    if (Object.values(submitErrors).some((err) => err !== "")) return;

    updateProfile({
      userId,
      updatedData: {
        name: profileForm.name,
        phone: profileForm.phone,
      },
    });

    setIsEditing(false);
  };

  // ─── Submit Password ──────────────────────────────────
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    const submitErrors = {
      currentPassword: validatePassword(
        "currentPassword",
        passwordForm.currentPassword
      ),
      newPassword: validatePassword("newPassword", passwordForm.newPassword),
      confirmPassword: validatePassword(
        "confirmPassword",
        passwordForm.confirmPassword
      ),
    };

    setPasswordErrors(submitErrors);
    if (Object.values(submitErrors).some((err) => err !== "")) return;

    changePassword({
      userId,
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordForm(false);
  };

  // ─── Input class ──────────────────────────────────────
  const inputClass = (error) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
    ${
      error
        ? "border-red-400 focus:ring-red-300"
        : "border-slate-300 focus:ring-blue-400 focus:border-blue-400"
    }`;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Success Message ───────────────────────────────── */}
      {updateSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
          ✅ Profile updated successfully!
        </div>
      )}

      {/* ── Password Changed ──────────────────────────────── */}
      {passwordChanged && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
          ✅ Password changed successfully!
        </div>
      )}

      {/* ── Password Error ────────────────────────────────── */}
      {passwordError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {passwordError.message}
        </div>
      )}





      {/* ── Profile Info Card ─────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">
            Profile Information
          </h2>
          {!isEditing && (
            <button
              onClick={handleOpenEdit}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              ✏️ Edit
            </button>
          )}
        </div>

        {isEditing ? (

          /* ── Edit Form ────────────────────────────────── */
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                className={inputClass(profileErrors.name)}
              />
              {profileErrors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {profileErrors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="10 digit phone number"
                className={inputClass(profileErrors.phone)}
              />
              {profileErrors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {profileErrors.phone}
                </p>
              )}
            </div>

            {/* Email (read only) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition text-sm disabled:opacity-60"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setProfileErrors({});
                }}
                className="flex-1 border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-xl transition text-sm"
              >
                Cancel
              </button>
            </div>

          </form>

        ) : (

          /* ── View Mode ────────────────────────────────── */
          <div className="flex flex-col gap-3">

            {/* Name */}
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Full Name</span>
              <span className="text-sm font-medium text-slate-800">
                {profile?.name}
              </span>
            </div>

            {/* Email */}
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Email</span>
              <span className="text-sm font-medium text-slate-800">
                {profile?.email}
              </span>
            </div>

            {/* Phone */}
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Phone</span>
              <span className="text-sm font-medium text-slate-800">
                {profile?.phone || (
                  <span className="text-slate-400 italic">Not added</span>
                )}
              </span>
            </div>

            {/* Role */}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-500">Role</span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full
                ${
                  profile?.role === "admin"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {profile?.role === "admin" ? "👑 Admin" : "👤 User"}
              </span>
            </div>

          </div>
        )}

      </div>

      {/* ── Change Password Card ──────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">
            Change Password
          </h2>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              🔒 Change
            </button>
          )}
        </div>

        {showPasswordForm ? (

          /* ── Password Form ──────────────────────────── */
          <form
            onSubmit={handlePasswordSubmit}
            className="flex flex-col gap-4"
          >

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className={inputClass(passwordErrors.currentPassword)}
              />
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Min 6 characters"
                className={inputClass(passwordErrors.newPassword)}
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Repeat new password"
                className={inputClass(passwordErrors.confirmPassword)}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition text-sm disabled:opacity-60"
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordErrors({});
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="flex-1 border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-xl transition text-sm"
              >
                Cancel
              </button>
            </div>

          </form>

        ) : (

          /* ── Password View ──────────────────────────── */
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-slate-500">Password</span>
            <span className="text-sm font-medium text-slate-800">
              ••••••••
            </span>
          </div>

        )}

      </div>

    </div>
  );
};

export default ProfileInfo;