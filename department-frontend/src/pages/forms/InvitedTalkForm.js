import { useState } from "react";
import config from "../../config";

export default function InvitedTalkForm() {
  const [form, setForm] = useState({
    title: "",
    speaker: "", // Matches the Model field
    venue: "",
    date: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get token

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/invitedTalk`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // CRITICAL: Auth header added
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Invited talk added successfully!");
        setForm({ title: "", speaker: "", venue: "", date: "", description: "" });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error adding invited talk");
      }
    } catch (err) {
      alert("Network error");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-2">Add Invited Talk</h2>
      <p className="text-sm text-gray-500 mb-6">
        Note: Type your name <strong>exactly</strong> as it appears in your profile in the Speaker field to link this to your dashboard.
      </p>

      <input type="text" name="title" placeholder="Talk Title / Topic" value={form.title} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <input type="text" name="speaker" placeholder="Speaker Name" value={form.speaker} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <input type="text" name="venue" placeholder="Venue" value={form.venue} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <textarea name="description" placeholder="Description (Optional)" value={form.description} onChange={handleChange} className="w-full mb-4 p-2 border rounded" rows="3" />

      <button type="submit" className="w-full bg-blue-600 text-white font-medium px-4 py-2.5 rounded hover:bg-blue-700 transition-colors">
        Submit Invited Talk
      </button>
    </form>
  );
}