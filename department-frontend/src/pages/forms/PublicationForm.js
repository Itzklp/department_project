import { useState, useEffect } from "react";
// 1. Import CreatableSelect instead of standard Select
import CreatableSelect from "react-select/creatable"; 
import config from "../../config";

export default function PublicationForm() {
  const [form, setForm] = useState({
    title: "",
    authors: [],
    year: "",
    journal: "",
    volume: "",
    issue: "",
    pages: "",
    doi: ""
  });

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        const res = await fetch(`${config.API_BASE_URL}/api/v1/faculty`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (data.success) {
          const options = data.faculties.map((faculty) => ({
            value: faculty._id, // Internal ID
            label: `${faculty.firstName} ${faculty.lastName}`,
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleAuthorChange = (selectedOptions) => {
    setForm({ ...form, authors: selectedOptions || [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.authors.length === 0) {
      alert("Please select or type at least one author.");
      return;
    }

    // This perfectly extracts the ObjectId for faculty OR the String name for external authors
    const authorValues = form.authors.map(author => author.value);
    const token = localStorage.getItem("token");

    try {
      const pubRes = await fetch(`${config.API_BASE_URL}/api/v1/publication`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title,
          authors: authorValues, // Sends a mix of IDs and strings to backend
          year: parseInt(form.year),
          journal: form.journal,
          volume: form.volume,
          issue: form.issue,
          pages: form.pages,
          doi: form.doi
        }),
      });

      if (pubRes.ok) {
        alert("Publication added successfully!");
        setForm({ 
          title: "", authors: [], year: "", journal: "",
          volume: "", issue: "", pages: "", doi: ""
        });
      } else {
        const errorData = await pubRes.json();
        alert(`Error: ${errorData.message || errorData.error || 'Failed to add publication'}`);
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-2">Add Publication</h2>
      <p className="text-sm text-gray-500 mb-6">
        Select department faculty from the list, or <strong>type a custom name and press Enter</strong> for external authors.
      </p>

      <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Authors *</label>
        {/* 2. Replace standard Select with CreatableSelect */}
        <CreatableSelect
          isMulti
          name="authors"
          options={facultyOptions}
          className="w-full"
          classNamePrefix="select"
          placeholder="Select or type authors..."
          onChange={handleAuthorChange}
          value={form.authors}
          isLoading={isLoading}
          required
        />
      </div>

      <input type="number" name="year" placeholder="Year" value={form.year} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />
      <input type="text" name="journal" placeholder="Journal" value={form.journal} onChange={handleChange} className="w-full mb-3 p-2 border rounded" required />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <input type="text" name="volume" placeholder="Volume" value={form.volume} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="issue" placeholder="Issue" value={form.issue} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <input type="text" name="pages" placeholder="Pages (e.g., 1-10)" value={form.pages} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
      <input type="text" name="doi" placeholder="DOI" value={form.doi} onChange={handleChange} className="w-full mb-4 p-2 border rounded" />

      <button type="submit" className="w-full bg-blue-600 text-white font-medium px-4 py-2.5 rounded hover:bg-blue-700 transition-colors">
        Submit Publication
      </button>
    </form>
  );
}