const mongoose = require("mongoose");
require('dotenv').config(); // Load environment variables from .env file

const Db = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("My db is connected with my server");
  } catch (e) {
    console.log(`Something went wrong with the connection of the database: ${e.message}`);
  }
};

module.exports = Db;