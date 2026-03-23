import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { toast } from "react-hot-toast";

export default function FacultyForm() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "Computer Science", // Default fallback
    designation: "Assistant Professor",
    joiningDate: new Date().toISOString().split('T')[0], // Sets today's date in YYYY-MM-DD format
    researchArea: "", // UI string (comma separated)
    teaches: "", // UI string (comma separated)
    password: "" 
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    // Format comma-separated strings cleanly into Arrays for the backend
    const payload = {
      ...form,
      researchArea: form.researchArea.split(",").map(item => item.trim()).filter(Boolean),
      teaches: form.teaches.split(",").map(item => item.trim()).filter(Boolean)
    };

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/faculty`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Faculty profile and User Account created successfully!");
        navigate('/dashboard');
      } else {
        toast.error(data.message || data.error || "Failed to create faculty.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-2">Register New Faculty</h2>
      <p className="text-sm text-gray-500 mb-6">
        This will generate a public Faculty Profile <strong>and</strong> an active User Login account.
      </p>

      {/* Row 1: Names */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">First Name *</label>
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name *</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
      </div>

      {/* Row 2: Email & Department */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department *</label>
          <input type="text" name="department" value={form.department} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
      </div>

      {/* Row 3: Designation & Date */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">Designation *</label>
          <select name="designation" value={form.designation} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Professor">Professor</option>
            <option value="Head of Department">Head of Department</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Joining Date</label>
          <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
      </div>

      {/* Row 4: Arrays (Research & Subjects) */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Research Areas (Comma separated)</label>
        <input type="text" name="researchArea" placeholder="e.g. AI, Cloud Computing, IoT" value={form.researchArea} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Subjects Taught (Comma separated)</label>
        <input type="text" name="teaches" placeholder="e.g. Data Structures, Operating Systems" value={form.teaches} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <hr className="mb-6 border-gray-200" />

      {/* Password Block */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
        <label className="block text-sm font-bold text-gray-800 mb-1">Temporary Login Password *</label>
        <p className="text-xs text-gray-500 mb-2">The faculty member will use this to log in for the first time.</p>
        <input type="text" name="password" placeholder="e.g. BITS@2026" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" required minLength="6" />
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-slate-800 text-white font-medium px-4 py-3 rounded hover:bg-slate-900 transition-colors disabled:opacity-50">
        {isSubmitting ? "Creating Accounts..." : "Create Faculty & User Account"}
      </button>
    </form>
  );
}