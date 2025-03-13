const express = require("express");
const Doctor = require("../models/Doctor"); // Ensure the Doctor model is imported

const router = express.Router();

// Create a new doctor (POST /api/doctors)
router.post("/", async (req, res) => {
    try {
        // Validate request body
        if (!req.body.name || !req.body.specialization) {
            return res.status(400).json({ error: "Name and specialization are required" });
        }

        const newDoctor = new Doctor(req.body);
        const savedDoctor = await newDoctor.save();
        res.status(201).json({ message: "Doctor added successfully", doctor: savedDoctor });
    } catch (error) {
        // Handle validation errors separately
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all doctors (GET /api/doctors)
router.get("/", async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update a doctor by ID (PUT /api/doctors/:id)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract the doctor's ID from the URL
        const updates = req.body; // Extract the updates from the request body

        // Validate the request body
        if (!updates.name && !updates.specialization) {
            return res.status(400).json({ error: "At least one field (name or specialization) is required to update" });
        }

        // Find the doctor by ID and update their details
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, updates, { new: true });

        // If the doctor is not found, return a 404 error
        if (!updatedDoctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        // Return the updated doctor
        res.status(200).json({ message: "Doctor updated successfully", doctor: updatedDoctor });
    } catch (error) {
        // Handle validation errors separately
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});

// Export the router
module.exports = router;