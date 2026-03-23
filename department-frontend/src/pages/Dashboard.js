import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, ChevronDown, ChevronRight, LayoutList, FolderOpen, Search, Filter, Download, BarChart2, PieChart as PieIcon, IndianRupee } from "lucide-react";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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

const apiEndpoints = {
  publications: "publication", projects: "project", conferences: "conference", phdThesis: "phdThesis",
  patents: "patent", books: "publishedBook", events: "departmentEvent", talks: "invitedTalk", awards: "facultyAward"
};

// 🔥 Added Analytics to the beginning of the tabs!
const adminTabs = [
  { id: 'publications', label: 'Publications' }, { id: 'projects', label: 'Projects' },
  { id: 'conferences', label: 'Conferences' }, { id: 'phdThesis', label: 'PhD Thesis' },
  { id: 'patents', label: 'Patents' }, { id: 'books', label: 'Books' },
  { id: 'events', label: 'Events' }, { id: 'talks', label: 'Invited Talks' }, { id: 'awards', label: 'Awards' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [dataError, setDataError] = useState("");
  
  // Privilege State
  const [hasElevatedAccess, setHasElevatedAccess] = useState(false);

  // UI States
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activeAdminTab, setActiveAdminTab] = useState('publications');

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("All");

  // Modals State
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, id: null, category: null, isDeleting: false });
  const [editConfig, setEditConfig] = useState({ isOpen: false, item: null, category: null });

  const toggleCategory = (categoryName) => setExpandedCategories(prev => ({ ...prev, [categoryName]: !prev[categoryName] }));

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const userRes = await fetch(`${config.API_BASE_URL}/api/v1/auth/me`, {
          method: "GET", headers: { "Authorization": `Bearer ${token}` }
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.data);

          if (userData.data.role === "faculty" || userData.data.role === "admin") {
            try {
              const dashRes = await fetch(`${config.API_BASE_URL}/api/v1/dashboard/my-dashboard`, {
                method: "GET", headers: { "Authorization": `Bearer ${token}` }
              });
              const dashResult = await dashRes.json();
              
              if (dashRes.ok && dashResult.success) {
                setDashboardData(dashResult.data || {});
                // 🔥 Grant elevated UI if backend confirms Admin or HOD
                setHasElevatedAccess(dashResult.isAdminOrHOD);
              } else setDataError("Could not load your contributions.");
            } catch (err) { setDataError("Network error while loading contributions."); }
          }
        } else handleLogout();
      } catch (err) { handleLogout(); } finally { setLoading(false); }
    };
    fetchAllData();
  }, [navigate, handleLogout]);

  // --- ACTIONS (Delete/Update) ---
  const initiateDelete = (id, category) => setDeleteConfig({ isOpen: true, id, category, isDeleting: false });
  const handleConfirmDelete = async () => {
    setDeleteConfig(prev => ({ ...prev, isDeleting: true }));
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/${apiEndpoints[deleteConfig.category]}/${deleteConfig.id}`, {
        method: "DELETE", headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setDashboardData(prev => ({ ...prev, [deleteConfig.category]: prev[deleteConfig.category].filter(item => item._id !== deleteConfig.id) }));
        toast.success("Record deleted!");
      } else toast.error("Failed to delete.");
    } catch (err) { toast.error("Network error."); } finally { setDeleteConfig({ isOpen: false, id: null, category: null, isDeleting: false }); }
  };

  const initiateEdit = (item, category) => setEditConfig({ isOpen: true, item, category });
  const handleUpdateSuccess = (updatedItem, category) => setDashboardData(prev => ({ ...prev, [category]: prev[category].map(item => item._id === updatedItem._id ? updatedItem : item) }));

  // --- DATA HELPERS ---
  const getExtractedYear = (item) => {
    if (item.year && !isNaN(item.year)) return item.year.toString();
    if (item.dateSanctioned) return new Date(item.dateSanctioned).getFullYear().toString();
    if (item.date) return new Date(item.date).getFullYear().toString();
    if (item.createdAt) return new Date(item.createdAt).getFullYear().toString();
    return "Unknown Year";
  };

  const getFilteredItems = (items) => {
    if (!items) return [];
    return items.filter(item => {
      const matchesSearch = searchTerm === "" || Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
      const itemYear = getExtractedYear(item);
      const matchesYear = filterYear === "All" || itemYear === filterYear;
      return matchesSearch && matchesYear;
    });
  };

  const groupItemsByYear = (itemsArray) => {
    return itemsArray.reduce((acc, item) => {
      const year = getExtractedYear(item);
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    }, {});
  };

  // --- PDF EXPORT ---
  const exportToPDF = (categoryName, filteredItems) => {
    if (filteredItems.length === 0) return toast.error("No data to export!");
    const doc = new jsPDF('landscape');
    const date = new Date().toLocaleString();

    doc.setFontSize(22); doc.setTextColor(30, 58, 138); doc.text("BITS Pilani - CISIS Department", 14, 20);
    doc.setFontSize(14); doc.setTextColor(100, 100, 100); doc.text(`${categoryName.toUpperCase()} REPORT`, 14, 28);
    doc.setFontSize(10); doc.text(`Generated on: ${date}`, 14, 34);
    if (searchTerm) doc.text(`Search Filter: "${searchTerm}"`, 14, 40);
    if (filterYear !== "All") doc.text(`Year Filter: ${filterYear}`, 14, 46);

    const pdfConfigs = {
      publications: { cols: ["Year", "Title", "Authors", "Journal", "Vol/Iss/Pg", "DOI"], mapRow: (item, yr) => [yr, item.title, Array.isArray(item.authors) ? item.authors.join(", ") : item.authors, item.journal, `Vol: ${item.volume||'-'}, Iss: ${item.issue||'-'}, Pg: ${item.pages||'-'}`, item.doi||'-'] },
      projects: { cols: ["Year", "Project Title", "Funding Agency", "Collaborators", "Total INR", "Type/Status"], mapRow: (item, yr) => [yr, item.projectTitle, item.fundingAgency, item.collaborator, item.totalINR?.toLocaleString('en-IN') || '-', `${item.type||'-'} / ${item.status||'-'}`] },
      conferences: { cols: ["Year", "Paper Title", "Conference Name", "Authors", "Publisher", "Location"], mapRow: (item, yr) => [yr, item.title, item.conferenceName, Array.isArray(item.authors) ? item.authors.join(", ") : item.authors, item.publisher||'-', item.location||'-'] },
      awards: { cols: ["Year", "Award Title", "Faculty Name", "Organization", "Journal Info", "Category"], mapRow: (item, yr) => [yr, item.title, item.facultyName, item.organization, item.journalInfo||'-', item.category||'-'] },
      events: { cols: ["Date", "Event Title", "Coordinators", "Type", "Organized By", "Description"], mapRow: (item, yr) => [item.date ? item.date.split('T')[0] : yr, item.title, Array.isArray(item.coordinators) ? item.coordinators.join(", ") : item.coordinators, item.type, item.organizedBy, item.description||'-'] },
      books: { cols: ["Year", "Book Title", "Author", "Type", "Publisher", "Series", "Link"], mapRow: (item, yr) => [yr, item.title, item.author, item.type, item.publisher, item.series||'-', item.link||'-'] },
      phdThesis: { cols: ["Year", "Thesis Title", "Scholar Name", "Supervisor", "Status"], mapRow: (item, yr) => [yr, item.thesisTitle, item.scholarName, item.supervisor, item.status] },
      patents: { cols: ["Filing Date", "Patent Title", "Inventors", "Application No.", "Country", "Status"], mapRow: (item, yr) => [item.filingDate ? item.filingDate.split('T')[0] : yr, item.title, Array.isArray(item.authors) ? item.authors.join(", ") : item.authors, item.applicationNumber, item.country, item.status] },
      talks: { cols: ["Date", "Talk Title", "Speaker", "Venue", "Description"], mapRow: (item, yr) => [item.date ? item.date.split('T')[0] : yr, item.title, item.speaker, item.venue, item.description||'-'] }
    };

    const config = pdfConfigs[categoryName];
    const tableColumn = config ? config.cols : ["Year", "Title", "Details", "Status"];
    const tableRows = filteredItems.map(item => [getExtractedYear(item), ...(config ? config.mapRow(item, getExtractedYear(item)).slice(1) : [item.title || "Untitled", JSON.stringify(item), item.status || "N/A"])]);

    autoTable(doc, {
      startY: searchTerm || filterYear !== "All" ? 52 : 40, head: [tableColumn], body: tableRows,
      theme: 'grid', styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });
    doc.save(`CISIS_${categoryName}_Report.pdf`);
    toast.success("Detailed PDF Exported Successfully!");
  };

  const renderFilterBar = (categoryName, currentItems) => {
    const allYears = [...new Set(currentItems.map(getExtractedYear))].sort((a, b) => b - a);
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by title, author, journal..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="py-2 px-3 border border-gray-300 rounded-lg outline-none text-sm bg-white">
              <option value="All">All Years</option>
              {allYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <button onClick={() => exportToPDF(categoryName, getFilteredItems(currentItems))} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center"><Download className="w-4 h-4" /> Export PDF</button>
      </div>
    );
  };

  const renderListItems = (items, categoryName) => {
    const skipKeys = ['_id', '__v', 'createdAt', 'updatedAt', 'id', 'title', 'projectTitle', 'paperTitle', 'conferenceName', 'patentTitle', 'bookTitle', 'awardName', 'scholarName', 'eventName', 'topic'];
    const formatKey = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    return items.map((item, index) => {
      const mainTitle = item.title || item.projectTitle || item.paperTitle || item.conferenceName || item.patentTitle || item.bookTitle || item.awardName || item.scholarName || item.eventName || item.topic || "Untitled Record";
      return (
        <li key={item._id || index} className="group relative bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all">
          <div className="absolute top-4 right-4 flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => initiateEdit(item, categoryName)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full" title="Edit Record"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => initiateDelete(item._id || item.id, categoryName)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-full" title="Delete Record"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="pr-20">
            <p className="text-gray-900 font-bold text-xl mb-3">{mainTitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 mt-4 pt-4 border-t border-gray-100">
              {Object.entries(item).map(([key, value]) => {
                if (skipKeys.includes(key) || value == null || value === "") return null;
                let displayValue = value;
                if (Array.isArray(value)) {
                  if (value.length === 0) return null;
                  displayValue = value.map(v => typeof v === 'object' && v !== null ? v.name || `${v.firstName||''} ${v.lastName||''}`.trim() || "Unknown" : v).join(", ");
                } else if (typeof value === 'object' && value !== null) {
                  displayValue = value.name || `${value.firstName||''} ${value.lastName||''}`.trim() || "Unknown";
                } else if (typeof value === 'string' && key.toLowerCase().includes('date')) displayValue = value.split('T')[0]; 
                
                return (
                  <div key={key} className="flex flex-col">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{formatKey(key)}</span>
                    <span className="text-sm text-gray-800 break-words font-medium">{displayValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </li>
      );
    });
  };

  // 🔥 VIEW: ANALYTICS BOARD 
  const renderAnalyticsView = () => {
    // 1. Process Data for Charts
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
      <div className="p-4 sm:p-6 bg-slate-50 min-h-[500px]">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><LayoutList className="w-8 h-8"/></div>
            <div><p className="text-sm text-gray-500 font-bold">Total Records</p><p className="text-2xl font-black text-gray-900">{totalItems}</p></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><IndianRupee className="w-8 h-8"/></div>
            <div><p className="text-sm text-gray-500 font-bold">Total Funding</p><p className="text-2xl font-black text-gray-900">₹{(totalFunding/100000).toFixed(2)}L</p></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><BarChart2 className="w-8 h-8"/></div>
            <div><p className="text-sm text-gray-500 font-bold">Publications</p><p className="text-2xl font-black text-gray-900">{dashboardData.publications?.length || 0}</p></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><PieIcon className="w-8 h-8"/></div>
            <div><p className="text-sm text-gray-500 font-bold">Projects</p><p className="text-2xl font-black text-gray-900">{dashboardData.projects?.length || 0}</p></div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Yearly Output Comparison</h3>
            <div className="h-[300px]">
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
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
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
  };

  // --- VIEW: ELEVATED (ADMIN/HOD) TABBED INTERFACE ---
  const renderElevatedView = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center gap-3 bg-slate-50">
          <FolderOpen className="w-6 h-6 text-slate-700" />
          <h2 className="text-2xl font-bold text-slate-800 m-0">Department Administration</h2>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 bg-white">
          {adminTabs.map(tab => {
            const count = Array.isArray(dashboardData[tab.id]) ? dashboardData[tab.id].length : 0;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id} onClick={() => { setActiveAdminTab(tab.id); setSearchTerm(""); setFilterYear("All"); }}
                className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors focus:outline-none whitespace-nowrap border-b-2 ${isActive ? "border-blue-600 text-blue-700 bg-blue-50/50" : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                {tab.label} 
                <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-6 bg-white min-h-[400px]">
          {renderFilterBar(activeAdminTab, dashboardData[activeAdminTab] || [])}
          {dataError && <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{dataError}</p>}
          
          {getFilteredItems(dashboardData[activeAdminTab]).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <LayoutList className="w-10 h-10 mb-3 text-gray-300" />
                <p>No records found matching your filters.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupItemsByYear(getFilteredItems(dashboardData[activeAdminTab])))
                .sort(([yearA], [yearB]) => (yearA === "Unknown Year" ? 1 : yearB === "Unknown Year" ? -1 : parseInt(yearB) - parseInt(yearA)))
                .map(([year, items]) => (
                  <div key={year} className="border-l-4 border-slate-300 pl-4 py-1">
                    <span className="inline-block bg-slate-200 text-slate-800 font-bold px-3 py-1 rounded-md text-sm mb-4">Year: {year}</span>
                    <ul className="space-y-3">{renderListItems(items, activeAdminTab)}</ul>
                  </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- VIEW: FACULTY COLLAPSIBLE INTERFACE ---
  const renderFacultyView = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">My Contributions</h2>
        {dataError && <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{dataError}</p>}
        
        <div className="space-y-4">
          {Object.entries(dashboardData).map(([categoryName, itemsArray]) => {
            if (!itemsArray || itemsArray.length === 0) return null;
            const isExpanded = expandedCategories[categoryName];
            const filteredData = getFilteredItems(itemsArray);
            const yearsData = groupItemsByYear(filteredData);

            return (
              <div key={categoryName} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <button onClick={() => { toggleCategory(categoryName); setSearchTerm(""); setFilterYear("All"); }} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-blue-800 capitalize m-0">{categoryName.replace(/([A-Z])/g, ' $1').trim()}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{itemsArray.length} items</span>
                  </div>
                  <div className="p-1 bg-white rounded-full shadow-sm border border-gray-200">
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
                    {renderFilterBar(categoryName, itemsArray)}
                    
                    {filteredData.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No records match your filters.</p>
                    ) : (
                      <div className="space-y-6">
                        {Object.entries(yearsData)
                          .sort(([yearA], [yearB]) => (yearA === "Unknown Year" ? 1 : yearB === "Unknown Year" ? -1 : parseInt(yearB) - parseInt(yearA)))
                          .map(([year, items]) => (
                          <div key={year} className="border-l-4 border-blue-300 pl-4 py-1">
                            <span className="inline-block bg-blue-50 text-blue-800 font-bold px-3 py-1 rounded-md text-sm mb-4 border border-blue-100 shadow-sm">Year: {year}</span>
                            <ul className="space-y-3">{renderListItems(items, categoryName)}</ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="bg-transparent pb-20">
      <main className="max-w-7xl mx-auto w-full px-4">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Name</p><p className="text-lg font-medium text-gray-900">{user?.name}</p></div>
            <div><p className="text-sm text-gray-500">Email</p><p className="text-lg font-medium text-gray-900">{user?.email}</p></div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <span className={`inline-flex items-center px-3 py-1 mt-1 rounded-full text-sm font-bold capitalize ${hasElevatedAccess ? 'bg-slate-800 text-white' : 'bg-blue-100 text-blue-800'}`}>
                {user?.role === 'faculty' && hasElevatedAccess ? 'Head of Department' : user?.role}
              </span>
            </div>
            {user?.facultyProfile && (
              <div><p className="text-sm text-gray-500">Faculty ID</p><p className="text-lg font-medium text-gray-900">{user.facultyProfile._id || user.facultyProfile}</p></div>
            )}
          </div>
        </div>

        {/* Dynamic View based on HOD/Admin status */}
        {hasElevatedAccess ? renderElevatedView() : renderFacultyView()}
      </main>

      {/* --- MODALS --- */}
      <ConfirmationModal isOpen={deleteConfig.isOpen} title="Delete Record" message="Are you sure you want to delete this record?" confirmText="Delete" confirmColor="bg-red-600" onConfirm={handleConfirmDelete} onCancel={() => setDeleteConfig({ ...deleteConfig, isOpen: false })} isLoading={deleteConfig.isDeleting} />
      <PublicationEditModal isOpen={editConfig.isOpen && editConfig.category === 'publications'} publication={editConfig.item} onClose={() => setEditConfig({ isOpen: false, item: null, category: null })} onSuccess={(data) => handleUpdateSuccess(data, 'publications')} />
      <ProjectEditModal isOpen={editConfig.isOpen && editConfig.category === 'projects'} item={editConfig.item} onClose={() => setEditConfig({ isOpen: false, item: null, category: null })} onSuccess={(data) => handleUpdateSuccess(data, 'projects')} />
      <ConferenceEditModal isOpen={editConfig.isOpen && editConfig.category === 'conferences'} item={editConfig.item} onClose={() => setEditConfig({ isOpen: false, item: null, category: null })} onSuccess={(data) => handleUpdateSuccess(data, 'conferences')} />
      <FacultyAwardEditModal isOpen={editConfig.isOpen && editConfig.category === 'awards'} item={editConfig.item} onClose={() => setEditConfig({ isOpen: false, item: null, category: null })} onSuccess={(data) => handleUpdateSuccess(data, 'awards')} />
      <DepartmentEventEditModal isOpen={editConfig.isOpen && editConfig.category === 'events'} item={editConfig.item} onClose={() => setEditConfig({ isOpen: false, item: null, category: null })} onSuccess={(data) => handleUpdateSuccess(data, 'events')} />
      <PublishedBookEditModal isOpen={editConfig.isOpen && editConfig.category === 'books'} item={editConfig.item} onClose={() => setEditConfig({ isOpen: false, item: null, category: null })} onSuccess={(data) => handleUpdateSuccess(data, 'books')} />
      <PhdThesisEditModal isOpen={editConfig.isOpen && editConfig.category === 'phdThesis'} item={editConfig.item} onClose={() => setEditConfig({ isOpen: false, item: null, category: null })} onSuccess={(data) => handleUpdateSuccess(data, 'phdThesis')} />
      <PatentEditModal isOpen={editConfig.isOpen && editConfig.category === 'patents'} item={editConfig.item} onClose={() => setEditConfig({ isOpen: false, item: null, category: null })} onSuccess={(data) => handleUpdateSuccess(data, 'patents')} />
      <InvitedTalkEditModal isOpen={editConfig.isOpen && editConfig.category === 'talks'} item={editConfig.item} onClose={() => setEditConfig({ isOpen: false, item: null, category: null })} onSuccess={(data) => handleUpdateSuccess(data, 'talks')} />
    </div>
  );
}