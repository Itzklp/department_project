import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import config from "../../config";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../common/ConfirmationModal";

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

const asOption = (name) => (name ? { value: name, label: name } : null);

export default function PhdThesisEditModal({
  isOpen,
  onClose,
  item,
  onSuccess,
}) {
  const [form, setForm] = useState({});
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [isLoadingFaculty, setIsLoadingFaculty] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch faculty list for the Supervisor / Co-Supervisor / DAC dropdowns
  useEffect(() => {
    if (isOpen) {
      setIsLoadingFaculty(true);
      fetch(`${config.API_BASE_URL}/api/v1/faculty`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setFacultyOptions(
              data.faculties.map((f) => ({
                value: f._id,
                label: `${f.firstName} ${f.lastName}`,
              }))
            );
          }
        })
        .catch(() => console.error("Failed to fetch faculty list"))
        .finally(() => setIsLoadingFaculty(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (item) {
      const formatDate = (dateStr) => (dateStr ? dateStr.split("T")[0] : "");
      const knownDesignations = DESIGNATION_OPTIONS.slice(0, -1);
      const rawDesignation = item.designation || "";
      const isKnown = knownDesignations.includes(rawDesignation);

      setForm({
        scholarName: item.scholarName || "",
        studentId: item.studentId || "",
        designation: rawDesignation ? (isKnown ? rawDesignation : "Other") : "",
        designationOther: rawDesignation && !isKnown ? rawDesignation : "",

        sourceOfStipend: Array.isArray(item.sourceOfStipend) ? item.sourceOfStipend : [],
        sponsoredProjectName: item.sponsoredProjectName || "",
        mobileNo: item.mobileNo || "",
        labNo: item.labNo || "",
        intercomNo: item.intercomNo || "",

        thesisTitle: item.thesisTitle || "",
        supervisor: asOption(item.supervisor),
        coSupervisor: Array.isArray(item.coSupervisor)
          ? item.coSupervisor.map(asOption)
          : item.coSupervisor
          ? [asOption(item.coSupervisor)]
          : [],
        dacMember1: asOption(item.dacMember1),
        dacMember2: asOption(item.dacMember2),

        year: item.year || new Date().getFullYear(),
        status: item.status || "Ongoing",
        fellowshipProgram: item.fellowshipProgram || "Institute Fellow",

        dateOfJoining: formatDate(item.dateOfJoining),
        instituteFellowshipStartDate: formatDate(item.instituteFellowshipStartDate),
        instituteStipendEndDate: formatDate(item.instituteStipendEndDate),
        qeAttempt1Date: formatDate(item.qeAttempt1Date),
        qeAttempt2Date: formatDate(item.qeAttempt2Date),
        dateOfProposal: formatDate(item.dateOfProposal),
        proposalApprovedDate: formatDate(item.proposalApprovedDate),
        dateOfPhdQualified: formatDate(item.dateOfPhdQualified),
        dateOfPreSubmission: formatDate(item.dateOfPreSubmission),
        dateOfThesisSubmission: formatDate(item.dateOfThesisSubmission),
        dateOfVivaVoce: formatDate(item.dateOfVivaVoce),

        remarks: item.remarks || "",
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleStipendToggle = (option) => {
    setForm((prev) => {
      const already = (prev.sourceOfStipend || []).includes(option);
      const next = already
        ? prev.sourceOfStipend.filter((o) => o !== option)
        : [...(prev.sourceOfStipend || []), option];
      return { ...prev, sourceOfStipend: next };
    });
  };

  const handleUpdateInitiate = (e) => {
    e.preventDefault();
    setIsConfirming(true);
  };

  const handleConfirmedUpdate = async () => {
    setIsSubmitting(true);
    const payload = {
      ...form,
      year: parseInt(form.year),
      designation:
        form.designation === "Other" ? (form.designationOther || "").trim() : form.designation,
      supervisor: form.supervisor?.label || "",
      coSupervisor: (form.coSupervisor || []).map((o) => o.label),
      dacMember1: form.dacMember1?.label || "",
      dacMember2: form.dacMember2?.label || "",
    };
    delete payload.designationOther;

    Object.keys(payload).forEach((key) => {
      if (key.toLowerCase().includes("date") && payload[key] === "") payload[key] = null;
    });

    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/v1/phdThesis/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Thesis updated!");
        onSuccess(data);
        setIsConfirming(false);
        onClose();
      } else {
        toast.error(data.message || "Failed to update.");
        setIsConfirming(false);
      }
    } catch (err) {
      toast.error("Network error.");
      setIsConfirming(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 my-8">
          <h2 className="text-2xl font-bold mb-6">Edit PhD Thesis</h2>
          <form onSubmit={handleUpdateInitiate} className="space-y-4">
            {/* BASIC INFO */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="scholarName"
                  value={form.scholarName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">ID No</label>
                <input
                  type="text"
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Desig</label>
                <select
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
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
                    className="w-full p-2 border rounded-lg mt-2"
                  />
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Awarded">Awarded</option>
                </select>
              </div>
            </div>

            {/* STIPEND & CONTACT */}
            <h4 className="font-bold pt-3 mt-3 border-t text-sm text-gray-500">
              Source of Stipend &amp; Contact
            </h4>
            <div>
              <label className="text-sm font-medium block mb-1">Source of Stipend</label>
              <div className="flex flex-wrap gap-4">
                {STIPEND_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={(form.sourceOfStipend || []).includes(opt)}
                      onChange={() => handleStipendToggle(opt)}
                      className="w-4 h-4"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {(form.sourceOfStipend || []).includes("Sponsored Project") && (
                <input
                  type="text"
                  name="sponsoredProjectName"
                  value={form.sponsoredProjectName}
                  onChange={handleChange}
                  placeholder="Name of Project"
                  className="w-full p-2 border rounded-lg mt-2"
                />
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs">Mobile No</label>
                <input
                  type="text"
                  name="mobileNo"
                  value={form.mobileNo}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">LAB No.</label>
                <input
                  type="text"
                  name="labNo"
                  value={form.labNo}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Intercom No.</label>
                <input
                  type="text"
                  name="intercomNo"
                  value={form.intercomNo}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
            </div>

            {/* RESEARCH INFO */}
            <h4 className="font-bold pt-3 mt-3 border-t text-sm text-gray-500">
              Research Info
            </h4>
            <div>
              <label className="text-sm font-medium">Proposed Topic of Research</label>
              <input
                type="text"
                name="thesisTitle"
                value={form.thesisTitle}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Supervisor</label>
                <CreatableSelect
                  options={facultyOptions}
                  classNamePrefix="select"
                  placeholder="Select or type supervisor..."
                  onChange={(opt) => setForm({ ...form, supervisor: opt })}
                  value={form.supervisor}
                  isLoading={isLoadingFaculty}
                  isClearable
                />
                <p className="text-[10px] text-blue-600 mt-0.5 font-medium italic">
                  * Write name exactly as given in profile.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Co-Supervisor(s)</label>
                <CreatableSelect
                  isMulti
                  options={facultyOptions}
                  classNamePrefix="select"
                  placeholder="Select or type co-supervisor(s)..."
                  onChange={(opts) => setForm({ ...form, coSupervisor: opts || [] })}
                  value={form.coSupervisor}
                  isLoading={isLoadingFaculty}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">DAC Member1</label>
                <CreatableSelect
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
                <label className="text-sm font-medium">DAC Member2</label>
                <CreatableSelect
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Year</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Fellowship Program
                </label>
                <select
                  name="fellowshipProgram"
                  value={form.fellowshipProgram}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Institute Fellow">Institute Fellow</option>
                  <option value="Industry Sponsored Fellowship">
                    Industry Sponsored Fellowship
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Dates Grid */}
            <h4 className="font-bold pt-3 mt-3 border-t text-sm text-gray-500">
              Milestone Dates (Optional)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs">DOJ</label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={form.dateOfJoining}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Inst. Fellowship W.E.F</label>
                <input
                  type="date"
                  name="instituteFellowshipStartDate"
                  value={form.instituteFellowshipStartDate}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Inst. Stipend Ended</label>
                <input
                  type="date"
                  name="instituteStipendEndDate"
                  value={form.instituteStipendEndDate}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">QE Attempt 1</label>
                <input
                  type="date"
                  name="qeAttempt1Date"
                  value={form.qeAttempt1Date}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">QE Attempt 2 (if any)</label>
                <input
                  type="date"
                  name="qeAttempt2Date"
                  value={form.qeAttempt2Date}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Proposal Presentation</label>
                <input
                  type="date"
                  name="dateOfProposal"
                  value={form.dateOfProposal}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Proposal Approved</label>
                <input
                  type="date"
                  name="proposalApprovedDate"
                  value={form.proposalApprovedDate}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Qualified</label>
                <input
                  type="date"
                  name="dateOfPhdQualified"
                  value={form.dateOfPhdQualified}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Pre-Submission Seminar</label>
                <input
                  type="date"
                  name="dateOfPreSubmission"
                  value={form.dateOfPreSubmission}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Thesis Submission</label>
                <input
                  type="date"
                  name="dateOfThesisSubmission"
                  value={form.dateOfThesisSubmission}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Viva Voce Exam</label>
                <input
                  type="date"
                  name="dateOfVivaVoce"
                  value={form.dateOfVivaVoce}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded text-sm"
                />
              </div>
            </div>

            {/* REMARKS */}
            <div>
              <label className="text-sm font-medium">Remarks (if any)</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                rows={2}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-white bg-blue-600 rounded-lg"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirming}
        title="Confirm Update"
        message="Update this record?"
        confirmText="Yes"
        confirmColor="bg-blue-600"
        onConfirm={handleConfirmedUpdate}
        onCancel={() => setIsConfirming(false)}
        isLoading={isSubmitting}
      />
    </>
  );
}
