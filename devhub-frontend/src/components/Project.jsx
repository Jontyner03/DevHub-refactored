import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../api/axiosInstance";
import { FaStar, FaThumbtack } from "react-icons/fa"; 

export default function Project({
  project,
  isFavorite,
  technologyIcons,
  showDeleteButton,
  onDelete,
  onFavoriteToggle,
  isLoggedIn,
  onClick,
  showComments,
  isPinned, 
  onPinToggle,
}) {
  
  const [favorite, setFavorite] = useState(isFavorite); // Use the prop to set initial state
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [comments, setComments] = useState([]); //Store comments for the project
  const [hasMoreComments, setHasMoreComments] = useState(false); //Track if more than limit projec
  const [pinned, setPinned] = useState(isPinned); 
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  
  //validate user from token, let isLoggedin prop control toggle present for read only
  let userId = null; 
  const userToken = localStorage.getItem("token"); 
  if (userToken) {
    const decodedToken = jwtDecode(userToken); 
    userId = decodedToken.id; 
  }


  //Update favorite state based on prop change passed from parent component
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    setPinned(isPinned);
  }, [isPinned]);

  const handlePinToggle = async (e) => {
    try {
      await onPinToggle(project._id); 
      setPinned((prev) => !prev);
    } catch (err) {
      console.error("Failed to update pin status", err);
    }
  };


  //Fetch the first 2 comments for the project
  useEffect(() => {
    if (showComments) {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/comments/${project._id}?limit=2`);
        setComments(res.data.comments);
        setHasMoreComments(res.data.hasMore); //Backend should return true if there are more comments
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };

    fetchComments();
  }
  }, [project._id], showComments); //show comments when project ID changes or showComments is true


  useEffect(() => {
    if (project.comments) {
      setComments(project.comments); //use the updated comments from the project prop
      setHasMoreComments(project.hasMoreComments || false);
    }
  }, [project.comments]);

  const handleFavoriteToggle = async () => {
    try {
      await onFavoriteToggle(project._id); // Call the parent handler
      setFavorite((prev) => !prev); //Update local state after frontend post request
    } catch (err) {
      console.error("Failed to update favorite status", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/projects/delete/${project._id}`);
      onDelete(project._id);
      setShowConfirmPopup(false);
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent triggering the modal
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };
  return (
  <div
    className="relative border border-gray-700 rounded-lg p-5 shadow-md hover:shadow-lg transition cursor-pointer sm:p-6"
    onClick={onClick}
  >
    {showDeleteButton && (
      <>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirmPopup(true);
          }}
          className="absolute top-2 right-2 text-red-500 text-xl font-bold project-button sm:text-2xl"
          title="Delete Project"
        >
          ✕
        </button>
        {showConfirmPopup && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg sm:p-8">
              <p className="mb-4">Are you sure you want to delete this project?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirmPopup(false);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 project-button sm:px-6 sm:py-3"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 project-button sm:px-6 sm:py-3"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )}
      <h2 className="text-2xl text-blue-400 mb-2 flex items-center justify-between sm:text-3xl">
        {project.title}
        {isLoggedIn && !showDeleteButton && ( //indicates modal open
          <div className="relative">
            <div
              onClick={toggleDropdown}
              className="p-2 cursor-pointer rounded-full hover:bg-gray-700 transition"
              title="Options"
            >
              <button
                className="text-gray-400 focus:outline-none hover:text-white transition pointer-events-none"
              >
                ⋮
              </button>
            </div>
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-32 bg-gray-800 text-white rounded-lg shadow-lg z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle();
                    closeDropdown();
                  }}
                  className="dropdown-button flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-700 transition text-sm"
                >
                  <FaStar className={favorite ? "text-yellow-400" : "text-gray-400"} />
                  {favorite ? "Unfavorite" : "Favorite"}
                </button>
                {project.user._id === userId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePinToggle();
                      closeDropdown();
                    }}
                    className="dropdown-button flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-700 transition text-sm"
                  >
                    <FaThumbtack className={pinned ? "text-green-400" : "text-gray-400"} />
                    {pinned ? "Unpin" : "Pin"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </h2>
    <p className="text-gray-300 mb-4 sm:text-lg">{project.description}</p>
    {project.link && (
      <a
        href={project.link}
        className="text-blue-500 hover:underline sm:text-lg"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit Project ↗
      </a>
    )}
    {project.image && (
      <div className="flex justify-center items-center mt-4">
        <img
          src={project.image}
          alt="Project"
          className="w-full max-w-[300px] max-h-[300px] object-contain rounded-lg shadow-md sm:max-w-[400px] sm:max-h-[400px]"
        />
      </div>
    )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-400">Technologies:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.technologies.map((tech) => (
              <div
                key={tech}
                className="flex items-center bg-gray-800 text-white px-3 py-1 rounded-full shadow"
              >
                {technologyIcons[tech] && (
                  <img
                    src={technologyIcons[tech]} //Local SVG's
                    alt={tech}
                    className="w-4 h-4 mr-2"
                  />
                )}
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-400">Categories:</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.categories.map((category) => (
            <span key={category} className="bg-blue-500 text-white px-3 py-1 rounded-full shadow">
              {category}
            </span>
          ))}
        </div>
      </div>
      {project.user && (
        <p className="text-sm text-gray-400 mt-2">
          by:{" "}
          <Link to={`/u/${project.user._id}`} className="text-blue-500 hover:underline">
            {project.user.name}
          </Link>
        </p>
      )}
      {/* TO DO: long strings with no spaces breaksd frontend layout */}
  {((comments.length > 0 ) && (showComments))&&(
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-400">Comments:</h3>
      <ul className="comments-container text-gray-300 bg-gray-800 p-2 rounded-lg">
        {comments.map((comment) => (
          <li key={comment._id} className="mb-4 flex items-center">
            {comment.user.profileImage && (
              <img
                src={comment.user.profileImage}
                alt={comment.user.name}
                className="w-6 h-6 rounded-full mr-3"
              />
            )}
            <div>
              <p className="text-gray-300 break-words">
                <strong>{comment.user.name}:</strong> {comment.content}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {hasMoreComments && (
        <p className="text-blue-500 hover:underline cursor-pointer">
          Click to view more
        </p>
      )}
    </div>
  )}
    </div>
  );
}