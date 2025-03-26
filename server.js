// const express = require("express");
// const mongoose = require("mongoose");
// const seprate = require("./db"); // Ensure this function is correctly defined
// const app = express();
// require("dotenv").config(); // Load environment variables
// const passport = require('passport');
// const LocalStrategy = require("passport-local").Strategy;
// const person = require('./models/person')


// // Initialize Database
// seprate();

// // Custom Middleware
// const Middleware = (req, res, next) => {
//   console.log(`${new Date().toLocaleString()} Request Made to: ${req.originalUrl}`);
//   next(); // Pass control to the next middleware or route handler
// };
// app.use(Middleware);



// // Custom localStorage

// passport.use(new LocalStrategy(async (username,password,done)=>{
//   try {
//     console.log('recieved cradientials',username,password);
//     const user = await Person.findOne({username: username});
//     if(!user)
//       return done(null, false,{message: "incirrect username"});
//     const passwordMatch = user.password == password ? true : false;
//     if(passwordMatch){
//       return done(null, user);
//     }else{
//       return done(null, false,{message: "incirrect username"});

//     }
//   } catch (error) {
//     console.log("error")
//   }
// }))
// app.use(passport.initialize());
// // Apply middleware globally
// // app.use(Middleware);

// // Built-in JSON parser
// app.use(express.json());

// // Route definition
// app.get("/", passport.authenticate("local", {session: false}),(req, res) => {
//   res.send("Hello World!");
// });

// // Import Routes
// const personRoutes = require("./routes/personroutes");
// const menuItemRoutes = require("./routes/menuItemRoutes");
// const doctorRoutes = require("./routes/doctorRoutes");
// const Person = require("./models/person");

// // Use Routes
// app.use("/person", personRoutes);
// app.use("/menu", menuItemRoutes);
// app.use("/doctor",Middleware, doctorRoutes);

// // Ensure Database Connection
// mongoose.connection.once("open", () => {
//   console.log("✅ Database connected successfully!");
// });

// // Server Setup
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// }); 

const express = require("express");
const mongoose = require("mongoose");
const seprate = require("./db");
const app = express();
require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Person = require('./models/person');

// Initialize Database
seprate();

// Middleware for logging
const Middleware = (req, res, next) => {
  console.log(`${new Date().toLocaleString()} Request Made to: ${req.originalUrl}`);
  next();
};
app.use(Middleware);

// Built-in JSON parser
app.use(express.json());

// JWT Secret Key (should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key';

// Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await Person.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Compare passwords (assuming you've hashed passwords)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected Route Example
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Public Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Import Routes
const personRoutes = require("./routes/personroutes");
const menuItemRoutes = require("./routes/menuItemRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

// Use Routes
app.use("/person", personRoutes);
app.use("/menu", menuItemRoutes);
app.use("/doctor", Middleware, doctorRoutes);

// Ensure Database Connection
mongoose.connection.once("open", () => {
  console.log("✅ Database connected successfully!");
});

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});