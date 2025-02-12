require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware (MUST be before routes!)
app.use(cors());
app.use(express.json()); // ✅ Ensures request body is parsed correctly
app.use(express.urlencoded({ extended: true })); // ✅ Handles form data parsing

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Failed:", err));

// ✅ Define Mongoose Schema and Model
const employeeAssessmentSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  organization: String,
  role: String,
  yearsOfExperience: Number,
  currentCTC: Number,
  expectedCTC: Number,
  linkedIn: String,
  bio: String,
  location: String
}, { collection: 'employeeassessments' });

const EmployeeAssessment = mongoose.model('EmployeeAssessment', employeeAssessmentSchema);

// ✅ Define API Endpoint
app.post('/submit-assessment', async (req, res) => {
  console.log("📩 Received Form Data:", req.body); // ✅ Debugging log

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error("❌ Error: Received empty form data");
      return res.status(400).json({ message: "❌ Received empty form data" });
    }

    const newAssessment = new EmployeeAssessment(req.body);
    console.log("📌 Attempting to save:", newAssessment);

    await newAssessment.save();
    
    console.log("✅ Data saved successfully:", newAssessment);
    res.status(201).json({ message: "✅ Form submitted successfully!", data: newAssessment });
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ message: "❌ Error saving data", error });
  }
});
app.get('/get-submissions', async (req, res) => {
    try {
        const submissions = await EmployeeAssessment.find();
        res.status(200).json(submissions);
    } catch (error) {
        console.error("❌ Error fetching submissions:", error);
        res.status(500).json({ message: "❌ Failed to fetch data." });
    }
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ Add this API to fetch all submissions
app.get('/get-assessments', async (req, res) => {
    try {
      const assessments = await EmployeeAssessment.find(); // ✅ Fetch all documents
      console.log("📤 Sending assessment data:", assessments);
      res.status(200).json(assessments);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      res.status(500).json({ message: "❌ Error fetching data", error });
    }
  });
  