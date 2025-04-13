import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { updateMe, getPublicProfile, updateSocials, updateProfileImage } from '../requestHandlers/userController.js';
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});
router.put('/me', authMiddleware, updateMe);

router.get('/public/:id', getPublicProfile);

router.put(
  "/update",
  authMiddleware,
  upload.single("profileImage"),
  updateProfileImage
);

router.put("/socials", authMiddleware, updateSocials);

export default router;
