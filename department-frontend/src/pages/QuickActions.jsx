import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Briefcase, Users, GraduationCap, 
  Lightbulb, BookOpen, Calendar, Mic, Award, Upload, ShieldCheck, UserCog // <-- Added UserCog
} from 'lucide-react';

const QuickActions = () => {
  const userRole = localStorage.getItem("role");

  const actions = [
    { title: 'Add Publication', desc: 'Log new research papers, journals, and articles to the database.', icon: FileText, path: '/forms/publication', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Add Project', desc: 'Record new funding, consultancy, or national research projects.', icon: Briefcase, path: '/forms/project', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Add Conference', desc: 'Register conferences attended, organized, or presented at.', icon: Users, path: '/forms/conference', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Add PhD Thesis', desc: 'Add new supervised student thesis records to your profile.', icon: GraduationCap, path: '/forms/phd-thesis', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Add Patent', desc: 'File new applications or record officially granted patents.', icon: Lightbulb, path: '/forms/patent', color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Add Published Book', desc: 'Register published books or individual textbook chapters.', icon: BookOpen, path: '/forms/published-book', color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Add Event', desc: 'Log department events, hosted workshops, or seminars.', icon: Calendar, path: '/forms/department-event', color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Add Invited Talk', desc: 'Record guest lectures, keynote speeches, or expert talks.', icon: Mic, path: '/forms/invited-talk', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { title: 'Add Award', desc: 'Register new honors, recognitions, or faculty achievements.', icon: Award, path: '/forms/faculty-award', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Bulk Upload', desc: 'Import multiple records instantly via CSV or Excel sheets.', icon: Upload, path: '/bulk-upload', color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  // 🔥 Inject Admin Cards if they have the correct role
  if (userRole === "admin") {
    // Add Manage Users Card
    actions.unshift({
      title: "Manage Users",
      desc: "View users, update roles, and manage system access.",
      icon: UserCog,
      path: "/manage-users",
      color: "text-white",
      bg: "bg-blue-800"
    });
    
    // Add New Faculty Card
    actions.unshift({
      title: "Add New Faculty",
      desc: "Generate public profile and create secure user login credentials.",
      icon: ShieldCheck,
      path: "/forms/faculty",
      color: "text-white",
      bg: "bg-slate-800"
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Quick Actions</h1>
        <p className="text-gray-500 mt-1">Select an operation below to add new records directly to the department database.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const borderStyle = 'border border-gray-200 shadow-sm';
          
          return (
            <Link 
              key={index} 
              to={action.path}
              className={`group bg-white p-6 rounded-xl ${borderStyle} hover:shadow-lg hover:border-blue-400 transition-all duration-200 flex flex-col items-start gap-4`}
            >
              <div className={`p-4 rounded-lg ${action.bg} ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed font-medium">
                  {action.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;