
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const tenantRoutes = require("./routes/tenantRoutes");
const productRoutes = require("./routes/productRoutes");
const propertyRoutes = require("./routes/propertyRoutes");

// Create the app BEFORE using app.use()
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());

// Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/products", productRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Rental Platform API is running",
  });
});

// Start server
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
