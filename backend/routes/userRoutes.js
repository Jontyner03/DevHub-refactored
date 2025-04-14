import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { updateMe, getPublicProfile, updateSocials, updateProfileImage, favoriteProject, getFavoriteProjects } from '../requestHandlers/userController.js';
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get('/me', authMiddleware, (req, res) => { 
  res.json(req.user);
});
router.put('/me', authMiddleware, updateMe); //update user profile with bio

router.get('/public/:id', getPublicProfile); //get public profile of user with id

router.put(
  "/update",
  authMiddleware,
  upload.single("profileImage"),
  updateProfileImage
); //update profile image in user profile

router.put("/socials", authMiddleware, updateSocials); //update social links in user profile
router.put('/favorite/:id', authMiddleware, favoriteProject); //route to add proj with id to users favorites

//get users fav projects
router.get('/favorites', authMiddleware, getFavoriteProjects);

export default router;
