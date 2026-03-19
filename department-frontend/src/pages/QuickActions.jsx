import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Briefcase, Users, GraduationCap, 
  Lightbulb, BookOpen, Calendar, Mic, Award, Upload, ArrowLeft 
} from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { title: 'Add Publication', desc: 'Journals, conferences, and papers', icon: FileText, path: '/forms/publication', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Add Project', desc: 'Research and consultancy projects', icon: Briefcase, path: '/forms/project', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Add Conference', desc: 'Conferences attended or organized', icon: Users, path: '/forms/conference', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Add PhD Thesis', desc: 'Supervised student thesis records', icon: GraduationCap, path: '/forms/phd-thesis', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Add Patent', desc: 'Filed and granted patents', icon: Lightbulb, path: '/forms/patent', color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Add Published Book', desc: 'Books and book chapters', icon: BookOpen, path: '/forms/published-book', color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Add Event', desc: 'Workshops and department events', icon: Calendar, path: '/forms/department-event', color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Add Invited Talk', desc: 'Guest lectures and keynotes', icon: Mic, path: '/forms/invited-talk', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { title: 'Add Award', desc: 'Faculty awards and honors', icon: Award, path: '/forms/faculty-award', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Bulk Upload', desc: 'Upload CSV/Excel data files', icon: Upload, path: '/bulk-upload', color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Navigation & Header */}
      <div className="mb-8">
        {/* <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link> */}
        <h1 className="text-3xl font-bold text-gray-900">Quick Actions</h1>
        <p className="text-gray-500 mt-1">Select a category to add new records to your profile.</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link 
              key={index} 
              to={action.path}
              className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex items-start gap-4"
            >
              <div className={`p-3 rounded-lg ${action.bg} ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 leading-snug">
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