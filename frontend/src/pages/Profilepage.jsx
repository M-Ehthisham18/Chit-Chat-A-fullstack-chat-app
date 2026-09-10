import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthSotre";
import { Camera, Mail, User, Loader, Key, Edit2, X, Check } from "lucide-react";

const Profilepage = () => {
  const { authUser, isUpdatingProfile, updateProfile, deleteAccount, isAccountDeleting } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState("");

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(authUser?.fullname || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleNameSubmit = async () => {
    if (!nameValue.trim() || nameValue.trim().length < 2) {
      return;
    }
    await updateProfile({ fullname: nameValue });
    setIsEditingName(false);
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAccount = async () => {
    if (!password) return;

    await deleteAccount(password);
    setIsDeleteModalOpen(false);
    setPassword("");
  };

  return (
    <div className="h-auto pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
                onError={(e) => {
                  e.currentTarget.src = "/avatar.png";
                }}
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Info Section */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <div className="relative group">
                {isEditingName ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2.5 bg-base-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={handleNameSubmit}
                      disabled={isUpdatingProfile}
                      className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-focus disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setNameValue(authUser?.fullname || "");
                      }}
                      className="p-2.5 bg-base-content text-base-200 rounded-lg hover:bg-zinc-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-4 py-2.5 bg-base-200 rounded-lg border group">
                    <p>{authUser?.fullname}</p>
                    <button
                      onClick={() => {
                        setNameValue(authUser?.fullname || "");
                        setIsEditingName(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-base-300 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                {authUser?.isGuest ? <Key className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                {authUser?.isGuest ? "Guest ID" : "Email Address"}
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.isGuest ? authUser?.guestId : authUser?.email}
              </p>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
              <button
                className="inline-block rounded bg-red-500 px-4 py-2 hover:bg-red-600 transition duration-200"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {
            isAccountDeleting ? <Loader /> : <div className="bg-base-300 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Account Deletion</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your password to confirm account deletion.
            </p>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 border-2 rounded-lg hover:bg-gray-400 transition duration-200"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-white transition duration-200 ${
                  password ? "bg-red-500 hover:bg-red-600" : "bg-red-300 cursor-not-allowed"
                }`}
                onClick={confirmDeleteAccount}
                disabled={!password}
              >
                Confirm Delete
              </button>
            </div>
          </div>
          }
        </div>
      )}
    </div>
  );
};

export default Profilepage;
