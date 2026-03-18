import { useState, useEffect } from "react";
import Select from "react-select";
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
        const res = await fetch(`${config.API_BASE_URL}/api/v1/faculty`);
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
        alert("Could not load faculty list. Please try again later.");
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
    setForm({ ...form, authors: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.authors.length === 0) {
      alert("Please select at least one author.");
      return;
    }

    const authorIds = form.authors.map(author => author.value);

    try {
      const pubRes = await fetch(`${config.API_BASE_URL}/api/v1/publication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          authors: authorIds,
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
          title: "", 
          authors: [], 
          year: "", 
          journal: "",
          volume: "",
          issue: "",
          pages: "",
          doi: ""
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
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6">Add Publication</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Authors *</label>
        <Select
          isMulti
          name="authors"
          options={facultyOptions}
          className="w-full"
          classNamePrefix="select"
          placeholder="Select Authors..."
          onChange={handleAuthorChange}
          value={form.authors}
          isLoading={isLoading}
          required
        />
      </div>

      <input
        type="number"
        name="year"
        placeholder="Year"
        value={form.year}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="journal"
        placeholder="Journal"
        value={form.journal}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          name="volume"
          placeholder="Volume"
          value={form.volume}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="issue"
          placeholder="Issue"
          value={form.issue}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <input
        type="text"
        name="pages"
        placeholder="Pages (e.g., 1-10)"
        value={form.pages}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        name="doi"
        placeholder="DOI"
        value={form.doi}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}