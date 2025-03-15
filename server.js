const express = require("express");
const mongoose = require("mongoose");
const seprate = require("./db"); // Ensure this function is correctly defined
const app = express();
require("dotenv").config(); // Load environment variables


// Initialize Database
seprate();

// Middleware
app.use(express.json()); // Built-in JSON parser

// Correctly Import Routes
const personRoutes = require("./routes/personroutes");
const menuItemRoutes = require("./routes/menuItemRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

// Ensure Proper Route Usage
app.use("/person", personRoutes);
app.use("/menu", menuItemRoutes);
app.use("/doctor", doctorRoutes);

// Ensure Database Connection
mongoose.connection.once("open", () => {
  console.log("✅ Database connected successfully!");
});

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
