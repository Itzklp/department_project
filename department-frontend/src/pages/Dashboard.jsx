import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SortToggle from '../components/dashboard/SortToggle';
import CollapsibleSection from '../components/dashboard/CollapsibleSection';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { toast } from 'react-hot-toast';
import { 
  Plus, FileText, Briefcase, Users, GraduationCap, 
  Lightbulb, BookOpen, Calendar, Mic, Award, Upload 
} from 'lucide-react';
import config from '../config'; // Import your API config

const Dashboard = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // States
  const [sortMode, setSortMode] = useState('updatedAt');
  const [loading, setLoading] = useState(true);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  
  const [dashboardData, setDashboardData] = useState({
    publications: [], projects: [], conferences: [], phdThesis: [], 
    patents: [], books: [], events: [], talks: [], awards: []
  });

  const [modalConfig, setModalConfig] = useState({
    isOpen: false, isLoading: false, error: null, itemToDelete: null, stateKey: null, apiEndpoint: null
  });

  // Handle click outside to close Add New dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- REAL API INTEGRATION ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/v1/dashboard/my-dashboard`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        const result = await res.json();

        if (res.ok && result.success) {
          // Sort data immediately based on default sortMode before setting state
          const incomingData = result.data;
          const sortData = (arr) => [...(arr || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          setDashboardData({
            publications: sortData(incomingData.publications),
            projects: sortData(incomingData.projects),
            conferences: sortData(incomingData.conferences),
            phdThesis: sortData(incomingData.phdThesis),
            patents: sortData(incomingData.patents),
            books: sortData(incomingData.books),
            events: sortData(incomingData.events),
            talks: sortData(incomingData.talks),
            awards: sortData(incomingData.awards),
          });
        } else {
          toast.error(result.message || "Failed to load contributions.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Network error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // --- ACTION HANDLERS ---
  const handleEdit = (item, formRoute) => navigate(formRoute, { state: { editData: item } });

  const handleDeleteClick = (item, stateKey, apiEndpoint) => {
    setModalConfig({ isOpen: true, isLoading: false, error: null, itemToDelete: item, stateKey, apiEndpoint });
  };

  const confirmDelete = async () => {
    setModalConfig(prev => ({ ...prev, isLoading: true, error: null }));
    const { itemToDelete, stateKey, apiEndpoint } = modalConfig;
    const itemId = itemToDelete._id || itemToDelete.id;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/${apiEndpoint}/${itemId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setDashboardData(prevData => ({
          ...prevData,
          [stateKey]: prevData[stateKey].filter(i => (i._id || i.id) !== itemId)
        }));
        toast.success("Record deleted successfully");
        closeModal();
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete");
      }
    } catch (err) {
      setModalConfig(prev => ({ ...prev, isLoading: false, error: err.message || "Deletion failed." }));
    }
  };

  const closeModal = () => {
    if (!modalConfig.isLoading) setModalConfig({ isOpen: false, isLoading: false, error: null, itemToDelete: null, stateKey: null, apiEndpoint: null });
  };

  // --- CONFIGURATIONS ---
  // Notice: We check for multiple possible keys (e.g. `title` OR `projectName`) to ensure data maps correctly regardless of your DB schema names.
  // --- CONFIGURATIONS ---
  const sectionConfigs = [
    { key: 'projects', title: 'Projects', config: { titleKey: 'title', backupTitleKey: 'projectTitle', metadataKeys: [{ label: 'Funding', key: 'fundingAgency' }, { label: 'Status', key: 'status' }], formRoute: '/forms/project', stateKey: 'projects', apiEndpoint: 'projects', onEdit: handleEdit, onDelete: handleDeleteClick } },
    { key: 'publications', title: 'Publications', config: { titleKey: 'title', backupTitleKey: 'paperTitle', metadataKeys: [{ label: 'Journal', key: 'journal' }, { label: 'Year', key: 'year' }], formRoute: '/forms/publication', stateKey: 'publications', apiEndpoint: 'publications', onEdit: handleEdit, onDelete: handleDeleteClick } },
    { key: 'conferences', title: 'Conferences Attended', config: { titleKey: 'title', backupTitleKey: 'conferenceName', metadataKeys: [{ label: 'Location', key: 'location' }, { label: 'Date', key: 'date' }], formRoute: '/forms/conference', stateKey: 'conferences', apiEndpoint: 'conferences', onEdit: handleEdit, onDelete: handleDeleteClick } },
    { key: 'patents', title: 'Patents', config: { titleKey: 'title', backupTitleKey: 'patentTitle', metadataKeys: [{ label: 'Application No', key: 'applicationNumber' }, { label: 'Status', key: 'status' }], formRoute: '/forms/patent', stateKey: 'patents', apiEndpoint: 'patents', onEdit: handleEdit, onDelete: handleDeleteClick } },
    { key: 'books', title: 'Published Books', config: { titleKey: 'title', backupTitleKey: 'bookTitle', metadataKeys: [{ label: 'Publisher', key: 'publisher' }, { label: 'ISBN', key: 'isbn' }], formRoute: '/forms/published-book', stateKey: 'books', apiEndpoint: 'published-books', onEdit: handleEdit, onDelete: handleDeleteClick } },
    { key: 'awards', title: 'Awards & Honors', config: { titleKey: 'title', backupTitleKey: 'awardName', metadataKeys: [{ label: 'Awarding Body', key: 'awardingBody' }, { label: 'Year', key: 'year' }], formRoute: '/forms/faculty-award', stateKey: 'awards', apiEndpoint: 'faculty-awards', onEdit: handleEdit, onDelete: handleDeleteClick } },
    { key: 'phdThesis', title: 'PhD Thesis', config: { titleKey: 'scholarName', backupTitleKey: 'title', metadataKeys: [{ label: 'Title', key: 'thesisTitle' }, { label: 'Year', key: 'year' }], formRoute: '/forms/phd-thesis', stateKey: 'phdThesis', apiEndpoint: 'phd-thesis', onEdit: handleEdit, onDelete: handleDeleteClick } },
    { key: 'events', title: 'Department Events', config: { titleKey: 'title', backupTitleKey: 'eventName', metadataKeys: [{ label: 'Role', key: 'role' }, { label: 'Date', key: 'date' }], formRoute: '/forms/department-event', stateKey: 'events', apiEndpoint: 'department-events', onEdit: handleEdit, onDelete: handleDeleteClick } },
    { key: 'talks', title: 'Invited Talks', config: { titleKey: 'title', backupTitleKey: 'topic', metadataKeys: [{ label: 'Venue', key: 'venue' }, { label: 'Date', key: 'date' }], formRoute: '/forms/invited-talk', stateKey: 'talks', apiEndpoint: 'invited-talks', onEdit: handleEdit, onDelete: handleDeleteClick } }
  ];

  const quickActionsList = [
    { title: 'Publication', icon: FileText, path: '/forms/publication' },
    { title: 'Project', icon: Briefcase, path: '/forms/project' },
    { title: 'Conference', icon: Users, path: '/forms/conference' },
    { title: 'PhD Thesis', icon: GraduationCap, path: '/forms/phd-thesis' },
    { title: 'Patent', icon: Lightbulb, path: '/forms/patent' },
    { title: 'Book', icon: BookOpen, path: '/forms/published-book' },
    { title: 'Event', icon: Calendar, path: '/forms/department-event' },
    { title: 'Talk', icon: Mic, path: '/forms/invited-talk' },
    { title: 'Award', icon: Award, path: '/forms/faculty-award' },
    { title: 'Bulk Upload', icon: Upload, path: '/bulk-upload' },
  ];

  // Helper to check if dashboard is entirely empty
  const hasAnyData = Object.values(dashboardData).some(arr => arr && arr.length > 0);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your academic records</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SortToggle sortMode={sortMode} setSortMode={setSortMode} />
          
          {/* Add New Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Add Record
            </button>

            {isAddMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden">
                <div className="max-h-80 overflow-y-auto">
                  {quickActionsList.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <Link 
                        key={idx}
                        to={action.path}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors"
                        onClick={() => setIsAddMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{action.title}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : !hasAnyData ? (
        // Global Empty State
        <div className="text-center bg-white border border-gray-200 rounded-xl p-12 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to your Portal</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Your dashboard is currently empty. Start building your profile by adding your first publication, project, or event.
          </p>
          <button 
            onClick={() => setIsAddMenuOpen(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
          >
            Add Your First Record
          </button>
        </div>
      ) : (
        // Render Sections (Hiding empty ones)
        <div className="space-y-4">
          {sectionConfigs.map((section) => {
            const sectionData = dashboardData[section.key];
            
            // If there is no data, render nothing
            if (!sectionData || sectionData.length === 0) return null;

            return (
              <CollapsibleSection
                key={section.key}
                title={section.title}
                data={sectionData}
                loading={false}
                // Pass backupTitleKey so it tries multiple fields
                config={{...section.config, titleKey: section.config.titleKey}} 
              />
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        isLoading={modalConfig.isLoading}
        error={modalConfig.error}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
      />
    </div>
  );
};

export default Dashboard;