import { useState } from "react";
import Project from "./Project";
import CommentSection from "./CommentSection";


export default function ProjectList({ projects, favorites, 
  technologyIcons, showDeleteButton, onDelete,
   onFavoriteToggle, isLoggedIn, refreshProjects,  }) {

  const [selectedProject, setSelectedProject] = useState(null); //Track the selected project
  const [commentAdded, setCommentAdded] = useState(false); //Track if a comment was added
    
  const handleProjectClick = (project) => {
    setSelectedProject(project); 
    document.body.style.overflow = "hidden"; 
  };

  const closeModal = async () => {
    if (selectedProject) {
      await refreshProjects(selectedProject._id); //Refresh comments for the selected project
      setCommentAdded(false); //reset signal flag; refresh set to false 
    }
    setSelectedProject(null);
    document.body.style.overflow = "auto";
  };



  return (
    <div className=" ">
      <div className="grid gap-6 max-w-7xl mx-auto">
        {projects.map((project) => (
          <Project
            key={project._id}
            project={project}
            isFavorite={favorites.includes(project._id)}
            technologyIcons={technologyIcons}
            showDeleteButton={showDeleteButton}
            onDelete={onDelete}
            onFavoriteToggle={onFavoriteToggle}
            isLoggedIn={isLoggedIn}
            onClick={() => handleProjectClick(project)} // Open modal on click
            showComments={true} // Show comments section in the project card
            
          />
        ))}
      </div>

      {/* Modal/Popoup for the selected project */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-10"
          onClick={closeModal} //click anywhere outside the modal to close it
        >
          <div
            className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} //prevent click propagation while in popup
          >
            <button
              onClick={(e) => {
                e.stopPropagation(); //prevent click propagation while in popup
                closeModal(); //close popup

              }}
              className="modal-close-button absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            {/* Render the full project card */}
            <Project
              project={selectedProject}
              isFavorite={favorites.includes(selectedProject._id)}
              technologyIcons={technologyIcons}
              showDeleteButton={false} //No delete button in modal
              onFavoriteToggle={onFavoriteToggle}
              isLoggedIn={isLoggedIn}
            />
            {/* Comments Section */}
            <CommentSection
             projectId={selectedProject._id} 
            isLoggedIn={isLoggedIn} 
            onCommentAdded={() => setCommentAdded(true)} //signal that a comment was added
            />
          </div>
        </div>
      )}
    </div>
  );
}