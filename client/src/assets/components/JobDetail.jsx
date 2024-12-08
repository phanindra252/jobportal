import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJob();
  }, [id, apiUrl]);

  if (!job) return <div className="text-center p-8 text-xl">Loading...</div>;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      {/* Job Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">{job.organisation}</h1>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
        {job.post_date && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Post Date
            </h2>
            <p className="text-gray-600">{formatDate(job.post_date)}</p>
          </div>
        )}

        {job.last_date && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Last Date
            </h2>
            <p className="text-gray-600">{formatDate(job.last_date)}</p>
          </div>
        )}

        {job.vacancies && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Vacancies
            </h2>
            <p className="text-gray-600">{job.vacancies}</p>
          </div>
        )}

        {job.location && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Location
            </h2>
            <p className="text-gray-600">{job.location}</p>
          </div>
        )}

        {job.qualification && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Qualification
            </h2>
            <p className="text-gray-600">{job.qualification}</p>
          </div>
        )}

        {job.job_details && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Job Role
            </h2>
            <p className="text-gray-600">{job.job_details}</p>
          </div>
        )}

        {job.salary && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Salary</h2>
            <p className="text-gray-600">{job.salary}</p>
          </div>
        )}
      </div>

      {/* More Information and Image */}
      {job.picture && (
        <div className="mt-8 text-center">
          <img
            src={job.picture}
            alt="Job"
            className="w-64 h-64 object-contain rounded-md shadow-md mx-auto"
          />
        </div>
      )}

      {job.more_details && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            More Details
          </h2>
          <p className="text-gray-600">{job.more_details}</p>
        </div>
      )}

      {/* Links */}
      <div className="mt-8 space-y-4 text-center">
        {job.notification_link && (
          <p>
            <a
              href={job.notification_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Notification Link
            </a>
          </p>
        )}
        {job.apply_link && (
          <p>
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Apply Here
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
