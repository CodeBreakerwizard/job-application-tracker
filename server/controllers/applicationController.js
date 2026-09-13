import Application from "../models/Application.js";

export const createApplication = async (req, res) => {
    try {
        const {
            company,
            role,
            location,
            status,
            appliedDate,
            jobUrl,
            salary,
            notes,
        } = req.body;

        if (!company || !role) {
            return res.status(400).json({
                message: "Company and role are required",
            });
        }

        const application = await Application.create({
            company,
            role,
            location,
            status,
            appliedDate,
            jobUrl,
            salary,
            notes,
            userId: req.userId,
        });

        res.status(201).json({
            message: "Application created successfully",
            application,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

export const getApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            userId: req.userId,
        }).sort({ appliedDate: -1 });

        res.status(200).json({
            applications,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

export const getApplication = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        res.status(200).json({
            application,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

export const updateApplication = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        const {
            company,
            role,
            location,
            status,
            appliedDate,
            jobUrl,
            salary,
            notes,
        } = req.body;

        application.company = company ?? application.company;
        application.role = role ?? application.role;
        application.location = location ?? application.location;
        application.status = status ?? application.status;
        application.appliedDate = appliedDate ?? application.appliedDate;
        application.jobUrl = jobUrl ?? application.jobUrl;
        application.salary = salary ?? application.salary;
        application.notes = notes ?? application.notes;

        await application.save();

        res.status(200).json({
            message: "Application updated successfully",
            application,
        });
    } catch (error) {
        console.error("UPDATE APPLICATION ERROR:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        await application.deleteOne();

        res.status(200).json({
            message: "Application deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};