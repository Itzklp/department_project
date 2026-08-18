import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import config from "../../config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DESIGNATION_OPTIONS = [
  "JRF + Ph.D. Scholar",
  "SRF + Ph.D. Scholar",
  "Ph.D. Scholar (Institute Fellowship)",
  "Project Associate + Ph.D. Scholar",
  "Project Assistant + Ph.D. Scholar",
  "Self-Finance Ph.D. Scholar",
  "Other",
];

const STIPEND_OPTIONS = [
  "Institute Fellowship",
  "Sponsored Project",
  "Self-Finance",
  "Other",
];

export default function PhdThesisForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [isLoadingFaculty, setIsLoadingFaculty] = useState(true);

  const [form, setForm] = useState({
    // Basic info
    scholarName: "",
    studentId: "",
    designation: "",
    designationOther: "",

    // Stipend & contact
    sourceOfStipend: [],
    sponsoredProjectName: "",
    mobileNo: "",
    labNo: "",
    intercomNo: "",

    // Research info
    thesisTitle: "",
    supervisor: null,
    coSupervisor: [],
    dacMember1: null,
    dacMember2: null,

    year: new Date().getFullYear(),
    status: "Ongoing",
    fellowshipProgram: "Institute Fellow",

    // Milestone dates
    dateOfJoining: "",
    instituteFellowshipStartDate: "",
    instituteStipendEndDate: "",
    qeAttempt1Date: "",
    qeAttempt2Date: "",
    dateOfPhdQualified: "",
    dateOfProposal: "",
    proposalApprovedDate: "",
    dateOfPreSubmission: "",
    dateOfThesisSubmission: "",
    dateOfVivaVoce: "",

    remarks: "",
  });

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setIsLoadingFaculty(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${config.API_BASE_URL}/api/v1/faculty`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setFacultyOptions(
            data.faculties.map((f) => ({
              value: f._id,
              label: `${f.firstName} ${f.lastName}`,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch faculty:", err);
      } finally {
        setIsLoadingFaculty(false);
      }
    };
    fetchFaculty();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleStipendToggle = (option) => {
    setForm((prev) => {
      const already = prev.sourceOfStipend.includes(option);
      const next = already
        ? prev.sourceOfStipend.filter((o) => o !== option)
        : [...prev.sourceOfStipend, option];
      return { ...prev, sourceOfStipend: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    const payload = {
      ...form,
      year: parseInt(form.year),
      designation:
        form.designation === "Other" ? form.designationOther.trim() : form.designation,
      supervisor: form.supervisor?.label || "",
      coSupervisor: (form.coSupervisor || []).map((o) => o.label),
      dacMember1: form.dacMember1?.label || "",
      dacMember2: form.dacMember2?.label || "",
    };
    delete payload.designationOther;

    // Drop empty optional date fields so the backend doesn't try to cast ""
    Object.keys(payload).forEach((key) => {
      if (key.toLowerCase().includes("date") && payload[key] === "") {
        delete payload[key];
      }
    });

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/phdThesis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("PhD Thesis added successfully!");
        navigate("/quick-actions");
      } else {
        toast.error(data.message || "Error adding PhD thesis");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-6">
      <button
        onClick={() => navigate("/quick-actions")}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Quick Actions
      </button>

      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md mt-6">
        <h2 className="text-2xl font-bold mb-6">Add PhD Thesis</h2>

        {/* BASIC INFO */}
        <h3 className="text-lg font-bold mb-4 text-gray-700">Basic Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="scholarName"
              value={form.scholarName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ID No</label>
            <input
              type="text"
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              placeholder="e.g. 2024PHXP0497P"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Desig</label>
            <select
              name="designation"
              value={form.designation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select designation...</option>
              {DESIGNATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {form.designation === "Other" && (
              <input
                type="text"
                name="designationOther"
                value={form.designationOther}
                onChange={handleChange}
                placeholder="Specify designation"
                className="w-full p-2 border rounded mt-2"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Awarded">Awarded</option>
            </select>
          </div>
        </div>

        {/* STIPEND & CONTACT */}
        <h3 className="text-lg font-bold mb-4 pt-4 border-t text-gray-700">
          Source of Stipend &amp; Contact
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Source of Stipend</label>
          <div className="flex flex-wrap gap-4">
            {STIPEND_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.sourceOfStipend.includes(opt)}
                  onChange={() => handleStipendToggle(opt)}
                  className="w-4 h-4"
                />
                {opt}
              </label>
            ))}
          </div>
          {form.sourceOfStipend.includes("Sponsored Project") && (
            <input
              type="text"
              name="sponsoredProjectName"
              value={form.sponsoredProjectName}
              onChange={handleChange}
              placeholder="Name of Project"
              className="w-full p-2 border rounded mt-2"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Mobile No</label>
            <input
              type="text"
              name="mobileNo"
              value={form.mobileNo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LAB No.</label>
            <input
              type="text"
              name="labNo"
              value={form.labNo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Intercom No.</label>
            <input
              type="text"
              name="intercomNo"
              value={form.intercomNo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* RESEARCH INFO */}
        <h3 className="text-lg font-bold mb-4 pt-4 border-t text-gray-700">Research Info</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Proposed Topic of Research</label>
          <input
            type="text"
            name="thesisTitle"
            value={form.thesisTitle}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Supervisor</label>
            <CreatableSelect
              name="supervisor"
              options={facultyOptions}
              classNamePrefix="select"
              placeholder="Select or type supervisor..."
              onChange={(opt) => setForm({ ...form, supervisor: opt })}
              value={form.supervisor}
              isLoading={isLoadingFaculty}
              isClearable
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Co-Supervisor(s)</label>
            <CreatableSelect
              isMulti
              name="coSupervisor"
              options={facultyOptions}
              classNamePrefix="select"
              placeholder="Select or type co-supervisor(s)..."
              onChange={(opts) => setForm({ ...form, coSupervisor: opts || [] })}
              value={form.coSupervisor}
              isLoading={isLoadingFaculty}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">DAC Member1</label>
            <CreatableSelect
              name="dacMember1"
              options={facultyOptions}
              classNamePrefix="select"
              placeholder="Select or type DAC member 1..."
              onChange={(opt) => setForm({ ...form, dacMember1: opt })}
              value={form.dacMember1}
              isLoading={isLoadingFaculty}
              isClearable
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">DAC Member2</label>
            <CreatableSelect
              name="dacMember2"
              options={facultyOptions}
              classNamePrefix="select"
              placeholder="Select or type DAC member 2..."
              onChange={(opt) => setForm({ ...form, dacMember2: opt })}
              value={form.dacMember2}
              isLoading={isLoadingFaculty}
              isClearable
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fellowship Program</label>
            <select
              name="fellowshipProgram"
              value={form.fellowshipProgram}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Institute Fellow">Institute Fellow</option>
              <option value="Industry Sponsored Fellowship">
                Industry Sponsored Fellowship
              </option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* DATES */}
        <h3 className="text-lg font-bold mb-4 pt-4 border-t text-gray-700">
          Milestone Dates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            ["dateOfJoining", "DOJ"],
            ["instituteFellowshipStartDate", "Institute Fellowship Started W.E.F"],
            ["instituteStipendEndDate", "Inst Stipend Ended on"],
            ["qeAttempt1Date", "Date (1st attempt of QE)"],
            ["qeAttempt2Date", "Date (2nd attempt of QE, if any)"],
            ["dateOfProposal", "Date of Proposal Presentation"],
            ["proposalApprovedDate", "Proposal Approved on"],
            ["dateOfPhdQualified", "Qualifying Passed on"],
            ["dateOfPreSubmission", "Date of Pre Submission Seminar"],
            ["dateOfThesisSubmission", "Thesis Submission"],
            ["dateOfVivaVoce", "Date of Viva Voce Exam"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-500 uppercase">
                {label}
              </label>
              <input
                type="date"
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          ))}
        </div>

        {/* REMARKS */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Remarks (if any)</label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Thesis"}
        </button>
      </form>
    </div>
  );
}
