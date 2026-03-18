import { useState } from "react";
import config from "../../config";

export default function PhdThesisForm() {
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    topic: "",
    supervisor: "",
    coSupervisor: "",
    yearAwarded: new Date().getFullYear()
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/phdThesis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          yearAwarded: parseInt(form.yearAwarded)
        }),
      });

      if (res.ok) {
        alert("PhD Thesis added successfully!");
        setForm({
          name: "",
          studentId: "",
          topic: "",
          supervisor: "",
          coSupervisor: "",
          yearAwarded: new Date().getFullYear()
        });
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error adding PhD thesis");
      }
    } catch (err) {
      alert("Network error");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add PhD Thesis</h2>

      <input
        type="text"
        name="name"
        placeholder="Student Name"
        value={form.name}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="studentId"
        placeholder="Student ID"
        value={form.studentId}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <textarea
        name="topic"
        placeholder="Thesis Topic"
        value={form.topic}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        rows="3"
        required
      />

      <input
        type="text"
        name="supervisor"
        placeholder="Supervisor Name"
        value={form.supervisor}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="coSupervisor"
        placeholder="Co-Supervisor Name (optional)"
        value={form.coSupervisor}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="number"
        name="yearAwarded"
        placeholder="Year Awarded"
        value={form.yearAwarded}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        min="1990"
        max={new Date().getFullYear() + 5}
        required
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