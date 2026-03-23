import { useState } from "react";
import config from "../../config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function InvitedTalkForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    speaker: "",
    venue: "",
    date: "",
    description: ""
  });

  // ✅ NEW
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/invitedTalk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Invited talk added successfully!");

        // ✅ Redirect
        navigate("/quick-actions");
      } else {
        toast.error(data.message || "Error adding invited talk");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 mt-6">

      {/* ✅ Back Button */}
      <button
        type="button"
        onClick={() => navigate("/quick-actions")}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Quick Actions
      </button>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6"
      >
        <h2 className="text-2xl font-bold mb-2">Add Invited Talk</h2>

        <p className="text-sm text-gray-500 mb-6">
          Enter your name exactly as in profile for dashboard linking.
        </p>

        <input
          type="text"
          name="title"
          placeholder="Talk Title / Topic"
          value={form.title}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

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
          name="venue"
          placeholder="Venue"
          value={form.venue}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description (Optional)"
          value={form.description}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          rows="3"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-2.5 rounded hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Invited Talk"}
        </button>
      </form>
    </div>
  );
}