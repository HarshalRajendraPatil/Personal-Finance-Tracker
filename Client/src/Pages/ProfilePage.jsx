import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import ProfileEditModal from "../Components/ProfileEditModal";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [overview, setOverview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState("");

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/me");
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const fetchOverview = async () => {
    try {
      const response = await axiosInstance.get("/analytics/overview");
      setOverview(response.data.data);
    } catch (error) {
      console.error("Failed to fetch financial summary", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await axiosInstance.put("/user/me", updatedData);
      setUser(response.data.data);
      closeModal();
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.delete("/user/me");
      setUser("");
      navigate("/login");
    } catch (error) {
      console.log(`Error while deleting the user, ${error}`);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordChangeError("");
    setPasswordChangeSuccess("");

    try {
      await axiosInstance.post("/user/me/change-password", {
        currentPassword,
        password: newPassword,
      });
      setPasswordChangeSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setPasswordChangeError(
        error.response?.data?.message || "Failed to change password."
      );
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchOverview();
  }, []);

  console.log(overview);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-full mx-auto min-h-screen bg-gray-100">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="my-3 gap-4 flex flex-wrap items-center">
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Edit Profile
        </button>
        <button
          onClick={handleDeleteUser}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Delete my account
        </button>
      </div>

      {/* Profile Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* User Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            User Details
          </h2>
          <p className="text-gray-600">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-600">
            <strong>Preferred Currency:</strong> {user.currency}
          </p>
          <p className="text-gray-600">
            <strong>Account Created:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            <p>Financial Summary</p>
            <span className="text-xs">
              (calculated based on the transactions you made)
            </span>
          </h2>
          <p className="text-gray-600">
            <strong>Total Income:</strong> ${overview?.totalIncome}
          </p>
          <p className="text-gray-600">
            <strong>Total Expense:</strong> ${overview?.totalExpense}
          </p>
          <p className="text-gray-600">
            <strong>Remaining Balance:</strong>{" "}
            <span
              className={`text-${
                overview?.netSavings > 0 ? "green" : "red"
              }-600 font-bold`}
            >
              ${overview?.netSavings}
            </span>
          </p>
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Activity Overview
          </h2>
          <p className="text-gray-600">
            <strong>Transactions:</strong> {user?.totalTransactions}
          </p>
          <p className="text-gray-600">
            <strong>Budgets Set:</strong> {user?.totalBudgets}
          </p>
          <p className="text-gray-600">
            <strong>Goals Set:</strong> {user?.totalGoals}
          </p>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label
              className="block text-gray-700 mb-2"
              htmlFor="current-password"
            >
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="new-password">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          {passwordChangeError && (
            <p className="text-red-600 text-sm">{passwordChangeError}</p>
          )}
          {passwordChangeSuccess && (
            <p className="text-green-600 text-sm">{passwordChangeSuccess}</p>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ProfileEditModal
          user={user}
          onClose={closeModal}
          onUpdate={handleUpdateProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;
