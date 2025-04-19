import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { jwtDecode } from "jwt-decode";
import Comment from "./Comment";
import DOMPurify from "dompurify";

export default function CommentSection({ projectId, isLoggedIn, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); 
  const [charCount, setCharCount] = useState(0);
  const [commentToDelete, setCommentToDelete] = useState(null); //Track the comment being deleted for conf
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchComments();
  }, [projectId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      //sanitize comment before sending to the server
      const sanitizedComment = DOMPurify.sanitize(newComment, {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "br", "span"],
        ALLOWED_ATTR: ["href", "target", "rel", "class"], // Allow safe attributes
      });

      const res = await axiosInstance.post(`/comments/${projectId}`, {
        content: sanitizedComment,
      });
      setComments([res.data, ...comments]); //comment added to top 
      setNewComment(""); 
      setCharCount(0);
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId) //rmv comment from state
      );
      setCommentToDelete(null); //trigger popup close
    } catch (err) {
      console.error("Failed to delete comment", err);
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
      <div className="comments-container max-h-48 overflow-y-auto bg-gray-800 p-4 rounded-lg mt-2">
      {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="loader"></div> 
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              isLoggedIn={isLoggedIn}
              currentUserId={currentUserId}
              onDeleteClick={setCommentToDelete}
              highlight={commentToDelete?._id === comment._id}
            />
          ))
        ) : (
          <p className="text-gray-400">No comments yet.</p>
        )}
      </div>
      {isLoggedIn ? (
        <div className="mt-4">
          <textarea
            id="commentInput"
            name="commentInput"
            className="w-full p-3 bg-gray-800 text-white rounded-lg resize-none"
            placeholder="Write a comment..."
            value={newComment}
            onChange={handleInputChange}
          ></textarea>
          <p
            className={`text-sm ${
              charCount === maxCharLimit ? "text-red-500" : "text-gray-400"
            }`}
          >
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
            You must{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              log in
            </Link>{" "}
            or{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              create an account
            </Link>{" "}
            to leave a comment.
          </p>
        </div>
      )}

      {/* Confirmation Popup for deleing comments */}
      {commentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this comment?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setCommentToDelete(null)} // Cancel deletion
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteComment(commentToDelete._id)} // Confirm deletion
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}