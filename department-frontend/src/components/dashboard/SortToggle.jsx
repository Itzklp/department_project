import React from 'react';

const SortToggle = ({ sortMode, setSortMode }) => {
  return (
    <div className="flex items-center text-sm">
      <span className="text-gray-500 mr-2">Sort by:</span>
      <div className="bg-gray-100 p-1 rounded-lg inline-flex">
        <button
          onClick={() => setSortMode('updatedAt')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            sortMode === 'updatedAt'
              ? 'bg-white shadow-sm text-blue-700 font-medium'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Latest Updated
        </button>
        <button
          onClick={() => setSortMode('createdAt')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            sortMode === 'createdAt'
              ? 'bg-white shadow-sm text-blue-700 font-medium'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Created Date
        </button>
      </div>
    </div>
  );
};

export default SortToggle;