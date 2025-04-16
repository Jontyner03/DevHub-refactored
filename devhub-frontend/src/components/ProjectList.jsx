import Project from "./Project";

export default function ProjectList({ projects, favorites, technologyIcons, showDeleteButton, onDelete, onFavoriteToggle, isLoggedIn }) {
  return (
    <div className="grid gap-6">
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
        />
      ))}
    </div>
  );
}