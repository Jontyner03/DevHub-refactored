import Comment from '../schema/Comment.js';
import Project from '../schema/Project.js';


export const addComment = async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newComment = new Comment({
      project: projectId,
      user: req.user._id,
      content,
    });

    const savedComment = await newComment.save();
    const populatedComment = await savedComment.populate('user', 'name profileImage'); 
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

//get comments for project; optional limit query param 
export const getComments = async (req, res) => {
    const { projectId } = req.params;
    const { limit = 0 } = req.query; //Default to no limit
  
    try {
        const limitValue = parseInt(limit, 10) || 0; 
        const comments = await Comment.find({ project: projectId })
          .populate('user', 'name profileImage')
          .sort({ createdAt: -1 })
          .limit(limitValue);
  
      const totalComments = await Comment.countDocuments({ project: projectId });
      const hasMore = totalComments > comments.length;
  
      res.json({ comments, hasMore });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch comments' });
    }
  };

// Delete comment
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    //Ensure the user is the owner of the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};