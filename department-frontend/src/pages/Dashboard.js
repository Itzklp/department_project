import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State to hold the categorized contributions
  const [dashboardData, setDashboardData] = useState({});
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // 1. Fetch User Data
        const userRes = await fetch(`${config.API_BASE_URL}/api/v1/auth/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.data);

          // 2. Fetch Contributions
          if (userData.data.role === "faculty" || userData.data.role === "admin") {
            try {
              const dashRes = await fetch(`${config.API_BASE_URL}/api/v1/dashboard/my-dashboard`, {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${token}`,
                },
              });
              
              const dashResult = await dashRes.json();
              if (dashRes.ok) {
                setDashboardData(dashResult.data);
              } else {
                setDataError("Could not load your contributions.");
              }
            } catch (err) {
              console.error("Failed to fetch dashboard data:", err);
              setDataError("Network error while loading contributions.");
            }
          }
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isFirstLogin");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Helper to check if dashboard is entirely empty
  const hasAnyData = Object.values(dashboardData).some(arr => arr && arr.length > 0);

  return (
    <div className="bg-transparent">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full">
        
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 mt-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium text-gray-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <span className="inline-flex items-center px-3 py-1 mt-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                {user?.role}
              </span>
            </div>
            {user?.facultyProfile && (
              <div>
                <p className="text-sm text-gray-500">Faculty ID</p>
                <p className="text-lg font-medium text-gray-900">
                  {user.facultyProfile._id || user.facultyProfile}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* My Contributions Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">
            My Contributions History
          </h2>
          
          {dataError && <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{dataError}</p>}

          {!hasAnyData && !dataError ? (
             <p className="text-gray-500 italic p-4 text-center bg-gray-50 rounded-lg">No contributions found yet.</p>
          ) : (
            Object.entries(dashboardData).map(([categoryName, itemsArray]) => {
              
              // Skip rendering if this category has no items
              if (!itemsArray || itemsArray.length === 0) return null;

              // Dynamically group the flat array into years for the UI
              const yearsData = itemsArray.reduce((acc, item) => {
                let year = item.year || 
                           (item.dateSanctioned ? new Date(item.dateSanctioned).getFullYear() : null) || 
                           (item.date ? new Date(item.date).getFullYear() : null) || 
                           "Unknown Year";
                
                if (!acc[year]) acc[year] = [];
                acc[year].push(item);
                return acc;
              }, {});

              return (
                <div key={categoryName} className="mb-8 last:mb-0">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 capitalize">
                    {/* Adds spaces to camelCase names like phdThesis -> phd Thesis */}
                    {categoryName.replace(/([A-Z])/g, ' $1').trim()} 
                  </h3>

                  <div className="space-y-4 ml-4">
                    {/* Sort years descending (newest first) */}
                    {Object.entries(yearsData)
                      .sort(([yearA], [yearB]) => {
                        if (yearA === "Unknown Year") return 1;
                        if (yearB === "Unknown Year") return -1;
                        return yearB - yearA;
                      })
                      .map(([year, items]) => (
                      <div key={year} className="border-l-4 border-blue-300 pl-4 py-2">
                        <span className="inline-block bg-blue-50 text-blue-800 font-semibold px-2.5 py-1 rounded-md text-sm mb-3">
                          Year: {year}
                        </span>
                        
                        <ul className="space-y-3">
                          {items.map((item, index) => (
                            <li key={item._id || index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                              
                              {/* Safely grab the title depending on what the schema calls it */}
                              <p className="text-gray-900 font-semibold text-lg">
                                {item.title || item.projectTitle || item.paperTitle || item.conferenceName || item.patentTitle || item.bookTitle || item.awardName || item.scholarName || item.eventName || item.topic || "Untitled Record"}
                              </p>
                              
                              <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-4">
                                {item.journal && <span><strong className="text-gray-500 font-medium">Journal:</strong> {item.journal}</span>}
                                {item.status && <span><strong className="text-gray-500 font-medium">Status:</strong> {item.status}</span>}
                                {item.fundingAgency && <span><strong className="text-gray-500 font-medium">Funding Agency:</strong> {item.fundingAgency}</span>}
                                {item.publisher && <span><strong className="text-gray-500 font-medium">Publisher:</strong> {item.publisher}</span>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}