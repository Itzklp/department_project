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

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/patent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          authors: form.authors.split(",").map(a => a.trim()).filter(a => a)
        }),
      });

      if (res.ok) {
        alert("Patent added successfully!");
        setForm({
          authors: "",
          title: "",
          applicationNumber: "",
          filingDate: "",
          country: "India",
          status: "Filed"
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Patent</h2>

      <input
        type="text"
        name="authors"
        placeholder="Authors/Inventors (comma separated)"
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
        type="text"
        name="filingDate"
        placeholder="Filing Date (e.g., 2024-03-15)"
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

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Filed">Filed</option>
          <option value="Published">Published</option>
          <option value="Granted">Granted</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Submit
      </button>
    </form>
  );
}