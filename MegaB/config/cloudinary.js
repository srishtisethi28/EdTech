const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });

        console.log("Cloudinary Configured Successfully:", cloudinary.config());
    } catch (error) {
        console.error("Error connecting to Cloudinary:", error);
    }
};

module.exports = cloudinaryConnect;
