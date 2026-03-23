import { useState } from "react";
import config from "../../config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PatentForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    authors: "",
    title: "",
    applicationNumber: "",
    filingDate: "",
    country: "India",
    status: "Filed"
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
      const res = await fetch(`${config.API_BASE_URL}/api/v1/patent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          authors: form.authors
            .split(",")
            .map(a => a.trim())
            .filter(a => a)
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Patent added successfully!");

        // ✅ Redirect
        navigate("/quick-actions");
      } else {
        toast.error(data.error || "Error adding patent");
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
        <h2 className="text-2xl font-bold mb-2">Add Patent</h2>

        <p className="text-sm text-gray-500 mb-6">
          Enter inventors (comma separated). Ensure your name matches profile.
        </p>

        <input
          type="text"
          name="authors"
          placeholder="Inventors (comma separated)"
          value={form.authors}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="title"
          placeholder="Patent Title"
          value={form.title}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="applicationNumber"
          placeholder="Application Number"
          value={form.applicationNumber}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="date"
          name="filingDate"
          value={form.filingDate}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
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
            <option value="Filed">Filed</option>
            <option value="Published">Published</option>
            <option value="Granted">Granted</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-2.5 rounded hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Patent"}
        </button>
      </form>
    </div>
  );
}