import React, { useState, useEffect } from 'react';
import config from '../../config';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';

export default function InvitedTalkEditModal({ isOpen, onClose, item, onSuccess }) {
  const [form, setForm] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || "",
        speaker: item.speaker || "",
        venue: item.venue || "",
        date: item.date ? item.date.split('T')[0] : "",
        description: item.description || ""
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
      const res = await fetch(`${config.API_BASE_URL}/api/v1/invitedTalk/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) { toast.success("Talk updated!"); onSuccess(data); setIsConfirming(false); onClose(); } 
      else { toast.error(data.message || "Failed to update."); setIsConfirming(false); }
    } catch (err) { toast.error("Network error."); setIsConfirming(false); } finally { setIsSubmitting(false); }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Invited Talk</h2>
          <form onSubmit={handleUpdateInitiate} className="space-y-4">
            <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Talk Title / Topic" />
            <input type="text" name="speaker" value={form.speaker} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Speaker Name" />
            
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="venue" value={form.venue} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Venue" />
              <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
            </div>
            
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Description (Optional)" rows="3" />
            
            <div className="flex justify-end gap-3 mt-6"><button type="button" onClick={onClose} className="px-5 py-2 bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="px-5 py-2 text-white bg-blue-600 rounded-lg">Update</button></div>
          </form>
        </div>
      </div>
      <ConfirmationModal isOpen={isConfirming} title="Confirm Update" message="Update this record?" confirmText="Yes" confirmColor="bg-blue-600" onConfirm={handleConfirmedUpdate} onCancel={() => setIsConfirming(false)} isLoading={isSubmitting} />
    </>
  );
}