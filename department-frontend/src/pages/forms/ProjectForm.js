import { useState, useEffect } from "react";
import Select from "react-select";
import config from "../../config";

export default function ProjectForm() {
  const [form, setForm] = useState({
    projectTitle: "", projectPI: null, projectCoPI: null, collaborator: "",
    fundingAgency: "", dateSanctioned: "", dateCompletion: "", status: "",
    notableAchievements: "", sanctionLetterLink: "", totalINR: "", type: "National", category: "Government"
  });

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${config.API_BASE_URL}/api/v1/faculty`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const options = data.faculties.map((faculty) => ({
            value: faculty._id, label: `${faculty.firstName} ${faculty.lastName}`,
          }));
          setFacultyOptions(options);
        }
      } catch (err) {
        console.error("Failed to fetch faculty:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.projectPI) return alert("Please select a Principal Investigator");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/project/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...form,
          projectPI: form.projectPI.value,
          projectCoPI: form.projectCoPI?.value || null,
          notableAchievements: form.notableAchievements ? form.notableAchievements.split(",").map(a => a.trim()) : [],
          totalINR: parseFloat(form.totalINR)
        }),
      });

      if (res.ok) {
        alert("Project added successfully!");
        setForm({
          projectTitle: "", projectPI: null, projectCoPI: null, collaborator: "", fundingAgency: "",
          dateSanctioned: "", dateCompletion: "", status: "", notableAchievements: "", sanctionLetterLink: "",
          totalINR: "", type: "National", category: "Government"
        });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error adding project");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6">Add Project</h2>

      <input type="text" name="projectTitle" placeholder="Project Title" value={form.projectTitle} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Principal Investigator *</label>
        <Select name="projectPI" options={facultyOptions} value={form.projectPI} onChange={(selected) => setForm({ ...form, projectPI: selected })} placeholder="Select PI..." isLoading={isLoading} />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Co-Principal Investigator</label>
        <Select name="projectCoPI" options={facultyOptions} value={form.projectCoPI} onChange={(selected) => setForm({ ...form, projectCoPI: selected })} placeholder="Select Co-PI..." isClearable />
      </div>

      <input type="text" name="collaborator" placeholder="Collaborator" value={form.collaborator} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
      <input type="text" name="fundingAgency" placeholder="Funding Agency" value={form.fundingAgency} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">Date Sanctioned</label>
          <input type="date" name="dateSanctioned" value={form.dateSanctioned} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date Completion</label>
          <input type="date" name="dateCompletion" value={form.dateCompletion} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
      </div>

      <input type="text" name="status" placeholder="Status (e.g., Ongoing, Completed)" value={form.status} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <input type="text" name="notableAchievements" placeholder="Notable Achievements (comma separated)" value={form.notableAchievements} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
      <input type="url" name="sanctionLetterLink" placeholder="Sanction Letter Link" value={form.sanctionLetterLink} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
      <input type="number" name="totalINR" placeholder="Total Amount (INR)" value={form.totalINR} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="National">National</option>
            <option value="International">International</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="Government">Government</option>
            <option value="Industry">Industry</option>
          </select>
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white font-medium px-4 py-2.5 rounded hover:bg-blue-700 transition-colors">
        Submit Project
      </button>
    </form>
  );
}