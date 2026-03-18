import { useState } from "react";
import config from "../../config";

export default function DepartmentEventForm() {
  const [form, setForm] = useState({
    title: "",
    type: "Event",
    description: "",
    date: "",
    organizedBy: "Department"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/departmentEvent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Department event added successfully!");
        setForm({
          title: "",
          type: "Event",
          description: "",
          date: "",
          organizedBy: "Department"
        });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error adding event");
      }
    } catch (err) {
      alert("Network error");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Department Event</h2>

      <input
        type="text"
        name="title"
        placeholder="Event Title"
        value={form.title}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
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
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Submit
      </button>
    </form>
  );
}