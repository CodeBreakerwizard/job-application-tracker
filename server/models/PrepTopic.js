import mongoose from "mongoose";

const prepTopicSchema = new mongoose.Schema(
    {
        topic: {
            type: String,
            required: true,
            trim: true,
        },

        totalProblems: {
            type: Number,
            default: 0,
        },

        solvedProblems: {
            type: Number,
            default: 0,
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

const PrepTopic = mongoose.model(
    "PrepTopic",
    prepTopicSchema
);

export default PrepTopic;