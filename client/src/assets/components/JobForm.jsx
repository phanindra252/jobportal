import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const JobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the job ID from URL params for updating
  const [formData, setFormData] = useState({
    post_date: "",
    organisation: "",
    job_details: "",
    vacancies: "",
    location: "",
    qualification: "",
    last_date: "",
    salary: "",
    picture: null, // Initialize as null to handle file input
    more_details: "",
    notification_link: "",
    apply_link: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [preview, setPreview] = useState(null); // State for picture preview
  const apiUrl = import.meta.env.VITE_API_URL;

  // Function to format the date as yyyy-MM-dd
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Fetch job details if updating
  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`${apiUrl}/api/jobs/${id}`)
        .then((response) => {
          const jobData = response.data;

          // Update form data with fetched job details
          setFormData({
            ...jobData,

            post_date: formatDate(jobData.post_date), // Format the post_date
            last_date: formatDate(jobData.last_date), // Format the last_date
          });

          setPreview(jobData.picture); // Set the preview if the job already has a picture
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching job data:", error);
          setError("Error fetching job data. Please try again.");
          setLoading(false);
        });
    }
  }, [id, apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prevData) => ({ ...prevData, [name]: file }));

    // Show the preview of the selected image
    if (file) {
      const filePreview = URL.createObjectURL(file);
      setPreview(filePreview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formSubmitData = new FormData();

    // Append form data to FormData object
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formSubmitData.append(key, formData[key]);
      }
    });

    try {
      if (id) {
        // Update existing job
        const response = await axios.put(
          `${apiUrl}/api/jobs/${id}`,
          formSubmitData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Ensure the correct content type for file upload
            },
          }
        );
        if (response.status === 200) {
          navigate(`/admin`); // Redirect to the job details page after update
        }
      } else {
        // Create a new job
        const response = await axios.post(
          `${apiUrl}/api/jobs`,
          formSubmitData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Ensure the correct content type for file upload
            },
          }
        );
        if (response.status === 201) {
          navigate("/admin"); // Redirect to the jobs list page after creating
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit the job. Please try again later.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const response = await axios.delete(`${apiUrl}/api/jobs/${id}`);

        if (response.status === 200) {
          alert("Job deleted successfully");
          navigate("/admin");
        } else {
          alert("Failed to delete the job. Please try again later.");
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete the job. Please try again later.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen mt-8 p-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-screen-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          {id ? "Update Job" : "Create New Job"}
        </h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="mb-4">
              <label htmlFor="post_date" className="block text-gray-700">
                Post Date
              </label>
              <input
                type="date"
                id="post_date"
                name="post_date"
                value={formData.post_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="organisation" className="block text-gray-700">
                Organisation (Job Title)
              </label>
              <input
                type="text"
                id="organisation"
                name="organisation"
                value={formData.organisation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="job_details" className="block text-gray-700">
                Job Role
              </label>
              <textarea
                id="job_details"
                name="job_details"
                value={formData.job_details}
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
                value={formData.vacancies}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                value={formData.qualification}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                value={formData.last_date}
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
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="picture" className="block text-gray-700">
                Job Picture
              </label>
              <input
                type="file"
                id="picture"
                name="picture"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            {preview && (
              <div className="mb-4 flex justify-center">
                <img
                  src={preview}
                  alt="Job Preview"
                  className="max-h-96 w-auto object-contain rounded-md border"
                />
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="more_details" className="block text-gray-700">
                More Details
              </label>
              <textarea
                id="more_details"
                name="more_details"
                value={formData.more_details}
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
                value={formData.notification_link}
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
                value={formData.apply_link}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {id ? "Update Job" : "Create Job"}
            </button>
            {id && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Job
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
