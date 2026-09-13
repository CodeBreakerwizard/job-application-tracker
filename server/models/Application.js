import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true,
        },

        role: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "OA",
                "Interview",
                "Offer",
                "Rejected",
                "Withdrawn",
            ],
            default: "Applied",
        },

        appliedDate: {
            type: Date,
            default: Date.now,
        },

        jobUrl: {
            type: String,
            trim: true,
        },

        salary: {
            type: Number,
        },

        notes: {
            type: String,
            trim: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

export default Application;