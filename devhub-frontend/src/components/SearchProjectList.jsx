import { useState, useEffect } from "react";
import Project from "./Project";
import CommentSection from "./CommentSection";
import CreateProjTagSelector from "./CreateProjTagSelector";

export default function SearchProjectList({
  projects,
  favorites,
  technologyIcons,
  showDeleteButton,
  onDelete,
  onFavoriteToggle,
  isLoggedIn,
  refreshProjects,
  pinnedProjects,
  onPinToggle,
}) {
  const [selectedProject, setSelectedProject] = useState(null); //Track the selected project
  const [commentAdded, setCommentAdded] = useState(false); //Track if a comment was added
  const [filteredProjects, setFilteredProjects] = useState(projects); //Filter projects passed as props
  const [selectedTags, setSelectedTags] = useState([]); //track selected tags

  // Filter and sort projects whenever selectedTags or projects change
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredProjects(projects); // Show all projects if no tags are selected
    } else {
      const tags = selectedTags.map((tag) => tag.name.toLowerCase());
      const filtered = projects
        .filter((project) =>
          project.technologies.some((tech) => tags.includes(tech.toLowerCase()))
        )
        .sort((a, b) => {
          const aMatches = a.technologies.filter((tech) =>
            tags.includes(tech.toLowerCase())
          ).length;
          const bMatches = b.technologies.filter((tech) =>
            tags.includes(tech.toLowerCase())
          ).length;
          return bMatches - aMatches;
        });

      setFilteredProjects(filtered);
    }
  }, [selectedTags, projects]);

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
    <div>
      <div className="mb-4">
        <CreateProjTagSelector
          name="Project Tags"
          prompt="Select or add tags to filter projects"
          availableTags={Array.from(
            new Set(projects.flatMap((project) => project.technologies))
          ).map((tech) => ({
            name: tech,
            icon: technologyIcons[tech] || null,
          }))} // Pass available tags to the selector as a unique enforced set
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>

      <div className="grid gap-6 max-w-7xl mx-auto">
        {filteredProjects.map((project) => (
          <Project
            key={project._id}
            project={project}
            isFavorite={favorites.includes(project._id)}
            technologyIcons={technologyIcons}
            showDeleteButton={showDeleteButton}
            onDelete={onDelete}
            onFavoriteToggle={onFavoriteToggle}
            isLoggedIn={isLoggedIn}
            isPinned={pinnedProjects.includes(project._id)}
            onPinToggle={onPinToggle} 
            onClick={() => handleProjectClick(project)}
            showComments={true}             
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
              isPinned={pinnedProjects.includes(selectedProject._id)}
              onPinToggle={onPinToggle} 
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