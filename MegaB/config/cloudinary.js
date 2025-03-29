const cloudinary = require("cloudinary").v2; // Use `.v2` to avoid issues
require("dotenv").config();

const cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET, // Fix typo from api_Secret to api_secret
        });
        console.log("Cloudinary Connected Successfully");
    } catch (error) {
        console.error("Error connecting to Cloudinary:", error);
    }
};

module.exports = cloudinaryConnect;