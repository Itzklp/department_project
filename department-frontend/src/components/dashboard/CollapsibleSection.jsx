import React, { useState } from 'react';
import DataCard from './DataCard';
import EmptyState from './EmptyState';

const CollapsibleSection = ({ title, data, loading, config }) => {
  // Manage the open/close state of the accordion
  const [isOpen, setIsOpen] = useState(false);
  
  // Safely calculate the number of items
  const count = data ? data.length : 0;

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden mb-4 shadow-sm">
      
      {/* Header / Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        
        {/* Chevron Icon for expand/collapse indicator */}
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable Content Area */}
      {isOpen && (
        <div className="p-5 border-t border-gray-100 bg-gray-50/50 transition-all">
          {loading ? (
            // Loading Skeleton
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : count === 0 ? (
            // Empty State
            <EmptyState categoryName={title.toLowerCase()} />
          ) : (
            // Data Grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.map((item) => (
                <DataCard 
                  key={item._id || item.id} 
                  
                  // Pass the raw item so the card can send it back in callbacks
                  item={item} 
                  
                  // Extract the title dynamically based on the configuration
                  title={item[config.titleKey] || item[config.backupTitleKey] || "Untitled Record"} 
                  
                  // Map the metadata labels to the actual values in the item object
                  metadata={config.metadataKeys.map(metaDef => ({
                    label: metaDef.label,
                    value: item[metaDef.key]
                  }))}
                  
                  // Fire the edit/delete callbacks with necessary routing and API parameters
                  onEdit={() => config.onEdit(item, config.formRoute)}
                  onDelete={() => config.onDelete(item, config.stateKey, config.apiEndpoint)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;