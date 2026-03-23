import { useState, useEffect } from "react";
import Select from "react-select";
import config from "../../config";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProjectForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    projectTitle: "",
    projectPI: null,
    projectCoPI: null,
    collaborator: "",
    fundingAgency: "",
    dateSanctioned: "",
    dateCompletion: "",
    status: "",
    notableAchievements: "",
    sanctionLetterLink: "",
    totalINR: "",
    type: "National",
    category: "Government"
  });

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ NEW
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(`${config.API_BASE_URL}/api/v1/faculty`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.success) {
          const options = data.faculties.map((faculty) => ({
            value: faculty._id,
            label: `${faculty.firstName} ${faculty.lastName}`
          }));
          setFacultyOptions(options);
        }
      } catch (err) {
        console.error("Failed to fetch faculty:", err);
        toast.error("Failed to load faculty");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.projectPI) {
      toast.error("Please select a Principal Investigator");
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/project/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          projectPI: form.projectPI.value,
          projectCoPI: form.projectCoPI?.value || null,
          notableAchievements: form.notableAchievements
            ? form.notableAchievements.split(",").map(a => a.trim())
            : [],
          totalINR: parseFloat(form.totalINR)
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Project added successfully!");

        // ✅ Redirect like PublicationForm
        navigate("/quick-actions");
      } else {
        toast.error(data.message || "Error adding project");
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
        <h2 className="text-2xl font-bold mb-6">Add Project</h2>

        <input
          type="text"
          name="projectTitle"
          placeholder="Project Title"
          value={form.projectTitle}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Principal Investigator *
          </label>
          <Select
            options={facultyOptions}
            value={form.projectPI}
            onChange={(selected) =>
              setForm({ ...form, projectPI: selected })
            }
            placeholder="Select PI..."
            isLoading={isLoading}
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Co-Principal Investigator
          </label>
          <Select
            options={facultyOptions}
            value={form.projectCoPI}
            onChange={(selected) =>
              setForm({ ...form, projectCoPI: selected })
            }
            placeholder="Select Co-PI..."
            isClearable
          />
        </div>

        <input
          type="text"
          name="collaborator"
          placeholder="Collaborator"
          value={form.collaborator}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          name="fundingAgency"
          placeholder="Funding Agency"
          value={form.fundingAgency}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="date"
            name="dateSanctioned"
            value={form.dateSanctioned}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            name="dateCompletion"
            value={form.dateCompletion}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>

        <input
          type="text"
          name="status"
          placeholder="Status"
          value={form.status}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="notableAchievements"
          placeholder="Achievements (comma separated)"
          value={form.notableAchievements}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="url"
          name="sanctionLetterLink"
          placeholder="Sanction Letter Link"
          value={form.sanctionLetterLink}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="number"
          name="totalINR"
          placeholder="Total Amount"
          value={form.totalINR}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {isSubmitting ? "Submitting..." : "Submit Project"}
        </button>
      </form>
    </div>
  );
}