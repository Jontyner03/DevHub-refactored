import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {getPublicProfile, favoriteProject, getFavorites, updateProfile } from '../requestHandlers/userController.js';
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get('/me', authMiddleware, (req, res) => { 
  res.json(req.user);
});
router.get('/public/:id', getPublicProfile); //get public profile of user with id

router.put("/update-profile", authMiddleware,upload.single("profileImage"), updateProfile); //route to update user profile
router.put('/favorite/:id', authMiddleware, favoriteProject); //route to add proj with id to users favorites
router.get('/favorite/me', authMiddleware, getFavorites); //route to get users favorite projects


export default router;
