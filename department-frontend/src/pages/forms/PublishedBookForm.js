import { useState } from "react";
import config from "../../config";

export default function PublishedBookForm() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    type: "Book",
    publisher: "",
    series: "",
    year: new Date().getFullYear(),
    link: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get token

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/publishedBook`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // CRITICAL: Auth header added
        },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year)
        }),
      });

      if (res.ok) {
        alert("Published book/chapter added successfully!");
        setForm({
          title: "", author: "", type: "Book", publisher: "",
          series: "", year: new Date().getFullYear(), link: ""
        });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error adding published book");
      }
    } catch (err) {
      alert("Network error");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
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

      <button type="submit" className="w-full bg-blue-600 text-white font-medium px-4 py-2.5 rounded hover:bg-blue-700 transition-colors">
        Submit Book
      </button>
    </form>
  );
}