import { useState } from "react";
import config from "../../config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function FacultyAwardForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    facultyName: "",
    title: "",
    organization: "",
    journalInfo: "",
    year: new Date().getFullYear(),
    category: "Faculty"
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
      const res = await fetch(`${config.API_BASE_URL}/api/v1/facultyAward`, {
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
        toast.success("Faculty award added successfully!");

        // ✅ Redirect
        navigate("/quick-actions");
      } else {
        toast.error(data.error || "Error adding faculty award");
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
        <h2 className="text-2xl font-bold mb-2">Add Faculty Award</h2>

        <p className="text-sm text-gray-500 mb-6">
          Enter your name exactly as in profile for dashboard linking.
        </p>

        <input
          type="text"
          name="facultyName"
          placeholder="Faculty Name"
          value={form.facultyName}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="title"
          placeholder="Award Title"
          value={form.title}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="organization"
          placeholder="Organization"
          value={form.organization}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="journalInfo"
          placeholder="Journal Info"
          value={form.journalInfo}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="number"
          name="year"
          value={form.year}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          min="1990"
          max={new Date().getFullYear() + 1}
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Faculty">Faculty</option>
            <option value="Student">Student</option>
            <option value="Department">Department</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-2.5 rounded hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Award"}
        </button>
      </form>
    </div>
  );
}