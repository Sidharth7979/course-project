const mongoose = require("mongoose");
const session = require("express-session");
const User = require("./models/user");
const courses = require("./models/model");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const express = require("express");
const multer = require("multer");
const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/mydatabase")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
app.use(express.static("upload"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "my secret key",
    resave: false,
    saveUninitialized: true,
  })
);

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("image");

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error");
});


// Route to render the list of courses
app.get("/", async (req, res) => {
    try {
      const course = await courses.find();
      res.render("header", { title: "Add course", sidharths: course });
    } catch (error) {
      console.error(error);
      res.redirect("/");
    }
  });
  
// Route to render add course page
app.get("/add_course", (req, res) => {
  res.render("add_course", { title: "Add Course" });
});

// Route to handle course addition(upload images)
app.post("/add_course", upload, async (req, res) => {
  try {
    const newCourse = await courses.create({
      Title: req.body.Title,
      Image: req.file.filename,
      Price: req.body.Price,
      Description: req.body.Description,
      Duration: req.body.Duration,
      Instructor: req.body.Instructor,
    });

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create course" });
  }
});


// Route to render add user page
app.get("/register", (req, res) => {
  res.render("register_user", { title: "Add User" });
});

// Route to add a new user
app.post("/register", async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      number: req.body.number,
      index: req.body.finalcourseID,
    });
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Route to render login page
app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// Route to handle user login
app.post("/login", async function (req, res) {
  try {
    const userr = await User.findOne({ username: req.body.name });
    if (userr) {
      const result = req.body.password === userr.password;
      if (result && userr.index==0) {
        
        res.render("0.ejs");
      } 
      else if(result && userr.index==1){
        res.render("1.ejs");
      }
      else if(result && userr.index==2){
        res.render("2.ejs");
      }
      else if(result && userr.index==3){
        res.render("3.ejs");
      }
      else {
        res.status(400).json({ error: "Password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
});

// Route to handle user logout

app.get("/logout", function (req, res) {
  req.logout(req.user, err => {
  if(err) return next(err);
  res.redirect("/");
  });
  res
  .clearCookie("accessToken", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  })
  .status(200)
  .json("Logout successful!");
  });
// Start the server
app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
