import React, { useState, useEffect } from 'react';
import config from '../../config';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';

export default function DepartmentEventEditModal({ isOpen, onClose, item, onSuccess }) {
  const [form, setForm] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || "",
        coordinators: Array.isArray(item.coordinators) ? item.coordinators.join(", ") : (item.coordinators || ""),
        type: item.type || "Event",
        description: item.description || "",
        date: item.date ? item.date.split('T')[0] : "",
        organizedBy: item.organizedBy || "Department"
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleUpdateInitiate = (e) => { e.preventDefault(); setIsConfirming(true); };

  const handleConfirmedUpdate = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    const payload = { ...form, coordinators: form.coordinators.split(",").map(c => c.trim()).filter(c => c) };

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/departmentEvent/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
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
          <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
          <form onSubmit={handleUpdateInitiate} className="space-y-4">
            <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Event Title" />
            <input type="text" name="coordinators" value={form.coordinators} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Coordinators (comma separated)" />
            
            <div className="grid grid-cols-2 gap-4">
              <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border rounded-lg"><option value="Seminar">Seminar</option><option value="Workshop">Workshop</option><option value="Conference">Conference</option><option value="Event">Event</option></select>
              <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
              <input type="text" name="organizedBy" value={form.organizedBy} onChange={handleChange} className="w-full p-2 border rounded-lg col-span-2" placeholder="Organized By" />
            </div>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Description" rows="3" />
            
            <div className="flex justify-end gap-3 mt-4"><button type="button" onClick={onClose} className="px-5 py-2 bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="px-5 py-2 text-white bg-blue-600 rounded-lg">Update</button></div>
          </form>
        </div>
      </div>
      <ConfirmationModal isOpen={isConfirming} title="Confirm Update" message="Update this record?" confirmText="Yes" confirmColor="bg-blue-600" onConfirm={handleConfirmedUpdate} onCancel={() => setIsConfirming(false)} isLoading={isSubmitting} />
    </>
  );
}