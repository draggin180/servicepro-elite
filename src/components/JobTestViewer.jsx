import { useEffect, useState } from "react";
import { fetchJobs } from "../services/apiService";

function JobTestViewer() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!jobs.length) return <p>Loading jobs...</p>;

  return (
    <div>
      <h2>Job List</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <strong>{job.job_number}</strong>: {job.title} — {job.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobTestViewer;
