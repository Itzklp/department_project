import React, { useState, useEffect } from 'react';
import config from '../../config';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';

export default function ProjectEditModal({ isOpen, onClose, item, onSuccess }) {
  const [form, setForm] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        projectTitle: item.projectTitle || "",
        collaborator: item.collaborator || "",
        fundingAgency: item.fundingAgency || "",
        dateSanctioned: item.dateSanctioned ? item.dateSanctioned.split('T')[0] : "",
        dateCompletion: item.dateCompletion ? item.dateCompletion.split('T')[0] : "",
        status: item.status || "",
        totalINR: item.totalINR || "",
        type: item.type || "National",
        category: item.category || "Government"
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
      const res = await fetch(`${config.API_BASE_URL}/api/v1/project/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Project updated successfully!");
        onSuccess(data.project || data);
        setIsConfirming(false);
        onClose();
      } else {
        toast.error(data.message || "Failed to update project.");
        setIsConfirming(false);
      }
    } catch (err) {
      toast.error("Network error occurred.");
      setIsConfirming(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4 py-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Project</h2>
          <form onSubmit={handleUpdateInitiate} className="space-y-4">
            <input type="text" name="projectTitle" value={form.projectTitle} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Project Title" />
            <input type="text" name="fundingAgency" value={form.fundingAgency} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Funding Agency" />
            <input type="text" name="collaborator" value={form.collaborator} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Collaborators" />
            
            <div className="grid grid-cols-2 gap-4">
              <input type="date" name="dateSanctioned" value={form.dateSanctioned} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
              <input type="date" name="dateCompletion" value={form.dateCompletion} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
              <input type="number" name="totalINR" value={form.totalINR} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Total INR" />
              <input type="text" name="status" value={form.status} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Status" />
              
              <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border rounded-lg">
                <option value="National">National</option>
                <option value="International">International</option>
              </select>
              <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded-lg">
                <option value="Government">Government</option>
                <option value="Industry">Industry</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6"><button type="button" onClick={onClose} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button><button type="submit" className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Update</button></div>
          </form>
        </div>
      </div>
      <ConfirmationModal isOpen={isConfirming} title="Confirm Update" message="Are you sure you want to update this project?" confirmText="Yes, Update" confirmColor="bg-blue-600" onConfirm={handleConfirmedUpdate} onCancel={() => setIsConfirming(false)} isLoading={isSubmitting} />
    </>
  );
}