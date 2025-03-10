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
const port = process.env.PORT || 8000;

// ✅ LOG ORIGIN TO DEBUG CORS ISSUES
// const allowedOrigins = ["https://admin.islanddays.in", "https://islanddays.in"];

// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log("Incoming request from origin:", origin); // ✅ Debugging
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // ✅ Required if sending cookies
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

app.use(cors());

// ✅ Middleware
app.use(cookieParser());
app.use(express.json({ limit: "2gb" }));
app.use(express.urlencoded({ limit: "2gb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api", userRoutes);
app.use("/api/admin", adminAuthRoutes);

// ✅ Database Connection & Server Start
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

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: err.message });
});
