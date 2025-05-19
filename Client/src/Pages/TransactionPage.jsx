import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "tailwindcss/tailwind.css";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: { start: "", end: "" },
    category: "",
    type: "",
    search: "",
  });
  const [overview, setOverview] = useState(null);
  const [category, setCategory] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    _id: null,
    date: "",
    category: "",
    description: "",
    amount: "",
    type: "",
  });

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/transaction`, {
          params: filters,
        });
        setTransactions(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactions();
  }, [filters]);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axiosInstance.get(`/analytics/overview`);
        setOverview(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategoryBreakdown = async () => {
      try {
        const res = await axiosInstance.get(`/analytics/category`);
        setCategory(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTrend = async () => {
      axiosInstance
        .get("/analytics/trends")
        .then((res) => setTrendsData(res.data.data));
    };

    fetchOverview();
    fetchCategoryBreakdown();
    fetchTrend();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleModalOpen = (transaction) => {
    setModalData(transaction || modalData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalData({
      _id: null,
      date: "",
      category: "",
      description: "",
      amount: "",
      type: "",
    });
  };

  const handleSaveTransaction = async () => {
    try {
      const method = modalData._id ? "put" : "post";
      const url = modalData._id
        ? `/transaction/${modalData._id}`
        : "/transaction";

      await axiosInstance[method](url, modalData);

      setTransactions((prev) => {
        if (modalData._id == "put") {
          return prev;
        }
        return [modalData, ...prev];
      });

      handleModalClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axiosInstance.delete(`/transaction/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const pieData = {
    labels: category?.map((cat) => cat._id),
    datasets: [
      {
        label: "Amount spent",
        data: category?.map((cat) => cat.totalSpent),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const pieOptions = {
    type: "pie",
    data: pieData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Chart.js Pie Chart",
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800">Transactions</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={() => handleModalOpen()}
      >
        Add Transaction
      </button>

      {/* Filters Section */}
      <div className="flex flex-wrap mt-6 gap-4 bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Search by description"
          className="border rounded px-4 py-2 flex-grow"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        <select
          className="border rounded px-4 py-2"
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="food">Food</option>
          <option value="travel">Travel</option>
        </select>
        <select
          className="border rounded px-4 py-2"
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="border rounded px-4 py-2"
            value={filters.dateRange.start}
            onChange={(e) =>
              handleFilterChange("dateRange", {
                ...filters.dateRange,
                start: e.target.value,
              })
            }
          />
          <span>to</span>
          <input
            type="date"
            className="border rounded px-4 py-2"
            value={filters.dateRange.end}
            onChange={(e) =>
              handleFilterChange("dateRange", {
                ...filters.dateRange,
                end: e.target.value,
              })
            }
          />
        </div>
        <button
          onClick={() => setFilters({})}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Filters
        </button>
      </div>

      {/* Transactions Table */}
      <div className="mt-6 bg-white p-4 rounded shadow overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b">
                  <td className="px-4 py-2">
                    {transaction?.date.split("T")[0]}
                  </td>
                  <td className="px-4 py-2">{transaction?.category}</td>
                  <td className="px-4 py-2">{transaction?.description}</td>
                  <td
                    className={`px-4 py-2 font-bold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ${transaction?.amount || 0}
                  </td>
                  <td className="px-4 py-2">{transaction?.type}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleModalOpen(transaction)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteTransaction(transaction._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">
              {modalData._id ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <input
              type="date"
              value={modalData.date}
              onChange={(e) =>
                setModalData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="border rounded px-4 py-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Category"
              value={modalData.category}
              onChange={(e) =>
                setModalData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="border rounded px-4 py-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={modalData.description}
              onChange={(e) =>
                setModalData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="border rounded px-4 py-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Amount"
              value={modalData.amount}
              onChange={(e) =>
                setModalData((prev) => ({ ...prev, amount: e.target.value }))
              }
              className="border rounded px-4 py-2 w-full mb-2"
            />
            <select
              value={modalData.type}
              onChange={(e) =>
                setModalData((prev) => ({ ...prev, type: e.target.value }))
              }
              className="border rounded px-4 py-2 w-full mb-2"
            >
              <option value="">Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveTransaction}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="mt-6 bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Income</h3>
          <p className="text-2xl text-green-600 font-bold">
            ${overview?.totalIncome?.toFixed(2) || 0}
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Expenses
          </h3>
          <p className="text-2xl text-red-600 font-bold">
            ${overview?.totalExpense?.toFixed(2) || 0}
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Net Balance</h3>
          <p className="text-2xl text-blue-600 font-bold">
            ${overview?.netSavings?.toFixed(2) || 0}
          </p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mt-6 grid grid-cols-1 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
          <div className="w-full max-w-sm mx-auto">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Income vs Expenses
          </h2>
          <Bar
            data={{
              labels: trendsData.map(
                (item) => item._id.toString().split("T")[0]
              ),
              datasets: [
                {
                  label: "Expenses",
                  data: trendsData.map((item) => item.totalExpense),
                  backgroundColor: "#FF5722",
                },
                {
                  label: "Income",
                  data: trendsData.map((item) => item.totalIncome),
                  backgroundColor: "#4CAF50",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
