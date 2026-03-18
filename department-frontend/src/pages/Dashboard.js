import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config"; // Make sure you have this config file created!

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // NEW: State to hold the categorized contributions
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

          // 2. NEW: If the user is a faculty member, fetch their contributions
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
          // Token invalid or expired
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {user?.name || "User"}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-medium text-gray-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                {user?.role}
              </span>
            </div>
            {user?.facultyProfile && (
              <div>
                <p className="text-sm text-gray-600">Faculty ID</p>
                <p className="text-lg font-medium text-gray-900">
                  {user.facultyProfile._id || user.facultyProfile}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions (Kept exactly as you had them) */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          
          {/* Admin Quick Actions */}
          {user?.role === "admin" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <button onClick={() => navigate("/forms/faculty")} className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left">
                <div className="text-3xl mb-2">👤</div>
                <h3 className="font-semibold text-gray-900">Add Faculty</h3>
                <p className="text-sm text-gray-600">Register new faculty member</p>
              </button>
              <button onClick={() => navigate("/forms/publication")} className="p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-left">
                <div className="text-3xl mb-2">📄</div>
                <h3 className="font-semibold text-gray-900">Add Publication</h3>
                <p className="text-sm text-gray-600">Submit new publication</p>
              </button>
              <button onClick={() => navigate("/forms/project")} className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left">
                <div className="text-3xl mb-2">🔬</div>
                <h3 className="font-semibold text-gray-900">Add Project</h3>
                <p className="text-sm text-gray-600">Register new project</p>
              </button>
              <button onClick={() => navigate("/forms/conference")} className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition text-left">
                <div className="text-3xl mb-2">🎤</div>
                <h3 className="font-semibold text-gray-900">Add Conference</h3>
                <p className="text-sm text-gray-600">Submit conference paper</p>
              </button>
              <button onClick={() => navigate("/forms/phd-thesis")} className="p-4 border-2 border-teal-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition text-left">
                <div className="text-3xl mb-2">🎓</div>
                <h3 className="font-semibold text-gray-900">Add PhD Thesis</h3>
                <p className="text-sm text-gray-600">Register new thesis</p>
              </button>
              <button onClick={() => navigate("/forms/patent")} className="p-4 border-2 border-pink-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition text-left">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="font-semibold text-gray-900">Add Patent</h3>
                <p className="text-sm text-gray-600">Submit patent application</p>
              </button>
              <button onClick={() => navigate("/forms/published-book")} className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition text-left">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-semibold text-gray-900">Add Published Book</h3>
                <p className="text-sm text-gray-600">Submit book/chapter</p>
              </button>
              <button onClick={() => navigate("/forms/department-event")} className="p-4 border-2 border-cyan-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition text-left">
                <div className="text-3xl mb-2">📅</div>
                <h3 className="font-semibold text-gray-900">Add Department Event</h3>
                <p className="text-sm text-gray-600">Create new event</p>
              </button>
              <button onClick={() => navigate("/forms/invited-talk")} className="p-4 border-2 border-lime-200 rounded-lg hover:border-lime-500 hover:bg-lime-50 transition text-left">
                <div className="text-3xl mb-2">🎙️</div>
                <h3 className="font-semibold text-gray-900">Add Invited Talk</h3>
                <p className="text-sm text-gray-600">Register invited talk</p>
              </button>
              <button onClick={() => navigate("/forms/faculty-award")} className="p-4 border-2 border-amber-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition text-left">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-semibold text-gray-900">Add Faculty Award</h3>
                <p className="text-sm text-gray-600">Submit award/recognition</p>
              </button>
              <button onClick={() => navigate("/bulk-upload")} className="p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition text-left">
                <div className="text-3xl mb-2">📤</div>
                <h3 className="font-semibold text-gray-900">Bulk Upload</h3>
                <p className="text-sm text-gray-600">Import multiple records</p>
              </button>
              <button onClick={() => navigate("/change-password")} className="p-4 border-2 border-red-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition text-left">
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="font-semibold text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-600">Update your password</p>
              </button>
            </div>
          )}

          {/* Faculty Quick Actions */}
          {user?.role === "faculty" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => navigate("/forms/publication")} className="p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-left">
                <div className="text-3xl mb-2">📄</div>
                <h3 className="font-semibold text-gray-900">Add Publication</h3>
                <p className="text-sm text-gray-600">Submit new publication</p>
              </button>
              <button onClick={() => navigate("/forms/project")} className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left">
                <div className="text-3xl mb-2">🔬</div>
                <h3 className="font-semibold text-gray-900">Add Project</h3>
                <p className="text-sm text-gray-600">Register new project</p>
              </button>
              <button onClick={() => navigate("/forms/conference")} className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition text-left">
                <div className="text-3xl mb-2">🎤</div>
                <h3 className="font-semibold text-gray-900">Add Conference</h3>
                <p className="text-sm text-gray-600">Submit conference paper</p>
              </button>
              <button onClick={() => navigate("/forms/phd-thesis")} className="p-4 border-2 border-teal-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition text-left">
                <div className="text-3xl mb-2">🎓</div>
                <h3 className="font-semibold text-gray-900">Add PhD Thesis</h3>
                <p className="text-sm text-gray-600">Register new thesis</p>
              </button>
              <button onClick={() => navigate("/forms/patent")} className="p-4 border-2 border-pink-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition text-left">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="font-semibold text-gray-900">Add Patent</h3>
                <p className="text-sm text-gray-600">Submit patent application</p>
              </button>
              <button onClick={() => navigate("/forms/published-book")} className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition text-left">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-semibold text-gray-900">Add Published Book</h3>
                <p className="text-sm text-gray-600">Submit book/chapter</p>
              </button>
              <button onClick={() => navigate("/forms/department-event")} className="p-4 border-2 border-cyan-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition text-left">
                <div className="text-3xl mb-2">📅</div>
                <h3 className="font-semibold text-gray-900">Add Department Event</h3>
                <p className="text-sm text-gray-600">Create new event</p>
              </button>
              <button onClick={() => navigate("/forms/invited-talk")} className="p-4 border-2 border-lime-200 rounded-lg hover:border-lime-500 hover:bg-lime-50 transition text-left">
                <div className="text-3xl mb-2">🎙️</div>
                <h3 className="font-semibold text-gray-900">Add Invited Talk</h3>
                <p className="text-sm text-gray-600">Register invited talk</p>
              </button>
              <button onClick={() => navigate("/forms/faculty-award")} className="p-4 border-2 border-amber-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition text-left">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-semibold text-gray-900">Add Faculty Award</h3>
                <p className="text-sm text-gray-600">Submit award/recognition</p>
              </button>
              <button onClick={() => navigate("/change-password")} className="p-4 border-2 border-red-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition text-left">
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="font-semibold text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-600">Update your password</p>
              </button>
            </div>
          )}
        </div>

        {/* NEW: My Contributions Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
            My Contributions history
          </h2>
          
          {dataError && <p className="text-red-500">{dataError}</p>}

          {Object.keys(dashboardData).length === 0 && !dataError ? (
             <p className="text-gray-500 italic">No contributions found yet.</p>
          ) : (
            Object.entries(dashboardData).map(([categoryName, yearsData]) => (
              <div key={categoryName} className="mb-8">
                <h3 className="text-xl font-bold text-blue-700 mb-4 capitalize">
                  {categoryName}
                </h3>

                {Object.keys(yearsData).length === 0 ? (
                  <p className="text-gray-500 text-sm italic ml-4">No entries in this category.</p>
                ) : (
                  <div className="space-y-4 ml-4">
                    {/* Sort years descending */}
                    {Object.entries(yearsData)
                      .sort(([yearA], [yearB]) => yearB - yearA)
                      .map(([year, items]) => (
                      <div key={year} className="border-l-4 border-blue-200 pl-4 py-2">
                        <span className="inline-block bg-blue-50 text-blue-800 font-semibold px-2 py-1 rounded text-sm mb-3">
                          Year: {year}
                        </span>
                        
                        <ul className="space-y-3">
                          {items.map((item, index) => (
                            <li key={item._id || index} className="bg-gray-50 p-3 rounded border border-gray-100">
                              <p className="text-gray-900 font-medium">{item.title}</p>
                              {/* Display specific details based on what exists in the object */}
                              <p className="text-sm text-gray-500 mt-1">
                                {item.journal && <span>Journal: {item.journal} | </span>}
                                {item.conferenceName && <span>Conference: {item.conferenceName} | </span>}
                                {item.pages && <span>Pages: {item.pages}</span>}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}