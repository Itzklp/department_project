import React from 'react';

const DataCard = ({ item, title, metadata, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all relative group">
      
      {/* Action Buttons (Visible on hover on desktop, always visible on mobile) */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <button 
          onClick={() => onEdit(item)}
          className="p-1.5 text-gray-500 bg-gray-50 hover:text-blue-600 hover:bg-blue-50 rounded-md border border-gray-200 transition-colors"
          title="Update"
        >
          ✏️
        </button>
        <button 
          onClick={() => onDelete(item)}
          className="p-1.5 text-gray-500 bg-gray-50 hover:text-red-600 hover:bg-red-50 rounded-md border border-gray-200 transition-colors"
          title="Delete"
        >
          🗑️
        </button>
      </div>

      <h4 className="text-lg font-semibold text-gray-900 mb-3 pr-16 leading-tight">{title}</h4>
      <div className="flex flex-wrap gap-y-3 gap-x-6">
        {metadata.map((meta, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
              {meta.label}
            </span>
            <span className="text-sm font-medium text-gray-700">{meta.value || 'N/A'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataCard;