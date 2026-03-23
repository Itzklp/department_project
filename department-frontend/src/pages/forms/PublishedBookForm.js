import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function PublishedBookForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    type: "Book",
    publisher: "",
    series: "",
    year: new Date().getFullYear(),
    link: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/publishedBook`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year)
        }),
      });

      if (res.ok) {
        toast.success("Published book/chapter added successfully!");
        navigate('/quick-actions'); // Redirect back to actions menu on success
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || errorData.error || "Error adding published book");
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
        <h2 className="text-2xl font-bold mb-2">Add Published Book/Chapter</h2>
        <p className="text-sm text-gray-500 mb-6">
          Note: Type your name <strong>exactly</strong> as it appears in your profile to link this to your dashboard.
        </p>

        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
        <input type="text" name="author" placeholder="Author Name" value={form.author} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="Book">Book</option>
            <option value="Book Chapter">Book Chapter</option>
          </select>
        </div>

        <input type="text" name="publisher" placeholder="Publisher" value={form.publisher} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
        <input type="text" name="series" placeholder="Series (optional)" value={form.series} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
        
        <input type="number" name="year" placeholder="Year" value={form.year} onChange={handleChange} className="w-full mb-3 p-2 border rounded" min="1990" max={new Date().getFullYear() + 1} required />
        <input type="url" name="link" placeholder="Link (optional)" value={form.link} onChange={handleChange} className="w-full mb-4 p-2 border rounded" />

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2">
          {isSubmitting ? "Submitting..." : "Submit Book"}
        </button>
      </form>
    </div>
  );
}