const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

const authRoutes = require("./routes/authRoutes"); // Your auth routes
const customerRoutes = require("./routes/customerRoutes");
const activityRoutes = require("./routes/activityRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/activities", activityRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
