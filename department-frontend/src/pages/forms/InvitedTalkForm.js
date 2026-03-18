import { useState } from "react";
import config from "../../config";

export default function InvitedTalkForm() {
  const [form, setForm] = useState({
    speaker: "",
    title: "",
    event: "",
    organizer: "",
    location: "",
    date: "",
    mode: "Online",
    role: "Speaker"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/invitedTalk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Invited talk added successfully!");
        setForm({
          speaker: "",
          title: "",
          event: "",
          organizer: "",
          location: "",
          date: "",
          mode: "Online",
          role: "Speaker"
        });
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error adding invited talk");
      }
    } catch (err) {
      alert("Network error");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Invited Talk</h2>

      <input
        type="text"
        name="speaker"
        placeholder="Speaker Name"
        value={form.speaker}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="title"
        placeholder="Talk Title"
        value={form.title}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="event"
        placeholder="Event Name"
        value={form.event}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        name="organizer"
        placeholder="Organizer"
        value={form.organizer}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        name="date"
        placeholder="Date (e.g., 2024-03-15 or 15 Mar 2024)"
        value={form.date}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">Mode</label>
          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
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