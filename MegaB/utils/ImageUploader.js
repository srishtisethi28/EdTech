const cloudinary = require("../config/cloudinary"); // Ensure correct path

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        if (!file || !file.tempFilePath) {
            throw new Error("Invalid file input. Ensure the file is uploaded correctly.");
        }

        const options = { folder, resource_type: "auto" };

        if (height) options.height = height;
        if (quality) options.quality = quality;

        console.log("Uploading to Cloudinary with options:", options); // Debugging

        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        console.log("✅ Image uploaded successfully:", result);
        return result;
    } catch (error) {
        console.error("❌ Error uploading image to Cloudinary:", error);
        throw new Error("Image upload failed");
    }
};
