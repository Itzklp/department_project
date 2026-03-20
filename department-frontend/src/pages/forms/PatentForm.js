import { useState } from "react";
import config from "../../config";

export default function PatentForm() {
  const [form, setForm] = useState({
    authors: "",
    title: "",
    applicationNumber: "",
    filingDate: "",
    country: "India",
    status: "Filed"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get the token

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/patent`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // CRITICAL: Auth header added
        },
        body: JSON.stringify({
          ...form,
          authors: form.authors.split(",").map(a => a.trim()).filter(a => a)
        }),
      });

      if (res.ok) {
        alert("Patent added successfully!");
        setForm({
          authors: "", title: "", applicationNumber: "",
          filingDate: "", country: "India", status: "Filed"
        });
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error adding patent");
      }
    } catch (err) {
      alert("Network error");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-2">Add Patent</h2>
      <p className="text-sm text-gray-500 mb-6">
        Note: Type your name <strong>exactly</strong> as it appears in your profile to link this to your dashboard.
      </p>

      <input type="text" name="authors" placeholder="Inventors (comma separated)" value={form.authors} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <input type="text" name="title" placeholder="Patent Title" value={form.title} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <input type="text" name="applicationNumber" placeholder="Application Number" value={form.applicationNumber} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <input type="text" name="filingDate" placeholder="Filing Date (e.g., 2024-03-15)" value={form.filingDate} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <input type="text" name="country" placeholder="Country" value={form.country} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="Filed">Filed</option>
          <option value="Published">Published</option>
          <option value="Granted">Granted</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white font-medium px-4 py-2.5 rounded hover:bg-blue-700 transition-colors">
        Submit Patent
      </button>
    </form>
  );
}