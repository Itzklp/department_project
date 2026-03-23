import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function FacultyForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "Computer Science",
    designation: "Assistant Professor",
    joiningDate: new Date().toISOString().split("T")[0],
    researchArea: "",
    teaches: "",
    password: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    const payload = {
      ...form,
      researchArea: form.researchArea
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      teaches: form.teaches
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/faculty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Faculty profile and account created!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || data.error || "Failed to create faculty");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-6">

      {/* ✅ Back Button */}
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold mb-2">Register New Faculty</h2>

        <p className="text-sm text-gray-500 mb-6">
          This creates a faculty profile and login account.
        </p>

        {/* Names */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>

        {/* Email + Dept */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>

        {/* Designation + Date */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <select
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option>Assistant Professor</option>
            <option>Associate Professor</option>
            <option>Professor</option>
            <option>Head of Department</option>
          </select>

          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Research */}
        <input
          type="text"
          name="researchArea"
          placeholder="Research Areas (comma separated)"
          value={form.researchArea}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          name="teaches"
          placeholder="Subjects Taught (comma separated)"
          value={form.teaches}
          onChange={handleChange}
          className="w-full mb-6 p-2 border rounded"
        />

        {/* Password */}
        <input
          type="text"
          name="password"
          placeholder="Temporary Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-800 text-white py-3 rounded hover:bg-slate-900 disabled:opacity-50"
        >
          {isSubmitting
            ? "Creating Accounts..."
            : "Create Faculty & User Account"}
        </button>
      </form>
    </div>
  );
}