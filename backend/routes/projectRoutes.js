import express from 'express';
import { createProject, getMyProjects, getAllProjects, editProject, deleteProject } from '../requestHandlers/projectController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/me', authMiddleware, getMyProjects);
router.get('/', getAllProjects);

router.post('/', authMiddleware, createProject); // Create project route; no image.
router.post("/create", authMiddleware, upload.single("image"), createProject);
router.post("/update/:id", authMiddleware, upload.single("image"), editProject);

router.delete("/delete/:id", authMiddleware, deleteProject); //delete project
export default router;