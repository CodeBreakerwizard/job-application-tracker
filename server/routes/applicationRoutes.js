import express from "express";
import {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication,
} from "../controllers/applicationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createApplication);
router.get("/", protect, getApplications);
router.get("/:id", protect, getApplication);
router.put("/:id", protect, updateApplication);
router.delete("/:id", protect, deleteApplication);

export default router;