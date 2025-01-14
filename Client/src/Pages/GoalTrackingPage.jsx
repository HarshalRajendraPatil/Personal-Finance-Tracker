import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import GoalModal from "../Components/GoalModal";

const GoalTrackingPage = () => {
  const [goals, setGoals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    name: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedGoal, setSelectedGoal] = useState(null);

  const fetchGoals = async (page = 1) => {
    try {
      const response = await axiosInstance.get(`/goals`, {
        params: {
          page,
          ...filters,
        },
      });
      console.log(response.data.data);
      setGoals(response.data.data);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch goals", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Do you want to delete your goal")) {
      try {
        await axiosInstance.delete(`/goals/${id}`);
        setGoals((prev) => prev.filter((goal) => goal._id !== id));
      } catch {
        (err) => {
          console.log(err);
        };
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const openModal = (type, goal = null) => {
    setModalType(type);
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGoal(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchGoals(page);
  };

  const handleAddGoal = async (goalData) => {
    try {
      await axiosInstance.post("/goals", goalData);
      fetchGoals(currentPage);
      closeModal();
    } catch (error) {
      console.error("Failed to add goal", error);
    }
  };

  useEffect(() => {
    fetchGoals(currentPage);
  }, [currentPage, filters]);

  const completedGoals =
    goals.length > 0 ? goals.filter((goal) => goal.status == "completed") : [];
  const activeGoals =
    goals.length > 0 ? goals.filter((goal) => goal.status == "active") : [];

  return (
    <div className="p-6 w-full bg-gray-100 mx-auto min-h-screen">
      {/* Header Section */}
      <div className="py-0 mb-6">
        <h1 className="text-2xl font-bold mb-4">Budget Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Goals</h2>
            <p className="text-2xl font-bold">{goals.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Goals Completed</h2>
            <p className="text-2xl font-bold text-green-500">
              {completedGoals.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Goals Active</h2>
            <p className="text-2xl font-bold text-red-500">
              {activeGoals.length}
            </p>
          </div>
        </div>

        <div className="my-3">
          <button
            onClick={() => openModal("add")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Goal
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <input
          type="text"
          name="name"
          placeholder="Search goals..."
          value={filters.name}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3"
        />
        <div className="flex gap-4 flex-wrap">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Goal Cards */}
      {goals.length === 0 ? (
        <h1>No goals available! Create one now</h1>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div
                key={goal._id}
                className={`shadow-lg rounded-lg p-6 ${
                  goal.status === "completed"
                    ? "bg-gradient-to-r from-green-100 to-green-50 border-green-300"
                    : goal.status === "overdue"
                    ? "bg-gradient-to-r from-red-100 to-red-50 border-red-300"
                    : "bg-gradient-to-r from-red-100 to-red-50 border-red-300"
                } border`}
              >
                {/* Status Header */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-3xl ${
                      goal.status === "completed"
                        ? "text-green-600"
                        : goal.status === "overdue"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                    title={
                      goal.status.charAt(0).toUpperCase() + goal.status.slice(1)
                    }
                  >
                    {goal.status === "completed" ? "✅" : "🔴"}
                  </span>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      goal.status === "completed"
                        ? "text-green-700"
                        : goal.status === "overdue"
                        ? "text-red-700"
                        : "text-yellow-700"
                    }`}
                  >
                    {goal.status}
                  </span>
                </div>

                {/* Goal Details */}
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {goal.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Target:</span> $
                  {goal.targetAmount}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Saved:</span> $
                  {goal.currentAmount}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Remaining:</span> $
                  {goal.targetAmount - goal.currentAmount}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Deadline:</span>{" "}
                  {new Date(goal.deadline).toLocaleDateString()}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full ${
                      goal.status === "completed"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${goal.percentageComplete}%` }}
                  ></div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between flex-wrap gap-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
                    onClick={() => openModal("edit", goal)}
                  >
                    Edit
                  </button>
                  <button
                    disabled={goal.targetAmount == goal.currentAmount}
                    className="bg-gray-500 disabled:opacity-50 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600"
                    onClick={() => openModal("contribute", goal)}
                  >
                    Contribute
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700"
                    onClick={() => handleDelete(goal._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center gap-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
      {/* Modal */}
      {isModalOpen && (
        <GoalModal
          setGoal={setGoals}
          type={modalType}
          goal={selectedGoal}
          onClose={closeModal}
          onAction={modalType === "add" ? handleAddGoal : fetchGoals}
        />
      )}
    </div>
  );
};

export default GoalTrackingPage;
