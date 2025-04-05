const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/connectDB");
const userRoutes = require("../routers/userRoutes/index");
const adminAuthRoutes = require("../routers/adminRoutes");
const bodyParser = require("body-parser");

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// ✅ Define allowed origins
const allowedOrigins = [
  "https://islanddays.in",
  "https://admin.islanddays.in",
  "http://localhost:3000",
];

// ✅ CORS Setup — Only this one!
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("⛔ Blocked origin by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Prevent browser and CDN caching
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "2gb" }));
app.use(express.urlencoded({ limit: "2gb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api", userRoutes);
app.use("/api/admin", adminAuthRoutes);

// ✅ Database Connection & Start Server
connectDB()
  .then(() => {
    console.log("✅ Database connected on port", port);
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: err.message });
});
