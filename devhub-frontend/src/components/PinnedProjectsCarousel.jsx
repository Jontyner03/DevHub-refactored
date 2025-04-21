import React, { useState } from "react";
import Slider from "react-slick";
import Project from "./Project";
import CommentSection from "./CommentSection";

export default function PinnedProjectsCarousel({
  pinnedProjects,
  favorites,
  technologyIcons,
  onFavoriteToggle,
  isLoggedIn,
  refreshProjects,
  onPinToggle,
})
 {
  const [selectedProject, setSelectedProject] = useState(null); 
  const [commentAdded, setCommentAdded] = useState(false);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = "hidden"; 
  };

  const closeModal = async () => {
    if (selectedProject) {
      await refreshProjects(selectedProject._id); 
      setCommentAdded(false); 
    }
    setSelectedProject(null);
    document.body.style.overflow = "auto"; 
  };

  const settings = {
    dots: true,
    infinite: pinnedProjects.length > 1,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="pinned-projects-carousel">
      <h2 className="text-4xl font-semibold mb-3">Pinned Projects</h2>
      {pinnedProjects.length > 0 ? (
        <Slider {...settings}>
          {pinnedProjects.map((project) => (
            <div key={project._id} className="p-4">
              <Project
                project={project}
                isFavorite={favorites.includes(project._id)}
                technologyIcons={technologyIcons}
                showDeleteButton={false}
                onFavoriteToggle={onFavoriteToggle}
                isLoggedIn={isLoggedIn}
                onClick={() => handleProjectClick(project)} 
                showComments={false}
                isPinned={pinnedProjects.some((p) => p._id === project._id)} //check if pin is still active or rmvd
                onPinToggle={onPinToggle}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-gray-400">No pinned projects to display.</p>
      )}

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
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="modal-close-button absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <Project
              project={selectedProject}
              isFavorite={favorites.includes(selectedProject._id)}
              technologyIcons={technologyIcons}
              isPinned={pinnedProjects.some((p) => p._id === selectedProject._id)} 
              showDeleteButton={false}
              onFavoriteToggle={onFavoriteToggle}
              isLoggedIn={isLoggedIn}
              showComments={true}
              onPinToggle={onPinToggle}
            />
            <CommentSection
              projectId={selectedProject._id}
              isLoggedIn={isLoggedIn}
              onCommentAdded={() => setCommentAdded(true)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}