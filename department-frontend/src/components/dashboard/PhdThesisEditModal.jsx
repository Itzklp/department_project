import React, { useState, useEffect } from "react";
import config from "../../config";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../common/ConfirmationModal";

export default function PhdThesisEditModal({
  isOpen,
  onClose,
  item,
  onSuccess,
}) {
  const [form, setForm] = useState({});
  const [facultyList, setFacultyList] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch faculty list for dropdown
  useEffect(() => {
    if (isOpen) {
      fetch(`${config.API_BASE_URL}/api/v1/faculty`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => setFacultyList(data.data || data))
        .catch(() => console.error("Failed to fetch faculty list"));
    }
  }, [isOpen]);

  useEffect(() => {
    if (item) {
      const formatDate = (dateStr) => (dateStr ? dateStr.split("T")[0] : "");
      setForm({
        scholarName: item.scholarName || "",
        thesisTitle: item.thesisTitle || "",
        supervisor: item.supervisor || "",
        year: item.year || new Date().getFullYear(),
        status: item.status || "Ongoing",
        fellowshipProgram: item.fellowshipProgram || "Institute Fellow",
        dateOfJoining: formatDate(item.dateOfJoining),
        dateOfProposal: formatDate(item.dateOfProposal),
        dateOfPhdQualified: formatDate(item.dateOfPhdQualified),
        dateOfPreSubmission: formatDate(item.dateOfPreSubmission),
        dateOfThesisSubmission: formatDate(item.dateOfThesisSubmission),
        dateOfVivaVoce: formatDate(item.dateOfVivaVoce),
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleUpdateInitiate = (e) => {
    e.preventDefault();
    setIsConfirming(true);
  };

  const handleConfirmedUpdate = async () => {
    setIsSubmitting(true);
    const payload = { ...form, year: parseInt(form.year) };
    Object.keys(payload).forEach((key) => {
      if (key.startsWith("date") && payload[key] === "") payload[key] = null;
    });

    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/v1/phdThesis/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Thesis updated!");
        onSuccess(data);
        setIsConfirming(false);
        onClose();
      } else {
        toast.error(data.message || "Failed to update.");
        setIsConfirming(false);
      }
    } catch (err) {
      toast.error("Network error.");
      setIsConfirming(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 my-8">
          <h2 className="text-2xl font-bold mb-6">Edit PhD Thesis</h2>
          <form onSubmit={handleUpdateInitiate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Scholar Name</label>
                <input
                  type="text"
                  name="scholarName"
                  value={form.scholarName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Thesis Title</label>
                <input
                  type="text"
                  name="thesisTitle"
                  value={form.thesisTitle}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Supervisor</label>
                <input
                  type="text"
                  name="supervisor"
                  value={form.supervisor}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
                <p className="text-[10px] text-blue-600 mt-0.5 font-medium italic">
                  * Write name exactly as given in profile.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">
                  Fellowship Program
                </label>
                <select
                  name="fellowshipProgram"
                  value={form.fellowshipProgram}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Institute Fellow">Institute Fellow</option>
                  <option value="Industry Sponsored Fellowship">
                    Industry Sponsored Fellowship
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Year</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Awarded">Awarded</option>
                </select>
              </div>
            </div>

            {/* Dates Grid */}
            <h4 className="font-bold pt-3 mt-3 border-t text-sm text-gray-500">
              Dates (Optional)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs">DOJ</label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={form.dateOfJoining}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Proposal</label>
                <input
                  type="date"
                  name="dateOfProposal"
                  value={form.dateOfProposal}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Qualified</label>
                <input
                  type="date"
                  name="dateOfPhdQualified"
                  value={form.dateOfPhdQualified}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Pre-Submission</label>
                <input
                  type="date"
                  name="dateOfPreSubmission"
                  value={form.dateOfPreSubmission}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Thesis Submission</label>
                <input
                  type="date"
                  name="dateOfThesisSubmission"
                  value={form.dateOfThesisSubmission}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Viva Voce</label>
                <input
                  type="date"
                  name="dateOfVivaVoce"
                  value={form.dateOfVivaVoce}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-white bg-blue-600 rounded-lg"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirming}
        title="Confirm Update"
        message="Update this record?"
        confirmText="Yes"
        confirmColor="bg-blue-600"
        onConfirm={handleConfirmedUpdate}
        onCancel={() => setIsConfirming(false)}
        isLoading={isSubmitting}
      />
    </>
  );
}
