import PrepTopic from "../models/PrepTopic.js";

export const createPrepTopic = async (req, res) => {
    try {
        const { topic, totalProblems, solvedProblems } = req.body;

        if (!topic) {
            return res.status(400).json({
                message: "Topic is required",
            });
        }

        if (
            totalProblems < 0 ||
            solvedProblems < 0 ||
            solvedProblems > totalProblems
        ) {
            return res.status(400).json({
                message: "Invalid problem counts",
            });
        }

        const prepTopic = await PrepTopic.create({
            topic,
            totalProblems,
            solvedProblems,
            userId: req.userId,
        });

        res.status(201).json({
            message: "Prep topic created successfully",
            prepTopic,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

export const getPrepTopics = async (req, res) => {
    try {
        const prepTopics = await PrepTopic.find({
            userId: req.userId,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            prepTopics,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

export const updatePrepTopic = async (req, res) => {
    try {
        const prepTopic = await PrepTopic.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!prepTopic) {
            return res.status(404).json({
                message: "Prep topic not found",
            });
        }

        const { topic, totalProblems, solvedProblems } = req.body;

        const newTotalProblems =
            totalProblems ?? prepTopic.totalProblems;

        const newSolvedProblems =
            solvedProblems ?? prepTopic.solvedProblems;

        if (
            newTotalProblems < 0 ||
            newSolvedProblems < 0 ||
            newSolvedProblems > newTotalProblems
        ) {
            return res.status(400).json({
                message: "Invalid problem counts",
            });
        }

        prepTopic.topic = topic ?? prepTopic.topic;
        prepTopic.totalProblems = newTotalProblems;
        prepTopic.solvedProblems = newSolvedProblems;

        await prepTopic.save();

        res.status(200).json({
            message: "Prep topic updated successfully",
            prepTopic,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

export const deletePrepTopic = async (req, res) => {
    try {
        const prepTopic = await PrepTopic.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!prepTopic) {
            return res.status(404).json({
                message: "Prep topic not found",
            });
        }

        await prepTopic.deleteOne();

        res.status(200).json({
            message: "Prep topic deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};