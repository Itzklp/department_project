import React, { useState, useEffect } from 'react';
import config from '../../config';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';

export default function PublicationEditModal({ isOpen, onClose, publication, onSuccess }) {
  const [form, setForm] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when modal opens or publication changes
  useEffect(() => {
    if (publication) {
      setForm({
        title: publication.title || "",
        year: publication.year || "",
        journal: publication.journal || "",
        volume: publication.volume || "",
        issue: publication.issue || "",
        pages: publication.pages || "",
        doi: publication.doi || ""
      });
    }
  }, [publication]);

  if (!isOpen || !publication) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Triggered by the "Update" button in the form
  const handleUpdateInitiate = (e) => {
    e.preventDefault();
    setIsConfirming(true); // Opens the confirmation dialog
  };

  // Triggered by "Yes" in the confirmation dialog
  const handleConfirmedUpdate = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/publication/${publication._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Record updated successfully!");
        onSuccess(data); // Pass updated data back to Dashboard to update state
        setIsConfirming(false);
        onClose();
      } else {
        toast.error(data.message || data.error || "Failed to update record.");
        setIsConfirming(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error occurred.");
      setIsConfirming(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4 py-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Publication</h2>
          
          <form onSubmit={handleUpdateInitiate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Journal/Conference *</label>
                <input type="text" name="journal" value={form.journal} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <input type="number" name="year" value={form.year} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
                <input type="text" name="volume" value={form.volume} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue</label>
                <input type="text" name="issue" value={form.issue} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                <input type="text" name="pages" value={form.pages} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DOI</label>
              <input type="text" name="doi" value={form.doi} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg outline-none" />
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-5 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                Update Record
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Nested Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirming}
        title="Confirm Update"
        message="Are you sure you want to update this record? The changes will be visible immediately."
        confirmText="Yes, Update"
        confirmColor="bg-blue-600 hover:bg-blue-700"
        onConfirm={handleConfirmedUpdate}
        onCancel={() => setIsConfirming(false)}
        isLoading={isSubmitting}
      />
    </>
  );
}