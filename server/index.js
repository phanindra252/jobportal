const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const AWS = require("aws-sdk");
require("dotenv").config();

const app = express();
app.use(express.json());

// Configure CORS
const corsOptions = {
  origin: "https://jobportal-1-vkqv.onrender.com", // Frontend's URL
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// AWS S3 configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME;

// Configure file upload using Multer-S3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 40 * 1024 * 1024 }, // 40MB limit
});

// Helper function to upload to S3
const uploadToS3 = async (file, folder) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: `${folder}/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    const data = await s3.upload(params).promise();
    return data.Location; // Returns the public URL of the uploaded file
  } catch (error) {
    console.error("Error uploading to S3:", error.message);
    throw error; // Re-throw the error to be handled by the route
  }
};

// **GET /api/jobs** - Fetch all job listings
app.get("/api/jobs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM job_listings");
    const jobs = result.rows.map((job) => ({
      ...job,
      created_at: job.created_at ? job.created_at.toISOString() : null,
    }));
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
});

// **GET /api/jobs/:id** - Fetch job details by ID
app.get("/api/jobs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM job_listings WHERE id = $1",
      [id]
    );
    if (result.rows.length > 0) {
      const job = result.rows[0];
      res.json(job);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error("Error fetching job details:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching job details", error: error.message });
  }
});

// **POST /api/jobs** - Add a new job posting
app.post("/api/jobs", upload.single("picture"), async (req, res) => {
  const {
    post_date,
    organisation,
    job_details,
    qualification,
    last_date,
    vacancies,
    location,
    salary,
    more_details,
    notification_link,
    apply_link,
  } = req.body;

  let pictureUrl = null;

  try {
    if (req.file) {
      pictureUrl = await uploadToS3(req.file, "job_pictures");
    }

    const query = `
      INSERT INTO job_listings 
      (post_date, organisation, job_details, qualification, last_date, 
       vacancies, location, salary, picture, more_details, notification_link, apply_link, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      RETURNING id, created_at
    `;
    const values = [
      post_date || null,
      organisation || null,
      job_details || null,
      qualification || null,
      last_date || null,
      vacancies || null,
      location || null,
      salary || null,
      pictureUrl,
      more_details || null,
      notification_link || null,
      apply_link || null,
    ];

    const result = await pool.query(query, values);
    const job = result.rows[0];
    job.created_at = job.created_at.toISOString();
    res.status(201).json({ id: job.id, created_at: job.created_at });
  } catch (error) {
    console.error("Error inserting job data:", error.message);
    res
      .status(500)
      .json({ error: "Error inserting job data", detail: error.message });
  }
});

// **PUT /api/jobs/:id** - Update a job posting by ID
app.put("/api/jobs/:id", upload.single("picture"), async (req, res) => {
  const { id } = req.params;
  const {
    post_date,
    organisation,
    job_details,
    qualification,
    last_date,
    vacancies,
    location,
    salary,
    more_details,
    notification_link,
    apply_link,
  } = req.body;

  let pictureUrl = null;

  try {
    const jobResult = await pool.query(
      "SELECT * FROM job_listings WHERE id = $1",
      [id]
    );
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (req.file) {
      pictureUrl = await uploadToS3(req.file, "job_pictures");
    }

    const query = `
      UPDATE job_listings
      SET 
        post_date = $1,
        organisation = $2,
        job_details = $3,
        qualification = $4,
        last_date = $5,
        vacancies = $6,
        location = $7,
        salary = $8,
        picture = COALESCE($9, picture),
        more_details = $10,
        notification_link = $11,
        apply_link = $12
      WHERE id = $13
      RETURNING *;
    `;
    const values = [
      post_date || null,
      organisation || null,
      job_details || null,
      qualification || null,
      last_date || null,
      vacancies || null,
      location || null,
      salary || null,
      pictureUrl,
      more_details || null,
      notification_link || null,
      apply_link || null,
      id,
    ];

    const result = await pool.query(query, values);
    const updatedJob = result.rows[0];
    updatedJob.created_at = updatedJob.created_at
      ? updatedJob.created_at.toISOString()
      : null;
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error.message);
    res
      .status(500)
      .json({ message: "Error updating job", error: error.message });
  }
});

// **DELETE /api/jobs/:id** - Delete a job posting by ID
app.delete("/api/jobs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM job_listings WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount > 0) {
      res.status(200).json({ message: "Job deleted successfully" });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error("Error deleting job:", error.message);
    res.status(500).json({ message: "Failed to delete the job" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
