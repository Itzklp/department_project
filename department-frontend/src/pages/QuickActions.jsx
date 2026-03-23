import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Award, Calendar, Mic, Briefcase, GraduationCap, Users } from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();
  // Fetch the role from local storage (set during login)
  const userRole = localStorage.getItem("role"); 

  // Standard actions for everyone
  const actions = [
    { title: "Add Publication", icon: BookOpen, path: "/forms/publication", color: "bg-blue-100 text-blue-600" },
    { title: "Add Project", icon: Briefcase, path: "/forms/project", color: "bg-green-100 text-green-600" },
    { title: "Add Conference", icon: Mic, path: "/forms/conference", color: "bg-purple-100 text-purple-600" },
    { title: "Add Faculty Award", icon: Award, path: "/forms/faculty-award", color: "bg-yellow-100 text-yellow-600" },
    { title: "Add Event", icon: Calendar, path: "/forms/department-event", color: "bg-pink-100 text-pink-600" },
    { title: "Add PhD Thesis", icon: GraduationCap, path: "/forms/phd-thesis", color: "bg-indigo-100 text-indigo-600" },
    { title: "Add Patent", icon: FileText, path: "/forms/patent", color: "bg-teal-100 text-teal-600" },
    { title: "Add Published Book", icon: BookOpen, path: "/forms/published-book", color: "bg-orange-100 text-orange-600" },
    { title: "Add Invited Talk", icon: Mic, path: "/forms/invited-talk", color: "bg-red-100 text-red-600" },
  ];

  // 🔥 ADMIN ONLY: Inject the Faculty Creation card at the top
  if (userRole === "admin") {
    actions.unshift({
      title: "Add New Faculty",
      icon: Users,
      path: "/forms/faculty",
      color: "bg-slate-800 text-white shadow-md border-2 border-slate-900", // Stands out visually
      description: "Create profile & generate login"
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Quick Actions</h1>
      <p className="text-gray-500 mb-8">Select a category to add new records to the department database.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="flex items-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className={`p-4 rounded-lg mr-4 transition-transform group-hover:scale-110 ${action.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                {action.description && <p className="text-xs text-gray-500 mt-1">{action.description}</p>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}