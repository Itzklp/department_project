import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const PublicationForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    journal: '',
    year: '',
    doi: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API Call Simulation
      // await axios.post('/api/v1/publications', formData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      toast.success('Publication added successfully!');
      
      // Auto-redirect to dashboard after short delay
      setTimeout(() => navigate('/dashboard'), 500);
      
    } catch (error) {
      toast.error('Failed to save publication. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Publication</h1>
        <p className="text-gray-500 mt-1">Enter the details of your latest research paper or journal article.</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Row 1: Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
              Paper Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. A novel approach to quantum computing..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
            />
          </div>

          {/* Row 2: Grid for Journal & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="journal" className="block text-sm font-semibold text-gray-700 mb-1">
                Journal / Conference Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="journal"
                name="journal"
                required
                value={formData.journal}
                onChange={handleChange}
                placeholder="e.g. IEEE Transactions"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-1">
                Publication Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="year"
                name="year"
                required
                min="1990"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={handleChange}
                placeholder="YYYY"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
              />
            </div>
          </div>

          {/* Row 3: Optional DOI */}
          <div>
            <label htmlFor="doi" className="block text-sm font-semibold text-gray-700 mb-1">
              DOI Link <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <input
              type="url"
              id="doi"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              placeholder="https://doi.org/10.1000/xyz123"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
            />
          </div>

          <hr className="border-gray-100 my-6" />

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 min-w-[140px] transition-colors"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Record
                </>
              )}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default PublicationForm;