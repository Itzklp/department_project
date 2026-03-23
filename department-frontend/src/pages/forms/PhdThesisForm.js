import { useState } from "react";
import config from "../../config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PhdThesisForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    scholarName: "",
    thesisTitle: "",
    supervisor: "",
    year: new Date().getFullYear(),
    status: "Ongoing"
  });

  // ✅ NEW
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/phdThesis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year)
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("PhD Thesis added successfully!");

        // ✅ Redirect like other forms
        navigate("/quick-actions");
      } else {
        toast.error(data.message || "Error adding PhD thesis");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 mt-6">
      
      {/* ✅ Back Button */}
      <button
        type="button"
        onClick={() => navigate("/quick-actions")}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Quick Actions
      </button>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6"
      >
        <h2 className="text-2xl font-bold mb-2">Add PhD Thesis</h2>

        <p className="text-sm text-gray-500 mb-6">
          Note: Enter your name <strong>exactly</strong> as in profile
        </p>

        <input
          type="text"
          name="scholarName"
          placeholder="Scholar Name"
          value={form.scholarName}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="thesisTitle"
          placeholder="Thesis Title"
          value={form.thesisTitle}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="supervisor"
          placeholder="Supervisor Name"
          value={form.supervisor}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="number"
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Status
          </label>

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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-2.5 rounded hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Thesis"}
        </button>
      </form>
    </div>
  );
}