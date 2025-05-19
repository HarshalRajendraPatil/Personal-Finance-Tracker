import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { FaPlus, FaWallet, FaBullseye } from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const DashboardPage = () => {
  const [overview, setOverview] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryWiseData, setCategoryWiseData] = useState([]);
  const [trendsData, setTrendsData] = useState([]);

  useEffect(() => {
    // Fetch Overview
    axiosInstance
      .get("/analytics/overview")
      .then((res) => setOverview(res.data.data));
    // Fetch Recent Transactions
    axiosInstance
      .get("/analytics/top-transactions?limit=5")
      .then((res) => setRecentTransactions(res.data.data));
    // Fetch Category-Wise Data
    axiosInstance
      .get("/analytics/category")
      .then((res) => setCategoryWiseData(res.data.data));
    // Fetch Trends Data
    axiosInstance
      .get("/analytics/trends")
      .then((res) => setTrendsData(res.data.data));
  }, []);

  const data = {
    labels: categoryWiseData.map((category) => category._id),
    datasets: [
      {
        data: categoryWiseData.map((category) => category.totalSpent),
        backgroundColor: [
          "#FF5722",
          "#03A9F4",
          "#8BC34A",
          "#FFEB3B",
          "#673AB7",
          "#FF9800",
          "#9C27B0",
          "#3F51B5",
          "#607D8B",
          "#FFC107",
          "#FF6F61",
          "#E91E63",
          "#009688",
          "#9E9E9E",
          "#F44336",
          "#4CAF50",
          "#FF9800",
          "#D32F2F",
          "#00BCD4",
          "#FFCCBC",
          "#FFD54F",
          "#9C27B0",
          "#FFB74D",
          "#BDBDBD",
        ],
      },
    ],
  };
  const options = {
    type: "pie",
    data: data,
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, User!
        </h1>
        <p className="text-gray-600">Here's your financial snapshot.</p>
      </header>

      {/* Financial Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-green-800">Total Income</h2>
          <p className="text-2xl font-bold text-green-800">
            ${overview.totalIncome || 0}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-red-800">Total Expenses</h2>
          <p className="text-2xl font-bold text-red-800">
            ${overview.totalExpense || 0}
          </p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-blue-800">
            Remaining Budget
          </h2>
          <p className="text-2xl font-bold text-blue-800">
            ${overview.netSavings >= 0 ? overview.netSavings : 0}
          </p>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Transactions
        </h2>
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-gray-600">Date</th>
              <th className="px-4 py-2 text-left text-gray-600">Category</th>
              <th className="px-4 py-2 text-left text-gray-600">Amount</th>
              <th className="px-4 py-2 text-left text-gray-600">Type</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions?.map((txn, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="px-4 py-2">{txn.date}</td>
                <td className="px-4 py-2">{txn.category}</td>
                <td className="px-4 py-2">${txn.amount}</td>
                <td className="px-4 py-2">{txn.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Quick Actions */}
      <section className="mb-6 flex gap-4">
        <Link
          to={"/transactions"}
          className="flex items-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-700"
        >
          <FaPlus /> Add Transaction
        </Link>
        <Link
          to={"/budgets"}
          className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
        >
          <FaWallet /> Set Budget
        </Link>
        <Link
          to={"/goals"}
          className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700"
        >
          <FaBullseye /> Create Goal
        </Link>
      </section>

      {/* Graphs and Insights */}
      <section className="grid grid-cols-1 gap-6">
        {/* Spending Trends */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Spending Trends
          </h2>
          <Bar
            data={{
              labels: trendsData.map((item) => item._id),
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

        {/* Category-Wise Spending */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Category-Wise Spending
          </h2>
          <div className="w-full max-w-sm mx-auto">
            <Pie data={data} options={options} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
