import React, { useState, useEffect } from 'react';
import config from '../../config';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';

export default function FacultyAwardEditModal({ isOpen, onClose, item, onSuccess }) {
  const [form, setForm] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        facultyName: item.facultyName || "",
        title: item.title || "",
        organization: item.organization || "",
        journalInfo: item.journalInfo || "",
        year: item.year || new Date().getFullYear(),
        category: item.category || "Faculty"
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleUpdateInitiate = (e) => { e.preventDefault(); setIsConfirming(true); };

  const handleConfirmedUpdate = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/facultyAward/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ...form, year: parseInt(form.year) })
      });
      const data = await res.json();
      if (res.ok) { toast.success("Updated!"); onSuccess(data); setIsConfirming(false); onClose(); } 
      else { toast.error(data.message || "Failed to update."); setIsConfirming(false); }
    } catch (err) { toast.error("Network error."); setIsConfirming(false); } finally { setIsSubmitting(false); }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Award</h2>
          <form onSubmit={handleUpdateInitiate} className="space-y-4">
            <input type="text" name="facultyName" value={form.facultyName} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Faculty Name" />
            <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Award Title" />
            <input type="text" name="organization" value={form.organization} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Organization" />
            
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="journalInfo" value={form.journalInfo} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Journal Info" />
              <input type="number" name="year" value={form.year} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Year" />
              <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded-lg col-span-2"><option value="Faculty">Faculty</option><option value="Student">Student</option><option value="Department">Department</option></select>
            </div>
            <div className="flex justify-end gap-3 mt-6"><button type="button" onClick={onClose} className="px-5 py-2 bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="px-5 py-2 text-white bg-blue-600 rounded-lg">Update</button></div>
          </form>
        </div>
      </div>
      <ConfirmationModal isOpen={isConfirming} title="Confirm Update" message="Update this record?" confirmText="Yes" confirmColor="bg-blue-600" onConfirm={handleConfirmedUpdate} onCancel={() => setIsConfirming(false)} isLoading={isSubmitting} />
    </>
  );
}