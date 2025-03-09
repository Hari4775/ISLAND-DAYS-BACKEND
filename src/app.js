const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/connectDB");
const userRoutes = require("../routers/userRoutes/index");
const adminAuthRoutes = require("../routers/adminRoutes");

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8000; // Use 8000 from .env, fallback to 8000

// Allowed Origins
const allowedOrigins = ["https://islanddays.in", "https://admin.islanddays.in"];

// CORS Configuration
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true); // Allow server-to-server requests (Postman, mobile apps)
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("CORS policy does not allow this origin."), false);
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, // Important for handling cookies and authentication
    })
);

// Handle Preflight Requests Properly
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(204); // No content for preflight requests
});

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "2gb" }));
app.use(express.urlencoded({ limit: "2gb", extended: true }));

// Routes
app.use("/api", userRoutes);
app.use("/api/admin", adminAuthRoutes);

// Database Connection & Server Start
connectDB()
    .then(() => {
        console.log("Database connection established on port", port);
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: err.message });
});
