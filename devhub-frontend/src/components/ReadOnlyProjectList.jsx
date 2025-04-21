import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import Project from "./Project";
import CommentSection from "./CommentSection";

export default function ReadOnlyProjectList({ projects, technologyIcons }) {
  const [selectedProject, setSelectedProject] = useState(null); 
  const [comments, setComments] = useState([]); 
  const [loadingComments, setLoadingComments] = useState(false); 

  const handleProjectClick = async (project) => {
    setSelectedProject(project); 
    document.body.style.overflow = "hidden"; 

    
    try {
      setLoadingComments(true);
      const res = await axiosInstance.get(`/comments/${project._id}`);
      setComments(res.data.comments); 
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const closeModal = () => {
    setSelectedProject(null);
    setComments([]); 
    document.body.style.overflow = "auto"; 
  };

  return (
    <div>
      <div className="grid gap-6 max-w-7xl mx-auto">
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => handleProjectClick(project)} 
            className="cursor-pointer"
          >
            <Project
              project={project}
              technologyIcons={technologyIcons}
              isLoggedIn={false} 
              showDeleteButton={false} 
              showComments={false} 
            />
          </div>
        ))}
      </div>

      {/* Modal for Selected Project */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-10"
          onClick={closeModal}
        >
          <div
            className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            {/* render proj*/}
            <Project
              project={selectedProject}
              technologyIcons={technologyIcons}
              isLoggedIn={false} //disable togggles
              showDeleteButton={false} //no del
              showComments={false} // no comments on proj card
            />
            {/* Comments Section */}
            {loadingComments ? (
              <p className="text-gray-400">Loading comments...</p>
            ) : (
              <CommentSection
                projectId={selectedProject._id}
                comments={comments} 
                isLoggedIn={true} //Allow users to add comments if logged in
                onCommentAdded={async () => {
                  //refresh comments after adding 
                  try {
                    const res = await axiosInstance.get(`/comments/${selectedProject._id}`);
                    setComments(res.data.comments);
                  } catch (err) {
                    console.error("Failed to refresh comments", err);
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}