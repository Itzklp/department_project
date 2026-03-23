import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function ConferenceForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: "National", authors: "", title: "", conferenceName: "", pages: "", publisher: "", location: "", date: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/conference`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          authors: form.authors.split(",").map(a => a.trim()).filter(a => a)
        }),
      });

      if (res.ok) {
        toast.success("Conference paper added successfully!");
        navigate('/quick-actions'); // Redirect back to actions menu on success
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || errorData.message || "Error adding conference paper");
      }
    } catch (err) {
      toast.error("Network error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-6">
      {/* Back Button */}
      <button 
        type="button" 
        onClick={() => navigate('/quick-actions')}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 font-medium transition-colors focus:outline-none"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Quick Actions
      </button>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-2xl font-bold mb-2">Add Conference Paper</h2>
        <p className="text-sm text-gray-500 mb-6">Note: Type your name exactly as it appears in your profile in the Authors field to link it to your dashboard.</p>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="National">National</option>
            <option value="International">International</option>
          </select>
        </div>

        <input type="text" name="authors" placeholder="Authors (comma separated)" value={form.authors} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
        <input type="text" name="title" placeholder="Paper Title" value={form.title} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
        <input type="text" name="conferenceName" placeholder="Conference Name" value={form.conferenceName} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
        <input type="text" name="pages" placeholder="Pages (e.g., 1-10)" value={form.pages} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
        <input type="text" name="publisher" placeholder="Publisher" value={form.publisher} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
        <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
        <input type="date" name="date" placeholder="Date" value={form.date} onChange={handleChange} className="w-full mb-4 p-2 border rounded" />

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2">
          {isSubmitting ? "Submitting..." : "Submit Conference"}
        </button>
      </form>
    </div>
  );
}