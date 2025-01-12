import React, { useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import { useParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(false);
    setSuccess("");
    console.log("New Password:", newPassword);
    try {
      const response = await axiosInstance.post(
        `/authentication/reset-password/${params.resetToken}`,
        { newPassword }
      );
      setSuccess(response.data.data);
      console.log(response);
    } catch (err) {
      console.log(err);
      setLoading(false);
      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Reset Password
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-800"
              required
            />
          </div>
          {success && (
            <div className="mb-4 text-green-600 text-sm text-center">
              {success}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
