import { useState } from "react";
import config from "../../config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function DepartmentEventForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    coordinators: "",
    type: "Event",
    description: "",
    date: "",
    organizedBy: "Department"
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
      const res = await fetch(`${config.API_BASE_URL}/api/v1/departmentEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          coordinators: form.coordinators
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c)
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Department event added successfully!");

        // ✅ Redirect
        navigate("/quick-actions");
      } else {
        toast.error(data.message || "Error adding event");
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
        <h2 className="text-2xl font-bold mb-2">Add Department Event</h2>

        <p className="text-sm text-gray-500 mb-6">
          Enter coordinators exactly as in profile for dashboard linking.
        </p>

        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="coordinators"
          placeholder="Coordinators (comma separated)"
          value={form.coordinators}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Type
          </label>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Seminar">Seminar</option>
            <option value="Workshop">Workshop</option>
            <option value="Conference">Conference</option>
            <option value="Event">Event</option>
          </select>
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          rows="4"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="organizedBy"
          placeholder="Organized By"
          value={form.organizedBy}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-2.5 rounded hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Event"}
        </button>
      </form>
    </div>
  );
}