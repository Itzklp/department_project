// src/pages/FacultyDashboard.js
import { useState, useEffect } from "react";
import config from "../config"; // Assuming you setup config.js as discussed earlier

export default function FacultyDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${config.API_BASE_URL}/api/v1/dashboard/my-dashboard`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const result = await res.json();

        if (res.ok) {
          setDashboardData(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-600">Loading your contributions...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Contributions</h1>

      {/* Iterate over Categories (Publications, Conferences, etc.) */}
      {Object.entries(dashboardData).map(([categoryName, yearsData]) => (
        <div key={categoryName} className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 mb-6">
            {categoryName}
          </h2>

          {/* Check if there is any data for this category */}
          {Object.keys(yearsData).length === 0 ? (
            <p className="text-gray-500 italic">No {categoryName.toLowerCase()} added yet.</p>
          ) : (
            <div className="space-y-6">
              {/* Iterate over Years within the Category */}
              {Object.entries(yearsData)
                .sort(([yearA], [yearB]) => yearB - yearA) // Sort years descending
                .map(([year, items]) => (
                <div key={year} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 bg-gray-50 inline-block px-3 py-1 rounded">
                    {year}
                  </h3>
                  
                  <ul className="space-y-3">
                    {/* Iterate over the actual items (the array of publications/conferences) */}
                    {items.map((item, index) => (
                      <li key={item._id || index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <div>
                          <p className="text-gray-900 font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            {/* Dynamically show journal for publications, conferenceName for conferences */}
                            {item.journal || item.conferenceName} 
                            {item.pages && ` | Pages: ${item.pages}`}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}