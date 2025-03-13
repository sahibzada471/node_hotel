const mongoose  = require("mongoose");

const Db = async()=>{
try {
  mongoose.connect("mongodb://127.0.0.1:27017/IUB2",{
    useNewUrlParser: true,
      useUnifiedTopology: true,
  });console.log("My db is connected with my server");
} catch (e) {
  console.log(`Some thing went wrong with the connection of the database, $e`)
}

}

module.exports = Db;

