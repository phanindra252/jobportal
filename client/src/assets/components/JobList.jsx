import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc", // Default sorting order for the "Created Date" column
  });

  useEffect(() => {
    // Fetch job listings
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
    if (!dateString) return ""; // Handle null or undefined date
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",

      hour12: true, // Optional: Set to false for 24-hour format
    };
    return new Date(dateString).toLocaleString(undefined, options); // Using toLocaleString for full date-time format
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    // Handle date fields (created_at, post_date, and last_date)
    if (
      sortConfig.key === "created_at" ||
      sortConfig.key === "post_date" ||
      sortConfig.key === "last_date"
    ) {
      return (
        (valueA < valueB ? -1 : 1) * (sortConfig.direction === "asc" ? 1 : -1)
      );
    }

    // Handle other fields (e.g., vacancies)
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

  // Pagination logic
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

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full table-auto bg-white text-gray-700">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th
                className="border px-4 py-2 cursor-pointer text-left hover:bg-gray-200"
                onClick={() => handleSort("created_at")} // Sort by created date
              >
                Date
                {sortConfig.key === "created_at" ? (
                  <span className="ml-2 text-sm">
                    {sortConfig.direction === "asc" ? "↓" : "↑"}
                  </span>
                ) : null}
              </th>
              <th
                className="border px-4 py-2 cursor-pointer text-left hover:bg-gray-200"
                onClick={() => handleSort("post_date")}
              >
                Post Date
                {sortConfig.key === "post_date" ? (
                  <span className="ml-2 text-sm">
                    {sortConfig.direction === "asc" ? "↓" : "↑"}
                  </span>
                ) : null}
              </th>
              <th className="border px-4 py-2">Organisation</th>
              <th className="border px-4 py-2">Job Role</th>
              <th className="border px-4 py-2">Qualification</th>
              <th
                className="border px-4 py-2 cursor-pointer text-left hover:bg-gray-200"
                onClick={() => handleSort("vacancies")}
              >
                Vacancies
                {sortConfig.key === "vacancies" ? (
                  <span className="ml-2 text-sm">
                    {sortConfig.direction === "asc" ? "↓" : "↑"}
                  </span>
                ) : null}
              </th>
              <th className="border px-4 py-2">Location</th>

              <th
                className="border px-4 py-2 cursor-pointer text-left hover:bg-gray-200"
                onClick={() => handleSort("last_date")}
              >
                Last Date
                {sortConfig.key === "last_date" ? (
                  <span className="ml-2 text-sm">
                    {sortConfig.direction === "asc" ? "↓" : "↑"}
                  </span>
                ) : null}
              </th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedJobs.length > 0 ? (
              displayedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {formatDate(job.created_at)}{" "}
                    {/* Display the formatted date and time */}
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
                      to={`/jobs/${job.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      More Info
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  Loading
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

export default JobList;
