import express from 'express';
import { addComment, getComments, deleteComment } from '../requestHandlers/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

//route to get all comments for a project with id
router.get('/:projectId', getComments);

//route to add a comment to a project with id
router.post('/:projectId', authMiddleware, addComment);

//route to delete a comment with id

router.delete('/:commentId', authMiddleware, deleteComment);

export default router;