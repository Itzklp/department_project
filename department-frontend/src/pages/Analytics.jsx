import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutList, IndianRupee, BarChart2, PieChart as PieIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import config from '../config';

export default function Analytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [hasElevatedAccess, setHasElevatedAccess] = useState(false);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch(`${config.API_BASE_URL}/api/v1/dashboard/my-dashboard`, {
          method: "GET", headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await res.json();
        
        if (res.ok && result.success) {
          setDashboardData(result.data || {});
          setHasElevatedAccess(result.isAdminOrHOD);
        } else {
          setDataError("Failed to load analytics data.");
        }
      } catch (err) {
        setDataError("Network error while loading analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, [navigate]);

  const getExtractedYear = (item) => {
    if (item.year && !isNaN(item.year)) return item.year.toString();
    if (item.dateSanctioned) return new Date(item.dateSanctioned).getFullYear().toString();
    if (item.date) return new Date(item.date).getFullYear().toString();
    if (item.createdAt) return new Date(item.createdAt).getFullYear().toString();
    return "Unknown Year";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  // Process Data for Charts
  let totalFunding = 0;
  let totalItems = 0;
  const yearStatsMap = {};
  const pieDataMap = {};

  Object.entries(dashboardData).forEach(([category, items]) => {
    if (!Array.isArray(items)) return;
    totalItems += items.length;
    pieDataMap[category] = items.length;

    items.forEach(item => {
      if (category === 'projects' && item.totalINR) totalFunding += Number(item.totalINR);
      const year = getExtractedYear(item);
      if (year === "Unknown Year") return;

      if (!yearStatsMap[year]) yearStatsMap[year] = { name: year, Publications: 0, Projects: 0, Conferences: 0 };
      
      if (category === 'publications') yearStatsMap[year].Publications += 1;
      if (category === 'projects') yearStatsMap[year].Projects += 1;
      if (category === 'conferences') yearStatsMap[year].Conferences += 1;
    });
  });

  const barChartData = Object.values(yearStatsMap).sort((a, b) => a.name - b.name);
  const pieChartData = Object.entries(pieDataMap).filter(([k,v]) => v > 0).map(([k, v]) => ({ name: k.replace(/([A-Z])/g, ' $1').trim(), value: v }));
  const COLORS = ['#2563eb', '#16a34a', '#9333ea', '#ea580c', '#eab308', '#0ea5e9', '#ec4899', '#64748b', '#14b8a6'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 border-b border-gray-200 pb-4">
        {/* Dynamic Headers based on access level */}
        <h1 className="text-3xl font-bold text-gray-900">
          {hasElevatedAccess ? "Department Analytics" : "My Impact Analytics"}
        </h1>
        <p className="text-gray-500 mt-1">
          {hasElevatedAccess 
            ? "Overview of department contributions and outputs." 
            : "Overview of your personal contributions and outputs."}
        </p>
        {dataError && <p className="text-red-500 mt-2">{dataError}</p>}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><LayoutList className="w-8 h-8"/></div>
          <div><p className="text-sm text-gray-500 font-bold">Total Records</p><p className="text-2xl font-black text-gray-900">{totalItems}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><IndianRupee className="w-8 h-8"/></div>
          <div><p className="text-sm text-gray-500 font-bold">Total Funding</p><p className="text-2xl font-black text-gray-900">₹{(totalFunding/100000).toFixed(2)}L</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><BarChart2 className="w-8 h-8"/></div>
          <div><p className="text-sm text-gray-500 font-bold">Publications</p><p className="text-2xl font-black text-gray-900">{dashboardData.publications?.length || 0}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><PieIcon className="w-8 h-8"/></div>
          <div><p className="text-sm text-gray-500 font-bold">Projects</p><p className="text-2xl font-black text-gray-900">{dashboardData.projects?.length || 0}</p></div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Yearly Output Comparison</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" />
                <Bar dataKey="Publications" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Conferences" fill="#9333ea" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Projects" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Record Distribution</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2} dataKey="value">
                  {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}