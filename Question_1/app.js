const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const app = express();
app.set("view engine", "ejs");
app.set("views", __dirname); // ejs views kept in same folder
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Session middleware
app.use(
  session({
    store: new FileStore({ path: path.join(__dirname, "sessions") }),
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 5 * 60 * 1000 } // 5 minutes
  })
);

let savedData = null; // hold registration data

// ---------- Multer setup for file upload ----------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ---------- Registration form ----------
app.get("/register", (req, res) => {
  res.render("form", { errors: [], old: {} });
});

// ---------- Handle Registration ----------
app.post(
  "/register",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "otherPics", maxCount: 5 }
  ]),
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("hobbies").notEmpty().withMessage("Select at least one hobby")
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("form", { errors: errors.array(), old: req.body });
    }

    // save user (simulate DB)
    savedData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password, // store hashed in real apps!
      gender: req.body.gender,
      hobbies: Array.isArray(req.body.hobbies)
        ? req.body.hobbies
        : [req.body.hobbies],
      profilePic: req.files["profilePic"]
        ? req.files["profilePic"][0].filename
        : null,
      otherPics: req.files["otherPics"]
        ? req.files["otherPics"].map((f) => f.filename)
        : []
    };

    res.render("success", { data: savedData });
  }
);

// ---------- Download JSON ----------
app.get("/download", (req, res) => {
  if (!savedData) {
    return res.send("No data available to download!");
  }
  const filePath = path.join(__dirname, "uploads", "userdata.json");
  fs.writeFileSync(filePath, JSON.stringify(savedData, null, 2));
  res.download(filePath, "userdata.json");
});

// ---------- Login ----------
app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/welcome");
  }
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/login", (req, res) => {
  const { email, pass } = req.body;

  if (savedData && email === savedData.email && pass === savedData.password) {
    req.session.user = { email };
    return res.redirect("/welcome");
  } else {
    // popup + redirect
    return res.send(`
      <script>
        alert("Invalid credentials! Please try again.");
        window.location.href = "/";
      </script>
    `);
  }
});

// ---------- Protected Page ----------
app.get("/welcome", (req, res) => {
  if (!req.session.user) return res.redirect("/");
  res.send(
    `<h2>Welcome, ${req.session.user.email}</h2><a href="/logout">Logout</a>`
  );
});

// ---------- Logout ----------
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send("Error logging out");
    res.send("<h3>You are logged out</h3><a href='/'>Login again</a>");
  });
});

app.listen(3000, () =>
  console.log("✅ Server running at http://localhost:3000")
);
