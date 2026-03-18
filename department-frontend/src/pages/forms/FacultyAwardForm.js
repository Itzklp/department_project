import { useState } from "react";
import config from "../../config";

export default function FacultyAwardForm() {
  const [form, setForm] = useState({
    facultyName: "",
    title: "",
    organization: "",
    journalInfo: "",
    year: new Date().getFullYear(),
    category: "Faculty"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/facultyAward`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year)
        }),
      });

      if (res.ok) {
        alert("Faculty award added successfully!");
        setForm({
          facultyName: "",
          title: "",
          organization: "",
          journalInfo: "",
          year: new Date().getFullYear(),
          category: "Faculty"
        });
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error adding faculty award");
      }
    } catch (err) {
      alert("Network error");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Faculty Award</h2>

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
        placeholder="Award/Recognition Title"
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
        placeholder="Journal Info (e.g., Q1, SCI: IF 3.8)"
        value={form.journalInfo}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="number"
        name="year"
        placeholder="Year"
        value={form.year}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        min="1990"
        max={new Date().getFullYear() + 1}
        required
      />

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Faculty">Faculty</option>
          <option value="Student">Student</option>
          <option value="Department">Department</option>
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