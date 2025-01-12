import React, { useState, useEffect, useMemo } from "react";
import { Pie, Bar } from "react-chartjs-2";
import axiosInstance from "../config/axiosConfig";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    budgetLimit: 0,
    currentSpent: 0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    // Fetch budgets from API
    const fetchBudgets = async () => {
      try {
        const response = await axiosInstance.get("/budgets");
        setBudgets(response.data.data);
        setFilteredBudgets(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    fetchBudgets();
  }, []);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredBudgets.length / resultsPerPage);
  }, [filteredBudgets, resultsPerPage]);

  const paginatedBudgets = useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return filteredBudgets.slice(startIndex, endIndex);
  }, [filteredBudgets, currentPage, resultsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleResultsPerPageChange = (e) => {
    setResultsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const handleAddEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedBudget) {
        // Edit budget
        await axiosInstance.put(`/budgets/${selectedBudget._id}`, formData);
      } else {
        // Add new budget
        await axiosInstance.post("/budgets", formData);
      }
      setShowAddEditModal(false);
      setFormData({
        name: "",
        category: "",
        budgetLimit: 0,
        currentSpent: 0,
        startDate: "",
        endDate: "",
      });
      setSelectedBudget(null);
      // Refresh budget list
      const response = await axiosInstance.get("/budgets");
      setBudgets(response.data.data);
      setFilteredBudgets(response.data.data);
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axiosInstance.delete(`/budgets/${id}`);
        setBudgets((prev) => prev.filter((budget) => budget.id !== id));
        setFilteredBudgets((prev) => prev.filter((budget) => budget.id !== id));
      } catch (error) {
        console.error("Error deleting budget:", error);
      }
    }
  };

  const budgetSummary = useMemo(() => {
    const totalAllocated = budgets.reduce(
      (sum, budget) => sum + budget.budgetLimit,
      0
    );
    const totalSpent = budgets.reduce(
      (sum, budget) => sum + budget.currentSpent,
      0
    );
    const totalRemaining = totalAllocated - totalSpent;
    return { totalAllocated, totalSpent, totalRemaining };
  }, [budgets]);

  const pieChartData = useMemo(() => {
    return {
      labels: budgets.map((budget) => budget.name),
      datasets: [
        {
          data: budgets.map((budget) => budget.budgetLimit),
          backgroundColor: [
            "#4CAF50",
            "#FF5722",
            "#FFC107",
            "#03A9F4",
            "#E91E63",
          ],
        },
      ],
    };
  }, [budgets]);

  const barChartData = useMemo(() => {
    return {
      labels: budgets.map((budget) => budget.name),
      datasets: [
        {
          label: "Spent Amount",
          data: budgets.map((budget) => budget.currentSpent),
          backgroundColor: "#03A9F4",
        },
      ],
    };
  }, [budgets]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Budget Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Allocated</h2>
          <p className="text-2xl font-bold">${budgetSummary.totalAllocated}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Spent</h2>
          <p className="text-2xl font-bold text-red-500">
            ${budgetSummary.totalSpent}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Remaining</h2>
          <p className="text-2xl font-bold text-green-500">
            ${budgetSummary.totalRemaining}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowAddEditModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Budget
        </button>
      </div>

      <div className="p-0 bg-gray-100  overflow-x-scroll">
        <select
          value={resultsPerPage}
          onChange={handleResultsPerPageChange}
          className="p-2 border border-gray-300 rounded my-4"
        >
          <option value={10}>10 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>

        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Allocated</th>
              <th className="p-2 border">Spent</th>
              <th className="p-2 border">Remaining</th>
              <th className="p-2 border">Duration</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBudgets.map((budget) => (
              <tr key={budget._id}>
                <td className="p-2 border">{budget.name}</td>
                <td className="p-2 border">{budget.category}</td>
                <td className="p-2 border">${budget.budgetLimit}</td>
                <td className="p-2 border text-red-500">
                  ${budget.currentSpent}
                </td>
                <td className="p-2 border text-green-500">
                  ${budget.budgetLimit - budget.currentSpent}
                </td>
                <td className="p-2 border">
                  {budget.startDate.split("T")[0]} to{" "}
                  {budget.endDate.split("T")[0]}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => {
                      setSelectedBudget(budget);
                      setFormData({ ...budget });
                      setShowAddEditModal(true);
                    }}
                    className="text-blue-500 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    page === currentPage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </div>
      </div>
      {showAddEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 w-4/5 rounded shadow max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {selectedBudget ? "Edit Budget" : "Add New Budget"}
            </h2>
            <form onSubmit={handleAddEditSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Allocated Amount</label>
                <input
                  type="number"
                  value={formData.budgetLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, budgetLimit: +e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Allocated Amount</label>
                <input
                  type="number"
                  value={formData.currentSpent}
                  onChange={(e) =>
                    setFormData({ ...formData, currentSpent: +e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  required={!selectedBudget}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  required={!selectedBudget}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEditModal(false);
                    setSelectedBudget(null);
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Budget Allocation</h3>
          <div className="w-full max-w-sm mx-auto">
            <Pie data={pieChartData} />
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Spending Trends</h3>
          <Bar data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
