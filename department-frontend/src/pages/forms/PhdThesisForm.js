import { useState } from "react";
import config from "../../config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PhdThesisForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    scholarName: "",
    thesisTitle: "",
    supervisor: "",
    year: new Date().getFullYear(),
    status: "Ongoing",
    fellowshipProgram: "Institute Fellow",
    dateOfJoining: "",
    dateOfProposal: "",
    dateOfPhdQualified: "",
    dateOfPreSubmission: "",
    dateOfThesisSubmission: "",
    dateOfVivaVoce: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    const payload = { ...form, year: parseInt(form.year) };
    Object.keys(payload).forEach(key => {
      if (key.startsWith("date") && payload[key] === "") delete payload[key];
    });

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/phdThesis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("PhD Thesis added successfully!");
        navigate("/quick-actions");
      } else {
        toast.error(data.message || "Error adding PhD thesis");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-6">
      <button
        onClick={() => navigate("/quick-actions")}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Quick Actions
      </button>

      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md mt-6">
        <h2 className="text-2xl font-bold mb-6">Add PhD Thesis</h2>

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Scholar Name
            </label>
            <input
              type="text"
              name="scholarName"
              value={form.scholarName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Thesis Title
            </label>
            <input
              type="text"
              name="thesisTitle"
              value={form.thesisTitle}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* 🔥 UPDATED SUPERVISOR FIELD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Supervisor
            </label>

            <p className="text-xs text-gray-500 mb-1">
              Enter supervisor name exactly as in your profile
            </p>

            <input
              type="text"
              name="supervisor"
              value={form.supervisor}
              onChange={handleChange}
              placeholder="e.g. Dr. John Doe"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Fellowship Program
            </label>
            <select
              name="fellowshipProgram"
              value={form.fellowshipProgram}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Institute Fellow">Institute Fellow</option>
              <option value="Industry Sponsored Fellowship">
                Industry Sponsored Fellowship
              </option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* YEAR + STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Awarded">Awarded</option>
            </select>
          </div>
        </div>

        {/* DATES */}
        <h3 className="text-lg font-bold mb-4 pt-4 border-t text-gray-700">
          Milestone Dates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            ["dateOfJoining", "Date of Joining"],
            ["dateOfProposal", "Proposal"],
            ["dateOfPhdQualified", "PhD Qualified"],
            ["dateOfPreSubmission", "Pre-Submission"],
            ["dateOfThesisSubmission", "Thesis Submission"],
            ["dateOfVivaVoce", "Viva-Voce"]
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-500 uppercase">
                {label}
              </label>
              <input
                type="date"
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Thesis"}
        </button>
      </form>
    </div>
  );
}