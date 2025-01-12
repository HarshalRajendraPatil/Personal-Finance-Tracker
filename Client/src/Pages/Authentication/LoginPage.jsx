import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error on user input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("Login Data:", formData);
    try {
      const response = await axiosInstance.post(
        "/authentication/login",
        formData
      );
      console.log(response);
      navigate("/");
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
          Welcome Back
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-800"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-800"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          <Link
            to={"/forgot-password"}
            className="text-purple-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
