import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { jwtDecode } from "jwt-decode";

export default function CommentSection({ projectId, isLoggedIn, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxCharLimit = 300;

  const token = localStorage.getItem("token");
  const currentUserId = token ? jwtDecode(token).id : null;


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/comments/${projectId}`);
        setComments(res.data.comments);
      } catch (err) {
        console.error('Failed to fetch comments', err);
      }
    };

    fetchComments();
  }, [projectId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axiosInstance.post(`/comments/${projectId}`, { content: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
      setCharCount(0);
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharLimit) {
      setNewComment(value);
      setCharCount(value.length);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-400">Comments:</h3>
      <div className="max-h-48 overflow-y-auto bg-gray-800 p-4 rounded-lg mt-2">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="mb-4 flex justify-between items-start">
              <div className="flex items-start">
                {comment.user.profileImage && (
                  <img
                    src={comment.user.profileImage}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                )}
                <div className="flex-1">
                  <p className="text-gray-300 break-words">
                    <strong>
                      <Link
                        to={`/u/${comment.user._id}`}
                        className="text-blue-400 hover:underline"
                      >
                        {comment.user.name}
                      </Link>
                    </strong>{' '}
                    {comment.content}
                  </p>
                </div>
              </div>
              {isLoggedIn && comment.user._id === currentUserId && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No comments yet.</p>
        )}
      </div>
      {isLoggedIn ? (
        <div className="mt-4">
          <textarea
            className="w-full p-3 bg-gray-800 text-white rounded-lg resize-none"
            placeholder="Write a comment..."
            value={newComment}
            onChange={handleInputChange}
          ></textarea>
          <p className={`text-sm ${charCount === maxCharLimit ? 'text-red-500' : 'text-gray-400'}`}>
            {charCount}/{maxCharLimit} characters
          </p>
          <button
            onClick={handleAddComment}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={!newComment.trim() || charCount > maxCharLimit}
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-gray-400">
            You must{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              log in
            </Link>{' '}
            or{' '}
            <Link to="/signup" className="text-blue-400 hover:underline">
              create an account
            </Link>{' '}
            to leave a comment.
          </p>
        </div>
      )}
    </div>
  );
}