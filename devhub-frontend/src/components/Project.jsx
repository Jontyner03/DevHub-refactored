import { Link } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Project({ project, technologyIcons, showDeleteButton, onDelete }) {
  const [isFavorite, setIsFavorite] = useState(project.isFavorite || false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  //handles favorite toggle, adds or removes project from favorites based on curr value in db
  const handleFavoriteToggle = async (e) => {
    try {
      await axiosInstance.put(`/users/favorite/${project._id}`);
      setIsFavorite((prev) => !prev); //Toggle favorite status
    } catch (err) {
      console.error("Failed to update favorite status", err);
    }
  };

  const handleDelete = async (e) => {
    try {
      await axiosInstance.delete(`/projects/delete/${project._id}`);
      onDelete(project._id); //Notify parent component to remove the project from the list
      setShowConfirmPopup(false);
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  return (
    <div className="relative border border-gray-700 rounded-lg p-5 shadow-md hover:shadow-lg transition">
      {showDeleteButton && (
        <>
          <button
            onClick={() => {
             
              setShowConfirmPopup(true);
            }}
            className="absolute top-2 right-2 text-red-500 text-xl font-bold project-button"
            title="Delete Project"
          >
            ✕
          </button>
          {showConfirmPopup && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                <p className="mb-4">Are you sure you want to delete this project?</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={(e) => {
                      setShowConfirmPopup(false);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 project-button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 project-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <h2 className="text-2xl font-semibold text-blue-400 mb-2 flex items-center">
        {project.title}
        <button
          onClick={handleFavoriteToggle}
          className={`ml-0 text-xl font-bold project-button ${
            isFavorite ? "text-yellow-400" : "text-gray-400"
          } hover:text-yellow-500`}
          title={isFavorite ? "Unfavorite Project" : "Favorite Project"}
        >
          ★
        </button>
      </h2>
      <p className="text-gray-300 mb-4">{project.description}</p>
      {project.link && (
        <a
          href={project.link}
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Project ↗
        </a>
      )}
      {project.image && (
        <img
          src={project.image}
          alt="Project"
          className="w-full h-auto object-cover rounded-lg mt-4"
        />
      )}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-400">Technologies:</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.technologies.map((tech) => (
            <div key={tech} className="flex items-center bg-gray-800 text-white px-3 py-1 rounded-full shadow">
              {technologyIcons[tech] && (
                <img src={technologyIcons[tech]} alt={tech} className="w-4 h-4 mr-2" />
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
    </div>
  );
}
