const mongoose = require("mongoose");

async function connectDB() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("MongoDB connection failed: MONGODB_URI is not set in the environment.");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed. Check MONGODB_URI, Atlas user credentials, and network access.");
        process.exit(1);
    }
}

module.exports = connectDB;
