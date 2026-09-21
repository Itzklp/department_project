import { useState, useEffect } from "react";
import Select from "react-select";
import config from "../../config";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";

const emptyForm = {
  psrn: "",
  projectTitle: "",
  projectPI: null,
  projectCoPI: null,
  collaborator: "",
  fundingAgency: "",
  scheme: "",
  dateSanctioned: "",
  projectStartDate: "",
  dateCompletion: "",
  status: "",
  notableAchievements: "",
  sanctionLetterLink: "",
  totalINR: "",
  type: "Sponsored",
  category: "Govt",
};

export default function ProjectEditModal({ isOpen, item, onClose, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch faculty options for the PI / Co-PI selects
  useEffect(() => {
    if (!isOpen) return;

    const fetchFaculty = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(`${config.API_BASE_URL}/api/v1/faculty`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          const options = data.faculties.map((faculty) => ({
            value: faculty._id,
            label: `${faculty.firstName} ${faculty.lastName}`,
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
  }, [isOpen]);

  // Pre-fill the form whenever a new item is passed in
  useEffect(() => {
    if (!item) {
      setForm(emptyForm);
      return;
    }

    const asOption = (person) =>
      person && typeof person === "object"
        ? { value: person._id, label: `${person.firstName} ${person.lastName}` }
        : null;

    setForm({
      psrn: item.psrn || "",
      projectTitle: item.projectTitle || "",
      projectPI: asOption(item.projectPI),
      projectCoPI: asOption(item.projectCoPI),
      collaborator: item.collaborator || "",
      fundingAgency: item.fundingAgency || "",
      scheme: item.scheme || "",
      dateSanctioned: item.dateSanctioned ? item.dateSanctioned.split("T")[0] : "",
      projectStartDate: item.projectStartDate ? item.projectStartDate.split("T")[0] : "",
      dateCompletion: item.dateCompletion ? item.dateCompletion.split("T")[0] : "",
      status: item.status || "",
      notableAchievements: Array.isArray(item.notableAchievements)
        ? item.notableAchievements.join(", ")
        : "",
      sanctionLetterLink: item.sanctionLetterLink || "",
      totalINR: item.totalINR ?? "",
      type: item.type || "Sponsored",
      category: item.category || "Govt",
    });
  }, [item]);

  if (!isOpen) return null;

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
      const res = await fetch(`${config.API_BASE_URL}/api/v1/project/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          projectPI: form.projectPI.value,
          projectCoPI: form.projectCoPI?.value || null,
          notableAchievements: form.notableAchievements
            ? form.notableAchievements.split(",").map((a) => a.trim())
            : [],
          totalINR: parseFloat(form.totalINR),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Project updated!");
        onSuccess(data.data || data.project);
        onClose();
      } else {
        toast.error(data.message || "Error updating project");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Project</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              name="psrn"
              placeholder="PSRN"
              value={form.psrn}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="scheme"
              placeholder="Scheme"
              value={form.scheme}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

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
              Principal Investigator (PI) *
            </label>
            <Select
              options={facultyOptions}
              value={form.projectPI}
              onChange={(selected) => setForm({ ...form, projectPI: selected })}
              placeholder="Select PI..."
              isLoading={isLoading}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Co-PI</label>
            <Select
              options={facultyOptions}
              value={form.projectCoPI}
              onChange={(selected) => setForm({ ...form, projectCoPI: selected })}
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
            placeholder="Agency"
            value={form.fundingAgency}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
            required
          />

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Type of Project (Govt/Industry/International)
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="Govt">Govt</option>
                <option value="Industry">Industry</option>
                <option value="International">International</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Type of Project (Consultancy/Sponsored)
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="Sponsored">Sponsored</option>
                <option value="Consultancy">Consultancy</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Sanctioned Date
              </label>
              <input
                type="date"
                name="dateSanctioned"
                value={form.dateSanctioned}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Project Start Date
              </label>
              <input
                type="date"
                name="projectStartDate"
                value={form.projectStartDate}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Project End Date
              </label>
              <input
                type="date"
                name="dateCompletion"
                value={form.dateCompletion}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
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
            placeholder="Amount Sanctioned (Rs)"
            value={form.totalINR}
            onChange={handleChange}
            className="w-full mb-6 p-2 border rounded"
            required
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}