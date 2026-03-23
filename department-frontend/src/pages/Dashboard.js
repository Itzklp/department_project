import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import config from "../config";

// Modals
import ConfirmationModal from "../components/common/ConfirmationModal";
import PublicationEditModal from "../components/dashboard/PublicationEditModal";
import ProjectEditModal from "../components/dashboard/ProjectEditModal";
import ConferenceEditModal from "../components/dashboard/ConferenceEditModal";
import FacultyAwardEditModal from "../components/dashboard/FacultyAwardEditModal";
import DepartmentEventEditModal from "../components/dashboard/DepartmentEventEditModal";
import PublishedBookEditModal from "../components/dashboard/PublishedBookEditModal";
import PhdThesisEditModal from "../components/dashboard/PhdThesisEditModal";
import PatentEditModal from "../components/dashboard/PatentEditModal";
import InvitedTalkEditModal from "../components/dashboard/InvitedTalkEditModal";

// Map dashboard keys to their backend API endpoints for generic delete
const apiEndpoints = {
  publications: "publication",
  projects: "project",
  conferences: "conference",
  phdThesis: "phdThesis",
  patents: "patent",
  books: "publishedBook",
  events: "departmentEvent",
  talks: "invitedTalk",
  awards: "facultyAward"
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [dataError, setDataError] = useState("");
  
  // UI State for Collapsible Categories
  const [expandedCategories, setExpandedCategories] = useState({});

  // Modals State
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, id: null, category: null, isDeleting: false });
  const [editConfig, setEditConfig] = useState({ isOpen: false, item: null, category: null });

  // Toggle category expansion
  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

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
          cache: "no-store" 
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
                cache: "no-store" 
              });
              
              const dashResult = await dashRes.json();
              
              if (dashRes.ok && dashResult.success) {
                setDashboardData(dashResult.data || {});
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

  // --- DELETE FLOW ---
  const initiateDelete = (id, category) => {
    setDeleteConfig({ isOpen: true, id, category, isDeleting: false });
  };

  const handleConfirmDelete = async () => {
    setDeleteConfig(prev => ({ ...prev, isDeleting: true }));
    const endpoint = apiEndpoints[deleteConfig.category];
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/${endpoint}/${deleteConfig.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setDashboardData(prev => ({
          ...prev,
          [deleteConfig.category]: prev[deleteConfig.category].filter(item => item._id !== deleteConfig.id)
        }));
        toast.success("Record deleted successfully!");
        setDeleteConfig({ isOpen: false, id: null, category: null, isDeleting: false });
      } else {
        toast.error("Failed to delete record.");
        setDeleteConfig(prev => ({ ...prev, isDeleting: false }));
      }
    } catch (err) {
      toast.error("Network error.");
      setDeleteConfig(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // --- UPDATE FLOW ---
  const initiateEdit = (item, category) => {
    setEditConfig({ isOpen: true, item, category });
  };

  const handleUpdateSuccess = (updatedItem, category) => {
    setDashboardData(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item._id === updatedItem._id ? updatedItem : item
      )
    }));
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

  const hasAnyData = Object.values(dashboardData).some(arr => Array.isArray(arr) && arr.length > 0);

  return (
    <div className="bg-transparent pb-20">
      <main className="max-w-7xl mx-auto w-full px-4">
        
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 mt-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Name</p><p className="text-lg font-medium text-gray-900">{user?.name}</p></div>
            <div><p className="text-sm text-gray-500">Email</p><p className="text-lg font-medium text-gray-900">{user?.email}</p></div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <span className="inline-flex items-center px-3 py-1 mt-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                {user?.role}
              </span>
            </div>
            {user?.facultyProfile && (
              <div><p className="text-sm text-gray-500">Faculty ID</p><p className="text-lg font-medium text-gray-900">{user.facultyProfile._id || user.facultyProfile}</p></div>
            )}
          </div>
        </div>

        {/* My Contributions Section (Collapsible UI) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">
            My Contributions
          </h2>
          
          {dataError && <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{dataError}</p>}

          {!hasAnyData && !dataError ? (
             <p className="text-gray-500 italic p-4 text-center bg-gray-50 rounded-lg">No contributions found yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(dashboardData).map(([categoryName, itemsArray]) => {
                
                if (!itemsArray || !Array.isArray(itemsArray) || itemsArray.length === 0) return null;

                const isExpanded = expandedCategories[categoryName];

                // Group the flat array into years
                const yearsData = itemsArray.reduce((acc, item) => {
                  let extractedYear = "Unknown Year";
                  if (item.year && !isNaN(item.year)) extractedYear = item.year.toString();
                  else if (item.dateSanctioned) extractedYear = new Date(item.dateSanctioned).getFullYear().toString();
                  else if (item.date) extractedYear = new Date(item.date).getFullYear().toString();
                  else if (item.createdAt) extractedYear = new Date(item.createdAt).getFullYear().toString();
                  
                  if (!acc[extractedYear]) acc[extractedYear] = [];
                  acc[extractedYear].push(item);
                  return acc;
                }, {});

                return (
                  <div key={categoryName} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    
                    {/* Collapsible Header */}
                    <button 
                      onClick={() => toggleCategory(categoryName)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-blue-800 capitalize m-0">
                          {categoryName.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                          {itemsArray.length} {itemsArray.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      <div className="p-1 bg-white rounded-full shadow-sm border border-gray-200">
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
                      </div>
                    </button>

                    {/* Collapsible Body */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
                        <div className="space-y-6">
                          {Object.entries(yearsData)
                            .sort(([yearA], [yearB]) => {
                              if (yearA === "Unknown Year") return 1;
                              if (yearB === "Unknown Year") return -1;
                              return parseInt(yearB) - parseInt(yearA);
                            })
                            .map(([year, items]) => (
                            <div key={year} className="border-l-4 border-blue-300 pl-4 py-1">
                              <span className="inline-block bg-blue-50 text-blue-800 font-bold px-3 py-1 rounded-md text-sm mb-4 border border-blue-100 shadow-sm">
                                Year: {year}
                              </span>
                              
                              <ul className="space-y-3">
                                {items.map((item, index) => (
                                  <li key={item._id || index} className="group relative bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all">
                                    
                                    {/* Action Buttons */}
                                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => initiateEdit(item, categoryName)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full" title="Edit Record">
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button onClick={() => initiateDelete(item._id || item.id, categoryName)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-full" title="Delete Record">
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>

                                    <div className="pr-20">
                                      <p className="text-gray-900 font-bold text-lg">
                                        {item.title || item.projectTitle || item.paperTitle || item.conferenceName || item.patentTitle || item.bookTitle || item.awardName || item.scholarName || item.eventName || item.topic || "Untitled Record"}
                                      </p>
                                      
                                      <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-x-4 gap-y-2">
                                        {item.journal && <span><strong className="text-gray-500 font-medium">Journal:</strong> {item.journal}</span>}
                                        {item.status && <span><strong className="text-gray-500 font-medium">Status:</strong> {item.status}</span>}
                                        {item.fundingAgency && <span><strong className="text-gray-500 font-medium">Funding Agency:</strong> {item.fundingAgency}</span>}
                                        {item.publisher && <span><strong className="text-gray-500 font-medium">Publisher:</strong> {item.publisher}</span>}
                                        {item.authors && <span><strong className="text-gray-500 font-medium">Authors/Inventors:</strong> {Array.isArray(item.authors) ? item.authors.length + " listed" : item.authors}</span>}
                                      </div>
                                    </div>

                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* --- ALL MODALS --- */}
      
      {/* Global Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteConfig.isOpen}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        confirmColor="bg-red-600 hover:bg-red-700"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
        isLoading={deleteConfig.isDeleting}
      />

      {/* Edit Modals */}
      <PublicationEditModal 
        isOpen={editConfig.isOpen && editConfig.category === 'publications'}
        publication={editConfig.item}
        onClose={() => setEditConfig({ isOpen: false, item: null, category: null })}
        onSuccess={(updatedData) => handleUpdateSuccess(updatedData, 'publications')}
      />

      <ProjectEditModal 
        isOpen={editConfig.isOpen && editConfig.category === 'projects'}
        item={editConfig.item}
        onClose={() => setEditConfig({ isOpen: false, item: null, category: null })}
        onSuccess={(updatedData) => handleUpdateSuccess(updatedData, 'projects')}
      />

      <ConferenceEditModal 
        isOpen={editConfig.isOpen && editConfig.category === 'conferences'}
        item={editConfig.item}
        onClose={() => setEditConfig({ isOpen: false, item: null, category: null })}
        onSuccess={(updatedData) => handleUpdateSuccess(updatedData, 'conferences')}
      />

      <FacultyAwardEditModal 
        isOpen={editConfig.isOpen && editConfig.category === 'awards'}
        item={editConfig.item}
        onClose={() => setEditConfig({ isOpen: false, item: null, category: null })}
        onSuccess={(updatedData) => handleUpdateSuccess(updatedData, 'awards')}
      />

      <DepartmentEventEditModal 
        isOpen={editConfig.isOpen && editConfig.category === 'events'}
        item={editConfig.item}
        onClose={() => setEditConfig({ isOpen: false, item: null, category: null })}
        onSuccess={(updatedData) => handleUpdateSuccess(updatedData, 'events')}
      />

      <PublishedBookEditModal 
        isOpen={editConfig.isOpen && editConfig.category === 'books'}
        item={editConfig.item}
        onClose={() => setEditConfig({ isOpen: false, item: null, category: null })}
        onSuccess={(updatedData) => handleUpdateSuccess(updatedData, 'books')}
      />

      <PhdThesisEditModal 
        isOpen={editConfig.isOpen && editConfig.category === 'phdThesis'}
        item={editConfig.item}
        onClose={() => setEditConfig({ isOpen: false, item: null, category: null })}
        onSuccess={(updatedData) => handleUpdateSuccess(updatedData, 'phdThesis')}
      />

      <PatentEditModal 
        isOpen={editConfig.isOpen && editConfig.category === 'patents'}
        item={editConfig.item}
        onClose={() => setEditConfig({ isOpen: false, item: null, category: null })}
        onSuccess={(updatedData) => handleUpdateSuccess(updatedData, 'patents')}
      />

      <InvitedTalkEditModal 
        isOpen={editConfig.isOpen && editConfig.category === 'talks'}
        item={editConfig.item}
        onClose={() => setEditConfig({ isOpen: false, item: null, category: null })}
        onSuccess={(updatedData) => handleUpdateSuccess(updatedData, 'talks')}
      />

    </div>
  );
}