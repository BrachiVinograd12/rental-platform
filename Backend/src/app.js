const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const propertyRoutes = require("./routes/propertyRoutes");

app.use("/api/properties", propertyRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Rental Platform API is running"
    });
});

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();
