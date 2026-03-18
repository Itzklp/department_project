import { useState } from "react";
import config from "../../config";

export default function FacultyForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    designation: "Prof.",
    researchArea: "",
    teaches: "",
    joiningDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
        designation: form.designation.trim() || "Prof.",
        researchArea: form.researchArea
          ? form.researchArea.split(",").map((a) => a.trim()).filter(a => a)
          : [],
        teaches: form.teaches
          ? form.teaches.split(",").map((a) => a.trim()).filter(a => a)
          : [],
      };

      // Only add joiningDate if it's provided
      if (form.joiningDate) {
        payload.joiningDate = form.joiningDate;
      }

      console.log("Sending payload:", payload); // Debug log

      const res = await fetch(`${config.API_BASE_URL}/api/v1/faculty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response:", data); // Debug log

      if (res.ok) {
        alert("Faculty added successfully!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          department: "",
          designation: "Prof.",
          researchArea: "",
          teaches: "",
          joiningDate: "",
        });
      } else {
        alert(data.message || data.error || "Error adding faculty");
        console.error("Error details:", data);
      }
    } catch (err) {
      alert("Network error: " + err.message);
      console.error("Network error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6">Add Faculty</h2>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Department <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="department"
          placeholder="Department (e.g., Computer Science)"
          value={form.department}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Designation
        </label>
        <input
          type="text"
          name="designation"
          placeholder="Designation (e.g., Prof., Asst. Prof.)"
          value={form.designation}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Research Areas
        </label>
        <input
          type="text"
          name="researchArea"
          placeholder="Research Areas (comma separated: AI, ML, NLP)"
          value={form.researchArea}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Courses Taught
        </label>
        <input
          type="text"
          name="teaches"
          placeholder="Courses (comma separated: CS101, CS201)"
          value={form.teaches}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Separate multiple courses with commas</p>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Joining Date
        </label>
        <input
          type="date"
          name="joiningDate"
          value={form.joiningDate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition font-medium"
      >
        Add Faculty
      </button>
    </form>
  );
}