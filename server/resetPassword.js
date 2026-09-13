import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = "gettest@gmail.com";
        const newPassword = "Test@12345";

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            console.log("User not found");
            process.exit(1);
        }

        console.log("Password reset successfully");
        console.log("Email:", email);
        console.log("New password:", newPassword);

        process.exit(0);
    } catch (error) {
        console.error("Password reset failed:", error);
        process.exit(1);
    }
};

resetPassword();