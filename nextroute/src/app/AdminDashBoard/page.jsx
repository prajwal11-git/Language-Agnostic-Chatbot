"use client";

import React from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChatbotAnalytics = () => {
  // ✅ KPI mock data
  const kpis = [
    { title: "Total Users", value: "15,847", change: "+12%", trend: "up" },
    { title: "Total Conversations", value: "42,156", change: "+8%", trend: "up" },
    { title: "Avg Response Time", value: "1.2s", change: "-5%", trend: "down" },
    { title: "Satisfaction Rate", value: "94.2%", change: "+3%", trend: "up" },
  ];

  // ✅ Daily users mock data
  const dailyUsers = [
    { date: "1/1", users: 1200 },
    { date: "1/2", users: 1350 },
    { date: "1/3", users: 1180 },
    { date: "1/4", users: 1420 },
    { date: "1/5", users: 1580 },
    { date: "1/6", users: 1380 },
    { date: "1/7", users: 1650 },
    { date: "1/8", users: 1720 },
    { date: "1/9", users: 1590 },
    { date: "1/10", users: 1800 },
    { date: "1/11", users: 1750 },
    { date: "1/12", users: 1900 },
    { date: "1/13", users: 1680 },
    { date: "1/14", users: 2100 },
    { date: "1/15", users: 2250 },
    { date: "1/16", users: 2180 },
    { date: "1/17", users: 2350 },
    { date: "1/18", users: 2200 },
    { date: "1/19", users: 2480 },
    { date: "1/20", users: 2380 },
    { date: "1/21", users: 2650 },
    { date: "1/22", users: 2580 },
    { date: "1/23", users: 2750 },
    { date: "1/24", users: 2680 },
    { date: "1/25", users: 2900 },
    { date: "1/26", users: 2850 },
    { date: "1/27", users: 3100 },
    { date: "1/28", users: 3050 },
    { date: "1/29", users: 3200 },
    { date: "1/30", users: 3150 },
  ];

  // ✅ Languages mock data
  const languages = [
    { language: "English", count: 18500 },
    { language: "Spanish", count: 12300 },
    { language: "French", count: 8900 },
    { language: "German", count: 6500 },
    { language: "Portuguese", count: 4200 },
  ];

  // ✅ Conversation categories mock data
  const conversationCategories = [
    { name: "FAQ", value: 35, color: "#3B82F6" },
    { name: "Technical Support", value: 28, color: "#EF4444" },
    { name: "General Queries", value: 22, color: "#10B981" },
    { name: "Product Info", value: 10, color: "#F59E0B" },
    { name: "Billing", value: 5, color: "#8B5CF6" },
  ];

  // ✅ Top queries mock data
  const topQueries = [
    { query: "How do I reset my password?", count: 2847, category: "Technical Support" },
    { query: "What are your business hours?", count: 2156, category: "FAQ" },
    { query: "How can I upgrade my plan?", count: 1923, category: "Billing" },
    { query: "Is there a mobile app available?", count: 1675, category: "Product Info" },
    { query: "How do I contact customer support?", count: 1534, category: "FAQ" },
  ];

  // ✅ KPI Card
  const KPICard = ({ kpi }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
          <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
        </div>
        <div
          className={`flex items-center text-sm font-medium ${
            kpi.trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
              kpi.trend === "up" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {kpi.trend === "up" ? "↗" : "↘"} {kpi.change}
          </span>
        </div>
      </div>
    </div>
  );

  // ✅ Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ Header */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-xl font-bold">College Chatbot Dashboard</h1>
          <nav className="space-x-6">
            <Link href="/" className="hover:text-blue-300">
              Home
            </Link>
            <Link href="/Chatbot" className="hover:text-blue-300">
              Chatbot
            </Link>
            <Link href="/upload" className="hover:text-blue-300">
              Upload
            </Link>
          </nav>
        </div>
      </header>

      {/* ✅ Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <KPICard key={index} kpi={kpi} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Active Users - Line Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Daily Active Users (Last 30 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Languages - Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top 5 Languages
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={languages}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="language" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conversation Categories - Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Conversation Categories
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conversationCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  {conversationCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Usage Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Key Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Peak Hour</span>
                <span className="font-semibold text-gray-900">
                  2:00 PM - 3:00 PM
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Busiest Day</span>
                <span className="font-semibold text-gray-900">Wednesday</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Resolution Rate</span>
                <span className="font-semibold text-green-600">87.3%</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Escalation Rate</span>
                <span className="font-semibold text-blue-600">12.7%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Queries Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Top 5 User Queries
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Query
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topQueries.map((query, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      {query.query}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {query.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {query.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center text-green-600">
                        ↗ +{Math.floor(Math.random() * 15 + 5)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ✅ Footer */}
      <footer className="bg-blue-900 text-gray-200 mt-8 py-4">
        <div className="max-w-7xl mx-auto text-center text-sm">
          © {new Date().getFullYear()} College RAG Chatbot · Built for Smart
          India Hackathon
        </div>
      </footer>
    </div>
  );
};

export default ChatbotAnalytics;
