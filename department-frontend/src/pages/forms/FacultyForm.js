import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const DESIGNATION_OPTIONS = [
  "Assistant Professor",
  "Associate Professor",
  "Professor",
  "Sr. Professor",
  "Head of Department",
  "Other",
];

export default function FacultyForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    psrn: "",
    firstName: "",
    lastName: "",
    email: "",
    instituteEmail: "",
    department: "Computer Science",
    designation: "Assistant Professor",
    designationOther: "",
    joiningDate: new Date().toISOString().split("T")[0],
    researchArea: "",
    teaches: "",
    mobileNo: "",
    chamberNo: "",
    intercomNo: "",
    promotedASTPDate: "",
    promotedASOPDate: "",
    promotedProfessorDate: "",
    promotedSrProfessorDate: "",
    phdScholarsSupervised: "",
    phdDacMembership: "",
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
      designation:
        form.designation === "Other" ? form.designationOther.trim() : form.designation,
      researchArea: form.researchArea
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      teaches: form.teaches
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      phdScholarsSupervised: form.phdScholarsSupervised
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      phdDacMembership: form.phdDacMembership
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    delete payload.designationOther;

    // Drop empty optional date fields
    Object.keys(payload).forEach((key) => {
      if (key.toLowerCase().includes("date") && payload[key] === "") {
        delete payload[key];
      }
    });

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

      {/* Back Button */}
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

        {/* PSRN + Names */}
        <div className="grid grid-cols-3 gap-4 mb-3">
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

        {/* Email + Institute Email */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email (login)"
            value={form.email}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="instituteEmail"
            placeholder="Institute Email (if different)"
            value={form.instituteEmail}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Department */}
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        {/* Designation + Date */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <select
              name="designation"
              value={form.designation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
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
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              DOJ
            </label>
            <input
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Contact */}
        <h3 className="text-sm font-bold text-gray-700 pt-3 mt-3 border-t mb-2">Contact</h3>
        <div className="grid grid-cols-3 gap-4 mb-3">
          <input
            type="text"
            name="mobileNo"
            placeholder="Mobile No."
            value={form.mobileNo}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="chamberNo"
            placeholder="Chamber No."
            value={form.chamberNo}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="intercomNo"
            placeholder="Intercom No."
            value={form.intercomNo}
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
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Promotion History */}
        <h3 className="text-sm font-bold text-gray-700 pt-3 mt-3 border-t mb-2">
          Promotion History (Optional)
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Promoted as ASTP W.e.f.
            </label>
            <input
              type="date"
              name="promotedASTPDate"
              value={form.promotedASTPDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Promoted as ASOP W.e.f.
            </label>
            <input
              type="date"
              name="promotedASOPDate"
              value={form.promotedASOPDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Promoted as Professor W.e.f.
            </label>
            <input
              type="date"
              name="promotedProfessorDate"
              value={form.promotedProfessorDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Promoted as Sr. Professor W.e.f.
            </label>
            <input
              type="date"
              name="promotedSrProfessorDate"
              value={form.promotedSrProfessorDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* PhD involvement */}
        <h3 className="text-sm font-bold text-gray-700 pt-3 mt-3 border-t mb-2">
          PhD Involvement (Optional)
        </h3>
        <p className="text-xs text-gray-400 mb-2">
          These are informational and can also be tracked automatically via PhD Thesis records.
        </p>
        <input
          type="text"
          name="phdScholarsSupervised"
          placeholder="PhD Scholars Under Supervision (comma separated)"
          value={form.phdScholarsSupervised}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="text"
          name="phdDacMembership"
          placeholder="PhD Students Under DAC Membership (comma separated)"
          value={form.phdDacMembership}
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
