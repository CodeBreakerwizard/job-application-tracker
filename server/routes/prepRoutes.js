import express from "express";

import {
    createPrepTopic,
    getPrepTopics,
    updatePrepTopic,
    deletePrepTopic,
} from "../controllers/prepController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPrepTopic);
router.get("/", protect, getPrepTopics);
router.put("/:id", protect, updatePrepTopic);
router.delete("/:id", protect, deletePrepTopic);

export default router;