const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); 
exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Your Email is not registered with us."
            });
        }

        // Generate token
        const token = crypto.randomUUID();

        // Fix: Correct `email` typo and store correct expiry time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email }, // Fix typo here
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000 // Store expiry timestamp
            },
            { new: true }
        );

        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`);

        return res.status(200).json({
            success: true,
            message: "Password Reset mail sent successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Could not send reset password mail"
        });
    }
};

// Reset Password Using Token
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Find user by token
        const userDetails = await User.findOne({ token: token });

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Token is not valid"
            });
        }

        // Fix: Compare expiry time correctly
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token expired, please try generating again"
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and remove token
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword, token: null, resetPasswordExpires: null }, // Clear token after reset
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Password not reset, please try again"
        });
    }
};
