const express = require("express");
const router = express.Router();
const Person = require("../models/person");
const { jwtAuthMiddleware, generateToken } = require("../routes/jwt");

// Create a new person
router.post("/signup", async (req, res) => {
  try {
      const data = req.body;
      const newPerson = new Person(data);
      const savedata = await newPerson.save();
      
      console.log("✅ Person saved successfully:", savedata);
      const payload = {
          username: savedata.username,
          email: savedata.email,
          work: savedata.work
      };  // ✅ Added payload

      const token = generateToken(payload);
      return res.status(200).json({  // ✅ Single response
          person: savedata,
          token: token
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" }); // ✅ Added return
  }
});


// Login Route
router.post("/login", async (req, res) => { 
  
  try {
    const { username, password } = req.body;
    
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
    
  }

// Fetch all people
router.get("/", async (req, res) => {
    try {
      const data = await Person.find();
      console.log("✅ Fetched people successfully:", data);

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch people based on work type
router.get('/:worktype', async (req, res) => { // ✅ Fixed route syntax
    try {
      const worktype = req.params.worktype;

      if (["cheif", "owner", "waiter"].includes(worktype)) { // ✅ Simplified condition
        const response = await Person.find({ work: worktype });
        console.log("✅ Response fetched successfully:", response);
        return res.status(200).json(response);
      } else {
        return res.status(400).json({ error: "Invalid work type" });
      }

    } catch (error) {
      console.error("❌ Error fetching person data:", error);
      return res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
