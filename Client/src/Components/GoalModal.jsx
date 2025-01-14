import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";

const GoalModal = ({ type, goal, setGoal, onClose, onAction }) => {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    currentAmount: "",
  });

  useEffect(() => {
    if (type === "edit" && goal) {
      setFormData({
        name: goal.name || "",
        targetAmount: goal.targetAmount || "",
        deadline: goal.deadline
          ? new Date(goal.deadline).toISOString().split("T")[0]
          : "",
      });
    } else if (type === "contribute" && goal) {
      setFormData({ currentAmount: "" });
    } else {
      setFormData({
        name: "",
        targetAmount: "",
        deadline: "",
        currentAmount: "",
      });
    }
  }, [type, goal]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (type === "add") {
        // API call to create a new goal
        const response = await axiosInstance.post("/goals", {
          name: formData.name,
          targetAmount: formData.targetAmount,
          deadline: formData.deadline,
        });
        setGoal((prev) => [response.data.data, ...prev]);
      } else if (type === "edit") {
        // API call to update an existing goal
        await axiosInstance.put(`/goals/${goal._id}`, {
          name: formData.name,
          targetAmount: formData.targetAmount,
          deadline: formData.deadline,
        });
      } else if (type === "contribute") {
        // API call to contribute to a goal
        await axiosInstance.post(`/goals/${goal._id}/contribute`, {
          amount: formData.currentAmount,
        });
      }
      onAction(); // Refresh the goal list
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error handling form submission:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          {type === "add"
            ? "Add New Goal"
            : type === "edit"
            ? "Edit Goal"
            : "Contribute to Goal"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {type !== "contribute" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter goal title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Target Amount ($)
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter target amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </>
          )}
          {type === "contribute" && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Contribution Amount ($)
              </label>
              <input
                type="number"
                name="currentAmount"
                value={formData.currentAmount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Enter contribution amount"
                required
              />
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none ${
                type === "contribute"
                  ? "bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-400"
                  : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
              }`}
            >
              {type === "add"
                ? "Add Goal"
                : type === "edit"
                ? "Save Changes"
                : "Contribute"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
