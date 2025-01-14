import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import ProfileEditModal from "../Components/ProfileEditModal";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/me");
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
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

  useEffect(() => {
    fetchProfile();
  }, []);

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

      <div className="my-3">
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Edit Profile
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
            Financial Summary
          </h2>
          <p className="text-gray-600">
            <strong>Total Income:</strong> ${user.totalIncome}
          </p>
          <p className="text-gray-600">
            <strong>Total Expense:</strong> ${user.totalExpense}
          </p>
          <p className="text-gray-600">
            <strong>Remaining Balance:</strong>{" "}
            <span className="text-green-600 font-bold">
              ${user.totalIncome - user.totalExpense}
            </span>
          </p>
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Activity Overview
          </h2>
          <p className="text-gray-600">
            <strong>Transactions:</strong> {user.transactionCount}
          </p>
          <p className="text-gray-600">
            <strong>Budgets Set:</strong> {user.budgetCount}
          </p>
          <p className="text-gray-600">
            <strong>Goals Achieved:</strong> {user.goalsAchieved}
          </p>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Your Goals
          </h2>
          {[].length > 0 ? (
            <ul className="space-y-3">
              {[].map((goal, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{goal.title}</span>
                  <span
                    className={`text-sm px-3 py-1 rounded-lg ${
                      goal.isAchieved
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {goal.isAchieved ? "Achieved" : "In Progress"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No goals set yet.</p>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Notifications
          </h2>
          {[].length > 0 ? (
            <ul className="space-y-3">
              {[].slice(0, 5).map((notification, index) => (
                <li key={index} className="text-gray-700">
                  {notification.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No notifications available.</p>
          )}
        </div>
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
