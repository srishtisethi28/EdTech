const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Verify Cloudinary Config
console.log("Cloudinary Config:", cloudinary.config()); // Should print correct config

module.exports = cloudinary;
