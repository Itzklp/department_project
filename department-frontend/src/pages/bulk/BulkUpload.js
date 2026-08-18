import BulkUploader from "../../components/BulkUploader";

export default function BulkUpload() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Data Upload</h1>
        <p className="text-gray-600">
          Upload Excel files to add multiple records at once. Ensure your file matches the required column format.
        </p>
      </div>

      {/* Upload Sections */}
      <div className="space-y-6">
        {/* Faculty */}
        <BulkUploader
          title="Faculty Bulk Upload"
          endpoint="/api/v1/faculty/bulk-upload"
          requiredColumns={[
            "PSRN",
            "Name of the Faculty",
            "Current Designation",
            "Email ID",
            "DOJ",
            "Email ID",
            "Mobile No.",
            "Chamber No.",
            "Intercom No.",
            "Research Area",
            "Promoted as ASTP w.e.f.",
            "Promoted as ASOP w.e.f.",
            "Promoted as Professor w.e.f",
            "Promoted as Sr. Professor w.e.f",
            "Name of Ph.D. Scholars Under Supervision",
            "Name of PhD Students Under DAC Membership"
          ]}
        />

        {/* Publications */}
        <BulkUploader
          title="Publication Bulk Upload"
          endpoint="/api/v1/publication/bulk"
          requiredColumns={[
            "Title",
            "Authors",
            "Year",
            "Journal",
            "Volume",
            "Issue",
            "Pages",
            "DOI"
          ]}
        />

        {/* Projects */}
        <BulkUploader
          title="Project Bulk Upload"
          endpoint="/api/v1/project/bulk"
          requiredColumns={[
            "PSRN",
            "Principal Investigator (PI)",
            "Co-PI",
            "Type of Project (Govt/Industry/International)",
            "Type of Project (Consultancy/Sponsored)",
            "Project Title",
            "Agency",
            "Collaborator",
            "Scheme",
            "Sanctioned Date",
            "Amount Sanctioned (Rs)",
            "Project Start Date",
            "Project End Date",
            "Status"
          ]}
        />

        {/* Conferences */}
        <BulkUploader
          title="Conference Bulk Upload"
          endpoint="/api/v1/conference/upload"
          requiredColumns={[
            "type",
            "authors",
            "title",
            "conferenceName",
            "pages",
            "publisher",
            "location",
            "date"
          ]}
        />

        {/* PhD Theses */}
        <BulkUploader
          title="PhD Thesis Bulk Upload"
          endpoint="/api/v1/phdThesis/bulk"
          requiredColumns={[
            "Name",
            "ID No",
            "Desig",
            "Source of Stipend",
            "Mobile No",
            "LAB No.",
            "Intercom No.",
            "DOJ",
            "Institute Fellowship Started W.E.F",
            "Supervisor",
            "Co-Supervisor(s)",
            "Inst Stipend Ended on",
            "Date (1st attempt of QE)",
            "Date (2nd attempt of QE (if any))",
            "Qualifying Passed on",
            "Date of Proposal Presentation",
            "DAC Member1",
            "DAC Member2",
            "Proposed Topic of Research",
            "Proposal Approved on",
            "Date of Pre Sumission Seminar",
            "Date of Viva Voce Exam",
            "Remarks (if any)"
          ]}
        />

        {/* Patents */}
        <BulkUploader
          title="Patent Bulk Upload"
          endpoint="/api/v1/patent/bulk"
          requiredColumns={[
            "Authors",
            "Title",
            "Application Number",
            "Filing Date",
            "Country",
            "Status"
          ]}
        />

        {/* Published Books */}
        <BulkUploader
          title="Published Book Bulk Upload"
          endpoint="/api/v1/publishedBook/bulk"
          requiredColumns={[
            "Title",
            "Author",
            "Type",
            "Publisher",
            "Series",
            "Year",
            "Link"
          ]}
        />

        {/* Department Events */}
        <BulkUploader
          title="Department Event Bulk Upload"
          endpoint="/api/v1/departmentEvent/bulk"
          requiredColumns={[
            "Title",
            "Type",
            "Description",
            "Date",
            "OrganizedBy"
          ]}
        />

        {/* Invited Talks */}
        <BulkUploader
          title="Invited Talk Bulk Upload"
          endpoint="/api/v1/invitedTalk/bulk"
          requiredColumns={[
            "Speaker",
            "Title",
            "Event",
            "Organizer",
            "Location",
            "Date",
            "Mode",
            "Role"
          ]}
        />

        {/* Department Talks - THIS WAS MISSING! */}
        <BulkUploader
          title="Department Talk Bulk Upload"
          endpoint="/api/v1/departmentTalk/bulk"
          requiredColumns={[
            "Speaker",
            "Designation",
            "Affiliation",
            "Title",
            "Date",
            "Type"
          ]}
        />

        {/* Faculty Awards */}
        <BulkUploader
          title="Faculty Award Bulk Upload"
          endpoint="/api/v1/facultyAward/bulk"
          requiredColumns={[
            "Faculty Name",
            "Title",
            "Organization",
            "Journal Info",
            "Year",
            "Category"
          ]}
        />
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">📝 Important Notes:</h3>
        <ul className="list-disc list-inside text-yellow-800 space-y-1">
          <li>Only .xlsx files are accepted</li>
          <li>Column names must match exactly as shown above (case-sensitive)</li>
          <li>For comma-separated fields (like authors), use commas or '&' to separate values</li>
          <li>Date fields should be in a recognizable format (YYYY-MM-DD preferred)</li>
          <li>Empty optional fields will be skipped automatically</li>
        </ul>
      </div>
    </div>
  );
}