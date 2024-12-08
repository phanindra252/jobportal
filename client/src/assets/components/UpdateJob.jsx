import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateJob = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    post_date: "",
    organisation: "",
    job_details: "",
    vacancies: "",
    location: "",
    qualification: "",
    last_date: "",
    salary: "",
    picture: "",
    more_details: "",
    notification_link: "",
    apply_link: "",
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch job details for the given ID
  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/jobs/${id}`);
        setFormData(response.data); // Populate form with job data
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Failed to fetch job details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, apiUrl]);

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle null or undefined dates
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Only append picture if it's present
      if (formData.picture) {
        formDataToSend.append("picture", formData.picture);
      }

      // Append non-file fields as regular form fields
      Object.keys(formData).forEach((key) => {
        if (key !== "picture") {
          formDataToSend.append(key, formData[key] || ""); // Ensure values are not null
        }
      });

      const response = await axios.put(
        `${apiUrl}/api/jobs/${id}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        alert("Job updated successfully");
        navigate(`/jobs/${id}`);
      } else {
        alert("Failed to update the job.");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update the job. Please try again later.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${apiUrl}/api/jobs/${id}`);
        alert("Job deleted successfully");
        navigate("/jobs");
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete the job. Please try again later.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading message while fetching data
  }

  return (
    <div className="flex items-center justify-center min-h-screen mt-8 p-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-screen-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Update Job
        </h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleUpdate}>
          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="mb-4">
              <label htmlFor="post_date" className="block text-gray-700">
                Post Date
              </label>
              <input
                type="date"
                id="post_date"
                name="post_date"
                value={formatDate(formData.post_date)} // Correct format
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="organisation" className="block text-gray-700">
                Organisation
              </label>
              <input
                type="text"
                id="organisation"
                name="organisation"
                value={formData.organisation || ""} // Ensure not null
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="job_details" className="block text-gray-700">
                Job Details
              </label>
              <textarea
                id="job_details"
                name="job_details"
                value={formData.job_details || ""} // Ensure not null
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="vacancies" className="block text-gray-700">
                Vacancies
              </label>
              <input
                type="number"
                id="vacancies"
                name="vacancies"
                value={formData.vacancies || ""} // Ensure not null
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="location" className="block text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ""} // Ensure not null
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="qualification" className="block text-gray-700">
                Qualification
              </label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={formData.qualification || ""} // Ensure not null
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="last_date" className="block text-gray-700">
                Last Date
              </label>
              <input
                type="date"
                id="last_date"
                name="last_date"
                value={formatDate(formData.last_date)} // Correct format
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="salary" className="block text-gray-700">
                Salary
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary || ""} // Ensure not null
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="picture" className="block text-gray-700">
                Picture
              </label>
              <input
                type="file"
                id="picture"
                name="picture"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="more_details" className="block text-gray-700">
                More Details
              </label>
              <textarea
                id="more_details"
                name="more_details"
                value={formData.more_details || ""} // Ensure not null
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="notification_link"
                className="block text-gray-700"
              >
                Notification Link
              </label>
              <input
                type="url"
                id="notification_link"
                name="notification_link"
                value={formData.notification_link || ""} // Ensure not null
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="apply_link" className="block text-gray-700">
                Apply Link
              </label>
              <input
                type="url"
                id="apply_link"
                name="apply_link"
                value={formData.apply_link || ""} // Ensure not null
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500"
            >
              Update Job
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500"
            >
              Delete Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateJob;
