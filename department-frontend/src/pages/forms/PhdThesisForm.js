import { useState } from "react";
import config from "../../config";

export default function PhdThesisForm() {
  const [form, setForm] = useState({
    scholarName: "",
    thesisTitle: "",
    supervisor: "", // This must match your profile name to show on dashboard
    year: new Date().getFullYear(),
    status: "Ongoing"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get token

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/phdThesis`, {
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
        alert("PhD Thesis record added successfully!");
        setForm({ scholarName: "", thesisTitle: "", supervisor: "", year: new Date().getFullYear(), status: "Ongoing" });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error adding PhD thesis");
      }
    } catch (err) {
      alert("Network error");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-2">Add PhD Thesis</h2>
      <p className="text-sm text-gray-500 mb-6">
        Note: Type your name <strong>exactly</strong> as it appears in your profile in the Supervisor field to link this to your dashboard.
      </p>

      <input type="text" name="scholarName" placeholder="Scholar Name" value={form.scholarName} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <input type="text" name="thesisTitle" placeholder="Thesis Title" value={form.thesisTitle} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <input type="text" name="supervisor" placeholder="Supervisor Name" value={form.supervisor} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <input type="number" name="year" placeholder="Year" value={form.year} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Awarded">Awarded</option>
        </select>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white font-medium px-4 py-2.5 rounded hover:bg-blue-700 transition-colors">
        Submit Thesis
      </button>
    </form>
  );
}