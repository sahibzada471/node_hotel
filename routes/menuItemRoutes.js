const express = require("express");
const router = express.Router();
const MenuItem = require("../models/menu"); // Ensure correct model import

// Create a new menu item
router.post("/", async (req, res) => {
    try {
        const newMenu = new MenuItem(req.body);
        const response = await newMenu.save();
        console.log("✅ Menu saved successfully:", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("❌ Error saving menu item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch all menu items
router.get("/", async (req, res) => {
    try {
        const datas = await MenuItem.find();
        console.log("✅ Fetched menu successfully:", datas);
        res.status(200).json(datas);
    } catch (error) {
        console.error("❌ Error fetching menu items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch menu items by food type
router.get('/:food', async (req, res) => {
    try {
        const food = req.params.food;

        if (!["burger", "ticka", "pizza"].includes(food)) {
            return res.status(400).json({ error: "Invalid food type" });
        }

        const response = await MenuItem.find({ food }); // Changed from `type` to `food`
        
        if (response.length === 0) {
            return res.status(404).json({ message: "No items found for this food type" });
        }

        console.log("✅ Response fetched successfully:", response);
        return res.status(200).json(response);
    } catch (error) {
        console.error("❌ Error fetching menu items:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;