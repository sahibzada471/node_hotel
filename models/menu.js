const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    food:{
      type: String,
      enum:["burger", "ticka", "pizza"],
      required: true
  },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt fields
);

// Export the model
const MenuItem = mongoose.model("MenuItem", MenuItemSchema);
module.exports = MenuItem;
