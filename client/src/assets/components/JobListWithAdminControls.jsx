import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const JobListWithAdminControls = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/jobs`);
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [apiUrl]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    const valueA = a[sortConfig.key] ?? "";
    const valueB = b[sortConfig.key] ?? "";

    if (
      sortConfig.key === "post_date" ||
      sortConfig.key === "created_at" ||
      sortConfig.key === "last_date"
    ) {
      return (
        (new Date(valueA) < new Date(valueB) ? -1 : 1) *
        (sortConfig.direction === "asc" ? 1 : -1)
      );
    }

    return (
      (valueA < valueB ? -1 : 1) * (sortConfig.direction === "asc" ? 1 : -1)
    );
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      axios
        .delete(`${apiUrl}/api/jobs/${id}`)
        .then(() => {
          setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting job:", error);
          alert("Error deleting job. Please try again.");
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login";
  };

  const totalPages = Math.ceil(jobs.length / rowsPerPage);
  const displayedJobs = sortedJobs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Job Listings
      </h1>
      <div className="mb-4 flex justify-between items-center">
        <Link
          to="/post-job"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create New Job
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full table-auto bg-white text-gray-700">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th
                className="border px-4 py-2 cursor-pointer text-left hover:bg-gray-200"
                onClick={() => handleSort("created_at")}
              >
                Date
                {sortConfig.key === "created_at" && (
                  <span className="ml-2 text-sm">
                    {sortConfig.direction === "asc" ? "↓" : "↑"}
                  </span>
                )}
              </th>
              <th
                className="border px-4 py-2 cursor-pointer text-left hover:bg-gray-200"
                onClick={() => handleSort("post_date")}
              >
                Post Date
                {sortConfig.key === "post_date" && (
                  <span className="ml-2 text-sm">
                    {sortConfig.direction === "asc" ? "↓" : "↑"}
                  </span>
                )}
              </th>
              <th className="border px-4 py-2">Organisation</th>
              <th className="border px-4 py-2">Job Role</th>
              <th className="border px-4 py-2">Qualification</th>
              <th
                className="border px-4 py-2 cursor-pointer text-left hover:bg-gray-200"
                onClick={() => handleSort("vacancies")}
              >
                Vacancies
                {sortConfig.key === "vacancies" && (
                  <span className="ml-2 text-sm">
                    {sortConfig.direction === "asc" ? "↓" : "↑"}
                  </span>
                )}
              </th>
              <th className="border px-4 py-2">Location</th>
              <th
                className="border px-4 py-2 cursor-pointer text-left hover:bg-gray-200"
                onClick={() => handleSort("last_date")}
              >
                Last Date
                {sortConfig.key === "last_date" && (
                  <span className="ml-2 text-sm">
                    {sortConfig.direction === "asc" ? "↓" : "↑"}
                  </span>
                )}
              </th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedJobs.length > 0 ? (
              displayedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {formatDate(job.created_at)}
                  </td>
                  <td className="border px-4 py-2">
                    {formatDate(job.post_date)}
                  </td>
                  <td className="border px-4 py-2">{job.organisation}</td>
                  <td className="border px-4 py-2">{job.job_details}</td>
                  <td className="border px-4 py-2">{job.qualification}</td>
                  <td className="border px-4 py-2">{job.vacancies}</td>
                  <td className="border px-4 py-2">{job.location}</td>
                  <td className="border px-4 py-2">
                    {formatDate(job.last_date)}
                  </td>
                  <td className="border px-4 py-2">
                    <Link
                      to={`/update-job/${job.id}`}
                      className="bg-yellow-500 text-white py-1 px-4 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="ml-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  No jobs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-around items-center mt-4">
        <div className="flex items-center">
          <label htmlFor="rowsPerPage" className="mr-2">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobListWithAdminControls;
